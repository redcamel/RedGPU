import RedGPUContext from '../../../context/RedGPUContext';
import ResourceManager from '../../../resources/core/resourceManager/ResourceManager';
import Landscape from '../core/Landscape';
import {FoliageType, FoliageTypeOptions} from './FoliageType';
import foliageInstancedWGSL from './shader/foliageInstanced.wgsl';

/**
 * LandscapeFoliageManager
 * Landscape 지형 엔진 연동 및 수십만 개 식생 인스턴스 렌더링 총괄 매니저
 * (RedGPU 정석 AntialiasingManager.msaaID 연동 및 PBRMaterial 프래그먼트 셰이더 바인딩)
 */
export class LandscapeFoliageManager {
    readonly landscape: Landscape;
    readonly redGPUContext: RedGPUContext;

    #vertexShaderModule: GPUShaderModule | null = null;
    #foliageTypes: Map<string, FoliageType> = new Map();
    #typeList: FoliageType[] = [];
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();

    constructor(landscape: Landscape) {
        this.landscape = landscape;
        this.redGPUContext = landscape.redGPUContext;
        this.#initVertexShader();
    }

    get hasFoliageTypes(): boolean {
        return this.#typeList.length > 0;
    }

    /**
     * 렌더 패스 엔코더에 인스턴스드 드로우콜 바인딩 및 디스패치 (RedGPU 정석 msaaID & View3D 매칭)
     */
    render(view: any, passEncoder: GPURenderPassEncoder): void {
        const typeList = this.#typeList;
        const typeCount = typeList.length;
        if (!passEncoder || typeCount === 0) return;

        // RedGPU 정석 View3D & System Uniform BindGroup 및 AntialiasingManager 추출
        const view3D = view?.view || view;
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup || (this.redGPUContext as any)?.systemUniform_Vertex_UniformBindGroup;

        const antialiasingManager = view3D?.antialiasingManager || (this.redGPUContext as any)?.antialiasingManager;
        const useMSAA = antialiasingManager?.useMSAA ?? true;
        const msaaID = antialiasingManager?.msaaID ?? 'default_msaa_id';
        const sampleCount = useMSAA ? 4 : 1;

        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) continue;

            const instanceGPUBuffer = foliageType.instanceBuffer.getGPUBuffer();
            if (!instanceGPUBuffer) continue;

            const mesh = foliageType.mesh;
            const geometry = mesh?.geometry;
            const material = mesh?.material;
            if (!geometry || !material) continue;

            const vertexBufferObj = geometry.vertexBuffer;
            const indexBufferObj = geometry.indexBuffer;
            const vertexGPUBuffer = vertexBufferObj?.gpuBuffer;
            const indexGPUBuffer = indexBufferObj?.gpuBuffer;

            if (!vertexGPUBuffer) continue;

            // Geometry Stride (Float 개수인 경우 4를 곱해 Byte 크기로 정밀 변환, 기본 48바이트)
            const rawStride = (vertexBufferObj as any)?.stride || 12;
            const strideBytes = rawStride > 16 ? rawStride : rawStride * 4;

            // RedGPU 정석 msaaID & StrideBytes 호환 파이프라인 생성/가져오기
            const pipeline = this.#getOrCreatePipeline(material, sampleCount, msaaID, strideBytes);
            if (!pipeline) continue;

            passEncoder.setPipeline(pipeline);

            // Group 0: System Uniform BindGroup
            if (systemBG) {
                passEncoder.setBindGroup(0, systemBG);
            }

            // Group 2: Material Uniform BindGroup (PBRMaterial, StandardMaterial 등)
            const matUniformBG = material.gpuRenderInfo?.fragmentUniformBindGroup;
            if (matUniformBG) {
                passEncoder.setBindGroup(2, matUniformBG);
            }

            // Buffer 0: Geometry Vertex Buffer
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            // Buffer 1: Foliage Instance Buffer
            passEncoder.setVertexBuffer(1, instanceGPUBuffer);

            const indirectGPUBuffer = foliageType.instanceBuffer.getIndirectGPUBuffer();
            if (!indirectGPUBuffer) continue;

            // Index 렌더링 vs Non-Index 렌더링 (WebGPU Indirect Draw)
            if (indexGPUBuffer) {
                const elementCount = indexBufferObj.indexCount;
                foliageType.instanceBuffer.updateIndirectBuffer(elementCount, activeCount);

                const format = (indexBufferObj as any)?.indexFormat || 'uint32';
                passEncoder.setIndexBuffer(indexGPUBuffer, format);
                passEncoder.drawIndexedIndirect(indirectGPUBuffer, 0);
            } else if (vertexBufferObj) {
                const elementCount = vertexBufferObj.vertexCount;
                foliageType.instanceBuffer.updateIndirectBuffer(elementCount, activeCount);

                passEncoder.drawIndirect(indirectGPUBuffer, 0);
            }
        }
    }

    update(camX: number, camY: number, camZ: number): void;
    update(cameraPosition: [number, number, number]): void;
    update(camXOrPos: number | [number, number, number], camY?: number, camZ?: number): void {
        let x: number, y: number, z: number;
        if (typeof camXOrPos === 'number') {
            x = camXOrPos;
            y = camY!;
            z = camZ!;
        } else {
            x = camXOrPos[0];
            y = camXOrPos[1];
            z = camXOrPos[2];
        }

        const typeList = this.#typeList;
        const typeCount = typeList.length;

        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) continue;

            const buffer = foliageType.instanceBuffer;
            const cullingDist = foliageType.options.cullingDistance;
            const fadeStartDist = foliageType.options.fadeStartDistance;
            const cullingDistSq = cullingDist * cullingDist;
            const fadeStartDistSq = fadeStartDist * fadeStartDist;
            const invFadeRange = 1.0 / Math.max(cullingDist - fadeStartDist, 1.0);

            const data = buffer.dataBuffer;
            const stride = buffer.strideFloats;

            for (let i = 0; i < activeCount; i++) {
                const offset = i * stride;
                const dx = data[offset] - x;
                const dy = data[offset + 1] - y;
                const dz = data[offset + 2] - z;
                const distSq = dx * dx + dy * dy + dz * dz;

                let fade = 1.0;
                if (distSq >= cullingDistSq) {
                    fade = 0.0;
                } else if (distSq > fadeStartDistSq) {
                    const dist = Math.sqrt(distSq);
                    fade = 1.0 - (dist - fadeStartDist) * invFadeRange;
                    if (fade < 0.0) fade = 0.0;
                    else if (fade > 1.0) fade = 1.0;
                }

                data[offset + 10] = fade;
            }

            buffer.uploadToGPU(activeCount);
        }
    }

    addFoliageType(options: FoliageTypeOptions): FoliageType {
        if (this.#foliageTypes.has(options.name)) {
            console.warn(`[LandscapeFoliageManager] FoliageType with name '${options.name}' already exists.`);
            return this.#foliageTypes.get(options.name)!;
        }

        const foliageType = new FoliageType(this.redGPUContext, options);
        foliageType.foliageManager = this;
        this.#foliageTypes.set(options.name, foliageType);
        this.#typeList.push(foliageType);
        return foliageType;
    }

    removeFoliageType(name: string): boolean {
        const foliageType = this.#foliageTypes.get(name);
        if (foliageType) {
            foliageType.destroy();
            const idx = this.#typeList.indexOf(foliageType);
            if (idx !== -1) {
                this.#typeList.splice(idx, 1);
            }
            return this.#foliageTypes.delete(name);
        }
        return false;
    }

    getFoliageType(name: string): FoliageType | undefined {
        return this.#foliageTypes.get(name);
    }

    getAllFoliageTypes(): FoliageType[] {
        return Array.from(this.#typeList);
    }

    populateAllFoliageTypes(
        countPerType: number,
        bounds?: { minX: number; minZ: number; maxX: number; maxZ: number },
        getHeightAt?: (x: number, z: number) => number
    ): void {
        let targetBounds = bounds;
        if (!targetBounds && this.landscape) {
            const worldSize = this.landscape.worldSize;
            const halfX = (worldSize?.[0] || 2000) * 0.5;
            const halfZ = (worldSize?.[1] || 2000) * 0.5;
            targetBounds = {minX: -halfX, minZ: -halfZ, maxX: halfX, maxZ: halfZ};
        }
        if (!targetBounds) {
            targetBounds = {minX: -1000, minZ: -1000, maxX: 1000, maxZ: 1000};
        }
        const heightFn = getHeightAt || this.#defaultGetHeightAt;
        const typeList = this.#typeList;
        const count = typeList.length;
        for (let i = 0; i < count; i++) {
            typeList[i].populateRandomInstances(countPerType, targetBounds, heightFn);
        }
    }

    /**
     * 타일 텍스처 로딩 완료 시 전체 식생 인스턴스들의 Y 고도를 지형 표면에 정밀 재동기화합니다.
     */
    realignAllHeights(getHeightAt?: (x: number, z: number) => number): void {
        const heightFn = getHeightAt || this.#defaultGetHeightAt;
        const typeList = this.#typeList;
        const count = typeList.length;
        for (let i = 0; i < count; i++) {
            typeList[i].realignHeights(heightFn);
        }
    }

    #defaultGetHeightAt = (x: number, z: number): number => this.landscape.getHeightAt(x, z);

    destroy(): void {
        this.#foliageTypes.forEach((type) => type.destroy());
        this.#foliageTypes.clear();
        this.#pipelineCache.clear();
    }

    /**
     * 식생 버텍스 인스턴싱 전용 WGSL 버텍스 셰이더 모듈 초기화
     */
    #initVertexShader(): void {
        const resourceManager = this.redGPUContext.resourceManager;
        let module = resourceManager.getGPUShaderModule('FoliageInstancedVertexShader_Module');
        if (!module) {
            module = resourceManager.createGPUShaderModule('FoliageInstancedVertexShader_Module', {
                code: foliageInstancedWGSL,
            });
        }
        this.#vertexShaderModule = module;
    }

    /**
     * RedGPU 정석 AntialiasingManager.msaaID 및 Material(PBRMaterial 등) 호환 GPURenderPipeline 반환/생성
     */
    #getOrCreatePipeline(material: any, sampleCount: number, msaaID: string, strideBytes: number = 48): GPURenderPipeline | null {
        if (!material) return null;

        const baseKey = material.uuid || material.name || material.constructor.name;
        const pipelineKey = `${baseKey}_${msaaID}_stride${strideBytes}`;

        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        const resourceManager = this.redGPUContext.resourceManager;
        const gpuDevice: GPUDevice = this.redGPUContext.gpuDevice;
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();

        // 1. 머티리얼 셰이더 상태 갱신
        if (material.dirtyPipeline || !material.fragmentShaderModule) {
            material._updateFragmentState();
        }

        const fragmentModule = material.fragmentShaderModule || material.gpuRenderInfo?.fragmentShaderModule;
        if (!fragmentModule || !this.#vertexShaderModule) return null;

        // 2. RedGPU Primitive Geometry Stride (12 floats * 4 bytes = 48 bytes: Pos3, Normal3, UV2, Tangent4)
        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: strideBytes,
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x3' },  // position
                { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
                { shaderLocation: 2, offset: 24, format: 'float32x2' }, // uv
            ],
        };

        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 12 * 4,
            stepMode: 'instance',
            attributes: [
                { shaderLocation: 3, offset: 0, format: 'float32x3' },  // instancePos
                { shaderLocation: 4, offset: 12, format: 'float32x4' }, // instanceRotQuat
                { shaderLocation: 5, offset: 28, format: 'float32x3' }, // instanceScale
                { shaderLocation: 6, offset: 40, format: 'float32x2' }, // instanceExtra (fade, subId)
            ],
        };

        // 3. RedGPU 명시적 PipelineLayout 구축 (Group 0: System, Group 2: Material)
        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentUniformBindGroup?.layout
                                     || resourceManager.getGPUBindGroupLayout(material.constructor.name);

        const bindGroupLayouts: GPUBindGroupLayout[] = [systemBindGroupLayout];
        if (materialBindGroupLayout) {
            bindGroupLayouts[2] = materialBindGroupLayout;
        } else {
            const emptyLayout = gpuDevice.createBindGroupLayout({ label: 'EmptyMaterialBindGroupLayout', entries: [] });
            bindGroupLayouts[2] = emptyLayout;
        }

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `FoliagePipelineLayout_${pipelineKey}`,
            bindGroupLayouts: bindGroupLayouts,
        });

        // 4. RedGPU G-Buffer 3개 타겟 및 RedGPU 정석 MSAA sampleCount 호환 파이프라인 구축
        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `FoliageRenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule,
                entryPoint: 'mainInput',
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: {
                module: fragmentModule,
                entryPoint: 'main',
                targets: [
                    { format: 'rgba16float' },   // Target 0: GBuffer COLOR
                    { format: preferredFormat }, // Target 1: GBuffer NORMAL
                    { format: 'rgba16float' }    // Target 2: GBuffer MOTION_VECTOR
                ],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {
                count: sampleCount,
            },
        };

        try {
            const pipeline = gpuDevice.createRenderPipeline(pipelineDescriptor);
            this.#pipelineCache.set(pipelineKey, pipeline);
            return pipeline;
        } catch (e) {
            console.warn('[LandscapeFoliageManager] Pipeline creation fallback:', e);
            return null;
        }
    }
}

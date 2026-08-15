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

    private vertexShaderModule: GPUShaderModule | null = null;
    private foliageTypes: Map<string, FoliageType> = new Map();
    private pipelineCache: Map<string, GPURenderPipeline> = new Map();

    constructor(landscape: Landscape) {
        this.landscape = landscape;
        this.redGPUContext = landscape.redGPUContext;
        this.initVertexShader();
    }

    /**
     * 식생 버텍스 인스턴싱 전용 WGSL 버텍스 셰이더 모듈 초기화
     */
    private initVertexShader(): void {
        const resourceManager = this.redGPUContext.resourceManager;
        let module = resourceManager.getGPUShaderModule('FoliageInstancedVertexShader_Module');
        if (!module) {
            module = resourceManager.createGPUShaderModule('FoliageInstancedVertexShader_Module', {
                code: foliageInstancedWGSL,
            });
        }
        this.vertexShaderModule = module;
    }

    /**
     * 렌더 패스 엔코더에 인스턴스드 드로우콜 바인딩 및 디스패치 (RedGPU 정석 msaaID & View3D 매칭)
     */
    render(view: any, passEncoder: GPURenderPassEncoder): void {
        if (!passEncoder || this.foliageTypes.size === 0) return;

        // Group 0: Camera System Uniform BindGroup
        const systemBG = view?.systemUniform_Vertex_UniformBindGroup
                      || view?.rawView?.systemUniform_Vertex_UniformBindGroup
                      || (this.redGPUContext as any)?.systemUniform_Vertex_UniformBindGroup;

        // RedGPU 정석 AntialiasingManager.msaaID 및 sampleCount 추출
        const view3D = view?.view || view;
        const antialiasingManager = view3D?.antialiasingManager || (this.redGPUContext as any)?.antialiasingManager;
        const useMSAA = antialiasingManager?.useMSAA ?? true;
        const msaaID = antialiasingManager?.msaaID ?? 'default_msaa_id';
        const sampleCount = useMSAA ? 4 : 1;

        this.foliageTypes.forEach((foliageType) => {
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) return;

            const instanceGPUBuffer = foliageType.instanceBuffer.getGPUBuffer();
            if (!instanceGPUBuffer) return;

            const mesh = foliageType.mesh;
            const geometry = mesh?.geometry;
            const material = mesh?.material;
            if (!geometry || !material) return;

            const vertexBufferObj = geometry.vertexBuffer;
            const indexBufferObj = geometry.indexBuffer;
            const vertexGPUBuffer = vertexBufferObj?.gpuBuffer;
            const indexGPUBuffer = indexBufferObj?.gpuBuffer;

            if (!vertexGPUBuffer) return;

            // Geometry Stride (Float 개수인 경우 4를 곱해 Byte 크기로 정밀 변환, 기본 48바이트)
            const rawStride = (vertexBufferObj as any)?.stride || 12;
            const strideBytes = rawStride > 16 ? rawStride : rawStride * 4;

            // RedGPU 정석 msaaID & StrideBytes 호환 파이프라인 생성/가져오기
            const pipeline = this.getOrCreatePipeline(material, sampleCount, msaaID, strideBytes);
            if (!pipeline) return;

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

            // Index 렌더링 vs Non-Index 렌더링
            if (indexGPUBuffer) {
                const format = (indexBufferObj as any)?.indexFormat || 'uint32';
                passEncoder.setIndexBuffer(indexGPUBuffer, format);
                passEncoder.drawIndexed(indexBufferObj.indexCount, activeCount, 0, 0, 0);
            } else if (vertexBufferObj) {
                passEncoder.draw(vertexBufferObj.vertexCount, activeCount, 0, 0);
            }
        });
    }

    get hasFoliageTypes(): boolean {
        return this.foliageTypes.size > 0;
    }

    addFoliageType(options: FoliageTypeOptions): FoliageType {
        if (this.foliageTypes.has(options.name)) {
            console.warn(`[LandscapeFoliageManager] FoliageType with name '${options.name}' already exists.`);
            return this.foliageTypes.get(options.name)!;
        }

        const foliageType = new FoliageType(this.redGPUContext, options);
        this.foliageTypes.set(options.name, foliageType);
        return foliageType;
    }

    removeFoliageType(name: string): boolean {
        const foliageType = this.foliageTypes.get(name);
        if (foliageType) {
            foliageType.destroy();
            return this.foliageTypes.delete(name);
        }
        return false;
    }

    getFoliageType(name: string): FoliageType | undefined {
        return this.foliageTypes.get(name);
    }

    getAllFoliageTypes(): FoliageType[] {
        return Array.from(this.foliageTypes.values());
    }

    update(cameraPosition: [number, number, number]): void {
        const camX = cameraPosition[0];
        const camY = cameraPosition[1];
        const camZ = cameraPosition[2];

        this.foliageTypes.forEach((foliageType) => {
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) return;

            const buffer = foliageType.instanceBuffer;
            const cullingDist = foliageType.options.cullingDistance;
            const fadeStartDist = foliageType.options.fadeStartDistance;
            const cullingDistSq = cullingDist * cullingDist;
            const fadeRange = Math.max(cullingDist - fadeStartDist, 1.0);

            const data = buffer.dataBuffer;
            const stride = buffer.strideFloats;

            for (let i = 0; i < activeCount; i++) {
                const offset = i * stride;
                const posX = data[offset];
                const posY = data[offset + 1];
                const posZ = data[offset + 2];

                const dx = posX - camX;
                const dy = posY - camY;
                const dz = posZ - camZ;
                const distSq = dx * dx + dy * dy + dz * dz;

                let fade = 1.0;
                if (distSq >= cullingDistSq) {
                    fade = 0.0;
                } else {
                    const dist = Math.sqrt(distSq);
                    if (dist > fadeStartDist) {
                        fade = 1.0 - (dist - fadeStartDist) / fadeRange;
                    }
                }

                data[offset + 10] = Math.max(0.0, Math.min(1.0, fade));
            }

            buffer.uploadToGPU(activeCount);
        });
    }

    populateAllFoliageTypes(
        countPerType: number,
        bounds: { minX: number; minZ: number; maxX: number; maxZ: number },
        getHeightAt?: (x: number, z: number) => number
    ): void {
        const heightFn = getHeightAt || ((x, z) => this.landscape.getHeightAt(x, z));
        this.foliageTypes.forEach((foliageType) => {
            foliageType.populateRandomInstances(countPerType, bounds, heightFn);
        });
    }

    /**
     * 타일 텍스처 로딩 완료 시 전체 식생 인스턴스들의 Y 고도를 지형 표면에 정밀 재동기화합니다.
     */
    realignAllHeights(getHeightAt?: (x: number, z: number) => number): void {
        const heightFn = getHeightAt || ((x, z) => this.landscape.getHeightAt(x, z));
        this.foliageTypes.forEach((foliageType) => {
            foliageType.realignHeights(heightFn);
        });
    }

    /**
     * RedGPU 정석 AntialiasingManager.msaaID 및 Material(PBRMaterial 등) 호환 GPURenderPipeline 반환/생성
     */
    private getOrCreatePipeline(material: any, sampleCount: number, msaaID: string, strideBytes: number = 48): GPURenderPipeline | null {
        if (!material) return null;

        const baseKey = material.uuid || material.name || material.constructor.name;
        const pipelineKey = `${baseKey}_${msaaID}_stride${strideBytes}`;

        if (this.pipelineCache.has(pipelineKey)) {
            return this.pipelineCache.get(pipelineKey)!;
        }

        const resourceManager = this.redGPUContext.resourceManager;
        const gpuDevice: GPUDevice = this.redGPUContext.gpuDevice;
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();

        // 1. 머티리얼 셰이더 상태 갱신
        if (material.dirtyPipeline || !material.fragmentShaderModule) {
            material._updateFragmentState();
        }

        const fragmentModule = material.fragmentShaderModule || material.gpuRenderInfo?.fragmentShaderModule;
        if (!fragmentModule || !this.vertexShaderModule) return null;

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
                module: this.vertexShaderModule,
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
            this.pipelineCache.set(pipelineKey, pipeline);
            return pipeline;
        } catch (e) {
            console.warn('[LandscapeFoliageManager] Pipeline creation fallback:', e);
            return null;
        }
    }

    destroy(): void {
        this.foliageTypes.forEach((type) => type.destroy());
        this.foliageTypes.clear();
        this.pipelineCache.clear();
    }
}

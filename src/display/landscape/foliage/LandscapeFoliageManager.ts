import RedGPUContext from '../../../context/RedGPUContext';
import ResourceManager from '../../../resources/core/resourceManager/ResourceManager';
import Landscape from '../core/Landscape';
import {FoliageType, FoliageTypeOptions} from './FoliageType';
import foliageCullingComputeWGSL from './shader/foliageCullingCompute.wgsl';
import foliageInstancedWGSL from './shader/foliageInstanced.wgsl';

/**
 * LandscapeFoliageManager
 * Landscape 지형 엔진 연동 및 수십만 개 식생 인스턴스 렌더링 총괄 매니저
 * (WebGPU Compute Shader 기반 GPU Frustum & Distance Culling 및 Indirect Drawing 적용)
 */
export class LandscapeFoliageManager {
    readonly landscape: Landscape;
    readonly redGPUContext: RedGPUContext;

    #vertexShaderModule: GPUShaderModule | null = null;
    #cullingComputePipeline: GPUComputePipeline | null = null;
    #cullingBindGroupLayout: GPUBindGroupLayout | null = null;
    #foliageTypes: Map<string, FoliageType> = new Map();
    #typeList: FoliageType[] = [];
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    get hasFoliageTypes(): boolean {
        return this.#typeList.length > 0;
    }

    constructor(landscape: Landscape) {
        this.landscape = landscape;
        this.redGPUContext = landscape.redGPUContext;
        this.#initVertexShader();
        this.#initCullingComputePipeline();

        if (landscape?.tileStreamer) {
            landscape.tileStreamer.onTileLoaded = (comp: any) => {
                this.onTileLoaded(comp);
            };
        }
    }

    /**
     * [KO] 지형 타일(LandscapeComponent) 로딩 완수 시 해당 타일 영역 식생(0.75MB)만 자동 부분 업로드합니다.
     */
    onTileLoaded(comp: any): void {
        const typeList = this.#typeList;
        const count = typeList.length;
        for (let i = 0; i < count; i++) {
            typeList[i].populateTile(comp);
        }
    }

    /**
     * 렌더 패스 엔코더에 인스턴스드 드로우콜 바인딩 및 디스패치 (Pre-Process 완료된 GPU Culled Buffer 기반 Indirect Draw)
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

            const buffer = foliageType.instanceBuffer;
            const mesh = foliageType.mesh;
            const geometry = mesh?.geometry;
            const material = mesh?.material;
            if (!geometry || !material) continue;

            const vertexBufferObj = geometry.vertexBuffer;
            const indexBufferObj = geometry.indexBuffer;
            const vertexGPUBuffer = vertexBufferObj?.gpuBuffer;
            const indexGPUBuffer = indexBufferObj?.gpuBuffer;
            if (!vertexGPUBuffer) continue;

            const culledInstanceGPUBuffer = buffer.getCulledGPUBuffer();
            const indirectGPUBuffer = buffer.getIndirectGPUBuffer();
            if (!culledInstanceGPUBuffer || !indirectGPUBuffer) continue;

            const rawStride = (vertexBufferObj as any)?.stride || 12;
            const strideBytes = rawStride > 16 ? rawStride : rawStride * 4;

            const pipeline = this.#getOrCreatePipeline(material, sampleCount, msaaID, strideBytes);
            if (!pipeline) continue;

            passEncoder.setPipeline(pipeline);

            if (systemBG) {
                passEncoder.setBindGroup(0, systemBG);
            }

            const matUniformBG = material.gpuRenderInfo?.fragmentUniformBindGroup;
            if (matUniformBG) {
                passEncoder.setBindGroup(2, matUniformBG);
            }

            // Buffer 0: Geometry Vertex Buffer
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            // Buffer 1: Culled Instance Buffer (GPU Compute Pass Output Buffer)
            passEncoder.setVertexBuffer(1, culledInstanceGPUBuffer);

            if (indexGPUBuffer) {
                const format = (indexBufferObj as any)?.indexFormat || 'uint32';
                passEncoder.setIndexBuffer(indexGPUBuffer, format);
                passEncoder.drawIndexedIndirect(indirectGPUBuffer, 0);
            } else if (vertexBufferObj) {
                passEncoder.drawIndirect(indirectGPUBuffer, 0);
            }
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




    #cachedVHTAtlasGPUTexture: GPUTexture | null = null;
    #cachedVHTView: GPUTextureView | null = null;

    update(cameraObj: any, renderViewStateData?: any): void {
        const typeList = this.#typeList;
        const typeCount = typeList.length;
        if (typeCount === 0 || !cameraObj) return;

        const camera = cameraObj;
        const camX = camera.x ?? camera.position?.[0] ?? camera.camera?.x ?? 0;
        const camY = camera.y ?? camera.position?.[1] ?? camera.camera?.y ?? 0;
        const z = camera.z ?? camera.position?.[2] ?? camera.camera?.z ?? 0;

        const frustumPlanes: number[][] | null = renderViewStateData?.frustumPlanes
            ?? renderViewStateData?.view?.frustumPlanes
            ?? camera?.frustumPlanes
            ?? camera?.camera?.frustumPlanes
            ?? null;

        const cullingPipeline = this.#cullingComputePipeline;
        const cullingBindGroupLayout = this.#cullingBindGroupLayout;

        // VHT TextureView 1회 캐싱 (Zero-GC: 매 프레임 createView 스팸 방지)
        const vhtAtlasTexture = this.landscape.vhtAtlasTexture;
        const rawGPUTexture = vhtAtlasTexture?.gpuTexture || null;
        if (rawGPUTexture && this.#cachedVHTAtlasGPUTexture !== rawGPUTexture) {
            this.#cachedVHTAtlasGPUTexture = rawGPUTexture;
            this.#cachedVHTView = rawGPUTexture.createView();
        }
        const vhtView = this.#cachedVHTView || undefined;
        const vhtSampler = this.redGPUContext.resourceManager.basicSampler.gpuSampler;

        const worldSizeX = this.landscape.worldSize?.[0] ?? 0;
        const heightScale = this.landscape.heightScale ?? 500;
        const hasVHT = !!rawGPUTexture;

        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];


            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) continue;

            const buffer = foliageType.instanceBuffer;
            const mesh = foliageType.mesh;
            const geometry = mesh?.geometry;
            if (!geometry) continue;

            const cullingDist = foliageType.options.cullingDistance;
            const fadeStartDist = foliageType.options.fadeStartDistance;
            const boundingRadius = (mesh as any)?.boundingAABB?.volume ?? 2.0;
            const bottomOffset = foliageType.getGeometryBottomOffset();

            // 3. Indirect Draw Command Buffer 원자적 instanceCount 카운터를 매 프레임 0으로 깨끗이 초기화 (20 bytes)
            const indexOrVertexCount = geometry.indexBuffer ? geometry.indexBuffer.indexCount : (geometry.vertexBuffer ? geometry.vertexBuffer.vertexCount : 0);
            buffer.resetIndirectCount(indexOrVertexCount);

            // 4. Culling Uniform 갱신 (GPU VHT 고도 정보 및 카메라/절두체 전달)
            buffer.updateCullingUniforms(
                camX, camY, z,
                cullingDist, fadeStartDist, activeCount, boundingRadius,
                worldSizeX, heightScale, bottomOffset, hasVHT,
                frustumPlanes
            );

            // 4. Render Pass 생성 직전 Pre-Process Compute Pass 전처리 등록 (Zero-GC 바인딩)
            if (cullingPipeline && cullingBindGroupLayout) {
                const cullingBindGroup = buffer.getOrCreateCullingBindGroup(cullingBindGroupLayout, vhtView, vhtSampler);
                if (cullingBindGroup) {
                    const workgroupSize = 64;
                    const workgroupCount = Math.ceil(activeCount / workgroupSize);

                    this.redGPUContext.commandEncoderManager.addPreProcessComputePass('Foliage_GPUCulling_ComputePass', (computePass) => {
                        computePass.setPipeline(cullingPipeline);
                        computePass.setBindGroup(0, cullingBindGroup);
                        computePass.dispatchWorkgroups(workgroupCount);
                    });
                }
            }
        }
    }


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
     * 식생 GPU Compute Shader Culling 전용 파이프라인 및 바인드 그룹 레이아웃 초기화
     */
    #initCullingComputePipeline(): void {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        let module = resourceManager.getGPUShaderModule('FoliageCullingComputeShader_Module');
        if (!module) {
            module = resourceManager.createGPUShaderModule('FoliageCullingComputeShader_Module', {
                code: foliageCullingComputeWGSL,
            });
        }

        const layout = gpuDevice.createBindGroupLayout({
            label: 'FoliageCullingBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
            ],
        });
        this.#cullingBindGroupLayout = layout;

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'FoliageCullingPipelineLayout',
            bindGroupLayouts: [layout],
        });

        this.#cullingComputePipeline = gpuDevice.createComputePipeline({
            label: 'FoliageCullingComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: module,
                entryPoint: 'main',
            },
        });
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

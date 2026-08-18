import RedGPUContext from "../../../../context/RedGPUContext";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import foliageInstancedWGSL from "../shader/foliageInstanced.wgsl";
import foliageDepthInstancedWGSL from "../shader/foliageDepthInstanced.wgsl";
import foliageDepthOnlyWGSL from "../shader/foliageDepthOnly.wgsl";

export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';

/**
 * [KO] 식생 셰이더 모듈 및 머티리얼별 RenderPipeline 캐시 관리자 (단일 책임: 파이프라인 수명주기 & 캐싱)
 * [EN] Foliage Shader Modules & RenderPipeline Cache Manager (Single Responsibility: Pipeline Lifecycle & Caching)
 */
class FoliagePipelineRegistry {
    #redGPUContext: RedGPUContext;
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    #vertexShaderModule: GPUShaderModule | null = null;
    #depthVertexShaderModule: GPUShaderModule | null = null;
    #depthOnlyFragmentShaderModule: GPUShaderModule | null = null;
    #emptyBindGroupLayout: GPUBindGroupLayout | null = null;

    constructor(redGPUContext: RedGPUContext, emptyBindGroupLayout?: GPUBindGroupLayout | null) {
        this.#redGPUContext = redGPUContext;
        this.#emptyBindGroupLayout = emptyBindGroupLayout || null;
        this.#initShaderModules();
    }

    /**
     * RedGPU 표준 AntialiasingManager.msaaID 및 Material 호환 GPURenderPipeline 캐시 반환/생성
     */
    getOrCreatePipeline(
        material: any,
        sampleCount: number,
        msaaID: string,
        strideBytes: number = 48,
        cullMode: GPUCullMode = 'none',
        depthPassMode: FoliageDepthPassMode = 'normal',
        subMeshBindGroupLayout?: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        if (!material) return null;

        const resourceManager = this.#redGPUContext.resourceManager;
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();

        // 1. 머티리얼 셰이더 상태 갱신
        if (material.dirtyPipeline || !material.fragmentShaderModule) {
            material._updateFragmentState();
        }

        const isDepthPrepass = depthPassMode === 'depthPrepass';
        const fragmentModule = isDepthPrepass
            ? this.#depthOnlyFragmentShaderModule
            : (material.fragmentShaderModule || material.gpuRenderInfo?.fragmentShaderModule);

        const isWireframe = !!material.wireframe;
        const topology: GPUPrimitiveTopology = isWireframe ? 'line-list' : 'triangle-list';
        const baseKey = material.uuid || material.name || material.constructor.name;
        const shaderLabel = fragmentModule?.label || 'default';
        const pipelineKey = `${baseKey}_${shaderLabel}_${msaaID}_stride${strideBytes}_cull${cullMode}_topo${topology}_depthMode_${depthPassMode}`;

        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        // 2. RedGPU Primitive Geometry Stride (strideBytes = floatCount * 4 bytes)
        const validStrideBytes = Math.max(strideBytes, 48);
        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: validStrideBytes,
            attributes: [
                {shaderLocation: 0, offset: 0, format: 'float32x3'},  // position
                {shaderLocation: 1, offset: 12, format: 'float32x3'}, // normal
                {shaderLocation: 2, offset: 24, format: 'float32x2'}, // uv
            ],
        };

        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 12 * 4,
            stepMode: 'instance',
            attributes: [
                {shaderLocation: 3, offset: 0, format: 'float32x3'},  // instancePos
                {shaderLocation: 4, offset: 12, format: 'float32x4'}, // instanceRotQuat
                {shaderLocation: 5, offset: 28, format: 'float32x3'}, // instanceScale
                {shaderLocation: 6, offset: 40, format: 'float32x2'}, // instanceExtra (fade, subId)
            ],
        };

        // 3. RedGPU 명시적 PipelineLayout 구축 (Group 0: System, Group 1: SubMesh Transform, Group 2: Material)
        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const effectiveSubMeshBGL = subMeshBindGroupLayout || this.#emptyBindGroupLayout || gpuDevice.createBindGroupLayout({
            label: 'EmptyFoliageBindGroupLayout',
            entries: []
        });
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentBindGroupLayout
            || material.gpuRenderInfo?.fragmentUniformBindGroup?.layout
            || this.#emptyBindGroupLayout;

        const bindGroupLayouts: GPUBindGroupLayout[] = [
            systemBindGroupLayout,
            effectiveSubMeshBGL,
            materialBindGroupLayout
        ];

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `FoliagePipelineLayout_${pipelineKey}`,
            bindGroupLayouts: bindGroupLayouts,
        });

        // 4. Color Targets & DepthStencil 분기
        let targets: (GPUColorTargetState | null)[] = [];
        let depthStencil: GPUDepthStencilState;

        if (isDepthPrepass) {
            // 🌿 Step 0: Depth Pre-pass (G-Buffer 3개 포맷 일치 + writeMask: 0으로 색상 쓰기 완전 차단, 깊이만 고속 기록)
            targets = [
                {
                    format: 'rgba16float',
                    blend: undefined,
                    writeMask: 0,
                },
                {
                    format: preferredFormat,
                    blend: undefined,
                    writeMask: 0,
                },
                {
                    format: 'rgba16float',
                    blend: undefined,
                    writeMask: 0,
                }
            ];
            depthStencil = {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less',
            };
        } else {
            // 본 렌더링 (Main Shading) 타겟 구성
            targets = material.getFragmentRenderState
                ? material.getFragmentRenderState().targets
                : [
                    {
                        format: 'rgba16float',
                        blend: material.blendColorState ? {
                            color: material.blendColorState.state,
                            alpha: material.blendAlphaState.state
                        } : undefined,
                        writeMask: material.writeMaskState,
                    },
                    {
                        format: preferredFormat,
                        blend: undefined,
                        writeMask: material.writeMaskState,
                    },
                    {
                        format: 'rgba16float',
                        blend: undefined,
                        writeMask: material.writeMaskState,
                    }
                ];

            if (depthPassMode === 'mainShadingAfterDepth') {
                // 🌟 Step 1 (Masked 잎사귀): Depth Pre-pass에서 깊이가 이미 선점되었으므로 depthCompare 'equal' & depthWrite false
                depthStencil = {
                    format: 'depth32float',
                    depthWriteEnabled: false,
                    depthCompare: 'equal',
                };
            } else {
                // 🌲 Step 1 (Opaque 줄기 & 원거리 빌보드): 1-Pass 고속 렌더링
                depthStencil = {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less',
                };
            }
        }

        const vertexModule = isDepthPrepass ? this.#depthVertexShaderModule! : this.#vertexShaderModule!;

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `FoliageRenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: vertexModule,
                entryPoint: 'mainInput',
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: {
                module: fragmentModule,
                entryPoint: 'main',
                targets: targets,
            },
            primitive: {
                topology: topology,
                cullMode: cullMode,
            },
            depthStencil: depthStencil,
            multisample: {
                count: sampleCount,
            },
        };

        const newPipeline = gpuDevice.createRenderPipeline(pipelineDescriptor);
        this.#pipelineCache.set(pipelineKey, newPipeline);
        return newPipeline;
    }

    clearCache(): void {
        this.#pipelineCache.clear();
    }

    #initShaderModules(): void {
        const resourceManager = this.#redGPUContext.resourceManager;

        // 1. 본 버텍스 셰이더 모듈
        let vModule = resourceManager.getGPUShaderModule('FoliageInstancedVertexShader_Module');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('FoliageInstancedVertexShader_Module', {
                code: foliageInstancedWGSL,
            });
        }
        this.#vertexShaderModule = vModule;

        // 2. Depth Prepass 전용 경량 버텍스 셰이더 모듈
        let depthVModule = resourceManager.getGPUShaderModule('FoliageDepthInstancedVertexShader_Module');
        if (!depthVModule) {
            depthVModule = resourceManager.createGPUShaderModule('FoliageDepthInstancedVertexShader_Module', {
                code: foliageDepthInstancedWGSL,
            });
        }
        this.#depthVertexShaderModule = depthVModule;

        // 3. Depth Prepass 전용 프래그먼트 셰이더 모듈
        let depthFModule = resourceManager.getGPUShaderModule('FoliageDepthOnlyFragmentShader_Module');
        if (!depthFModule) {
            depthFModule = resourceManager.createGPUShaderModule('FoliageDepthOnlyFragmentShader_Module', {
                code: foliageDepthOnlyWGSL,
            });
        }
        this.#depthOnlyFragmentShaderModule = depthFModule;
    }
}

Object.freeze(FoliagePipelineRegistry);
export default FoliagePipelineRegistry;

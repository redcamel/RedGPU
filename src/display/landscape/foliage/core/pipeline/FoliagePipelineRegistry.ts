import RedGPUContext from "../../../../../context/RedGPUContext";
import ResourceManager from "../../../../../resources/core/resourceManager/ResourceManager";
import foliageInstancedWGSL from "./foliageInstanced.wgsl";
import foliageDepthPrepassWGSL from "./foliageDepthPrepass.wgsl";
import foliageShadowDepthWGSL from "./foliageShadowDepth.wgsl";
import OctahedralImpostorMaterial from "../impostor/octahedral/OctahedralImpostorMaterial";

export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth' | 'shadow' | 'shadowOpaque';

class FoliagePipelineRegistry {
    #redGPUContext: RedGPUContext;
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    #vertexShaderModule: GPUShaderModule | null = null;
    #depthPrepassFragmentShaderModule: GPUShaderModule | null = null;
    #shadowDepthFragmentShaderModule: GPUShaderModule | null = null;
    #emptyBindGroupLayout: GPUBindGroupLayout | null = null;

    constructor(redGPUContext: RedGPUContext, emptyBindGroupLayout?: GPUBindGroupLayout | null) {
        this.#redGPUContext = redGPUContext;
        this.#emptyBindGroupLayout = emptyBindGroupLayout || redGPUContext.gpuDevice?.createBindGroupLayout({
            label: 'EmptyFoliageBindGroupLayout',
            entries: []
        }) || null;
        this.#initShaderModules();
    }

    // 🚀 [Zero-GC & 버텍스 대역폭 최적화] 패스별 버텍스 속성 정적 배열 분리
    static readonly #GEO_ATTRIBUTES_ALL: readonly GPUVertexAttribute[] = [
        {shaderLocation: 0, offset: 0, format: 'float32x3'},
        {shaderLocation: 1, offset: 12, format: 'float32x3'},
        {shaderLocation: 2, offset: 24, format: 'float32x2'},
        {shaderLocation: 3, offset: 32, format: 'float32x2'},
        {shaderLocation: 4, offset: 40, format: 'float32x4'},
        {shaderLocation: 5, offset: 56, format: 'float32x4'},
    ];

    static readonly #GEO_ATTRIBUTES_SHADOW_MASKED: readonly GPUVertexAttribute[] = [
        {shaderLocation: 0, offset: 0, format: 'float32x3'},
        {shaderLocation: 2, offset: 24, format: 'float32x2'},
        {shaderLocation: 5, offset: 56, format: 'float32x4'},
    ];

    static readonly #GEO_ATTRIBUTES_SHADOW_OPAQUE: readonly GPUVertexAttribute[] = [
        {shaderLocation: 0, offset: 0, format: 'float32x3'},
    ];

    static readonly #INSTANCE_ATTRIBUTES_ALL: readonly GPUVertexAttribute[] = [
        {shaderLocation: 6, offset: 0, format: 'float32x4'},
        {shaderLocation: 7, offset: 16, format: 'snorm16x4'},
        {shaderLocation: 8, offset: 24, format: 'float16x2'},
        {shaderLocation: 9, offset: 28, format: 'float32'},
    ];

    static readonly #INSTANCE_ATTRIBUTES_SHADOW_OPAQUE: readonly GPUVertexAttribute[] = [
        {shaderLocation: 6, offset: 0, format: 'float32x4'},
        {shaderLocation: 7, offset: 16, format: 'snorm16x4'},
        {shaderLocation: 8, offset: 24, format: 'float16x2'},
    ];

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

        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentShaderModule) {
            material._updateFragmentState?.();
        }

        const isShadow = depthPassMode === 'shadow' || depthPassMode === 'shadowOpaque';
        const isShadowOpaque = depthPassMode === 'shadowOpaque';
        const isDepthPrepass = depthPassMode === 'depthPrepass';
        const isOctahedral = material instanceof OctahedralImpostorMaterial || material?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof material?.name === 'string' && material.name.includes('Octahedral'));
        const hasBaseColorTexture = !!(material.baseColorTexture?.gpuTexture || material.baseColorTexture?.src || material.baseColorTexture?.url || (material.diffuseTexture && (material.diffuseTexture.gpuTexture || material.diffuseTexture.src || material.diffuseTexture.url)));

        // 🚀 임포스터는 뎁스 프리패스 및 섀도우 패스를 타지 않고 메인 패스에서만 렌더링되므로 Prepass/Shadow 파이프라인 생성 차단
        if (isOctahedral && (isDepthPrepass || isShadow)) {
            return null;
        }
        if (isDepthPrepass && !hasBaseColorTexture) {
            return null;
        }

        let fragmentModule: GPUShaderModule | null = null;
        if (isShadow) {
            fragmentModule = this.#shadowDepthFragmentShaderModule;
        } else if (isDepthPrepass) {
            fragmentModule = this.#depthPrepassFragmentShaderModule;
        } else {
            fragmentModule = material.gpuRenderInfo?.fragmentShaderModule || material.fragmentShaderModule;
        }

        const isMaskedOrTransparent = !!material.useCutOff || material.alphaBlend === 1 || material.alphaBlend === 2 || !!material.transparent || isOctahedral;
        const needsShadowFragment = isShadow && !isShadowOpaque && isMaskedOrTransparent && hasBaseColorTexture;

        const isWireframe = !!material.wireframe;
        const topology: GPUPrimitiveTopology = isWireframe ? 'line-list' : 'triangle-list';
        const baseKey = material.uuid || material.name || material.constructor.name;
        const shaderLabel = fragmentModule?.label || 'default';
        const pipelineKey = `${baseKey}_${shaderLabel}_${msaaID}_stride${strideBytes}_cull${cullMode}_topo${topology}_depthMode_${depthPassMode}`;

        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        const validStrideBytes = Math.max(strideBytes, 72);

        // 🚀 [최적화 P0] shadowOpaque는 오직 position(12B)만 페치하여 버텍스 대역폭 낭비 100% 차단
        const effectiveGeoAttributes = isShadowOpaque
            ? FoliagePipelineRegistry.#GEO_ATTRIBUTES_SHADOW_OPAQUE
            : (isShadow ? FoliagePipelineRegistry.#GEO_ATTRIBUTES_SHADOW_MASKED : FoliagePipelineRegistry.#GEO_ATTRIBUTES_ALL);

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: validStrideBytes,
            attributes: effectiveGeoAttributes as GPUVertexAttribute[],
        };

        const effectiveInstanceAttributes = isShadowOpaque
            ? FoliagePipelineRegistry.#INSTANCE_ATTRIBUTES_SHADOW_OPAQUE
            : FoliagePipelineRegistry.#INSTANCE_ATTRIBUTES_ALL;

        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8 * 4, 
            stepMode: 'instance',
            attributes: effectiveInstanceAttributes as GPUVertexAttribute[],
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const effectiveSubMeshBGL = subMeshBindGroupLayout || this.#emptyBindGroupLayout!;
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentBindGroupLayout
            || material.gpuRenderInfo?.fragmentUniformBindGroup?.layout
            || this.#emptyBindGroupLayout;

        const bindGroupLayouts: GPUBindGroupLayout[] = (isShadow && !needsShadowFragment)
            ? [systemBindGroupLayout, effectiveSubMeshBGL]
            : [systemBindGroupLayout, effectiveSubMeshBGL, materialBindGroupLayout];

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `FoliagePipelineLayout_${pipelineKey}`,
            bindGroupLayouts: bindGroupLayouts,
        });

        let targets: (GPUColorTargetState | null)[] = [];
        let depthStencil: GPUDepthStencilState;

        if (isShadow) {
            targets = [];
            depthStencil = {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            };
        } else if (isDepthPrepass) {
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
                depthCompare: 'less-equal',
            };
        } else {
            const isMainShadingAfterDepth = depthPassMode === 'mainShadingAfterDepth';

            targets = [
                {
                    format: 'rgba16float',
                    blend: undefined,
                    writeMask: material.writeMaskState ?? GPUColorWrite.ALL,
                },
                {
                    format: preferredFormat,
                    blend: undefined,
                    writeMask: material.writeMaskState ?? GPUColorWrite.ALL,
                },
                {
                    format: 'rgba16float',
                    blend: undefined,
                    writeMask: material.writeMaskState ?? GPUColorWrite.ALL,
                }
            ];

            if (isMainShadingAfterDepth) {
                depthStencil = {
                    format: 'depth32float',
                    depthWriteEnabled: false,
                    depthCompare: 'less-equal',
                };
            } else {
                depthStencil = {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less-equal',
                };
            }
        }

        // 🚀 [최적화 P0] shadowOpaque 전용 초경량 버텍스 엔트리포인트 바인딩
        const vertexEntryPoint = isShadowOpaque
            ? 'entryPointShadowOpaqueVertex'
            : (isShadow ? 'entryPointShadowVertex' : 'mainInput');
        const fragmentEntryPoint = isShadow ? 'shadowMain' : 'main';

        const fragmentState = (isShadow && !needsShadowFragment) ? undefined : {
            module: fragmentModule!,
            entryPoint: fragmentEntryPoint,
            targets: targets,
        };

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `FoliageRenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule!,
                entryPoint: vertexEntryPoint,
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: fragmentState,
            primitive: {
                topology: topology,
                cullMode: cullMode,
            },
            depthStencil: depthStencil,
            multisample: {
                count: isShadow ? 1 : sampleCount,
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

        let vModule = resourceManager.getGPUShaderModule('FoliageInstancedVertexShader_Module');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('FoliageInstancedVertexShader_Module', {
                code: foliageInstancedWGSL,
            });
        }
        this.#vertexShaderModule = vModule;

        let depthPrepassFModule = resourceManager.getGPUShaderModule('FoliageDepthPrepassFragmentShader_Module');
        if (!depthPrepassFModule) {
            depthPrepassFModule = resourceManager.createGPUShaderModule('FoliageDepthPrepassFragmentShader_Module', {
                code: foliageDepthPrepassWGSL,
            });
        }
        this.#depthPrepassFragmentShaderModule = depthPrepassFModule;

        let shadowDepthFModule = resourceManager.getGPUShaderModule('FoliageShadowDepthFragmentShader_Module');
        if (!shadowDepthFModule) {
            shadowDepthFModule = resourceManager.createGPUShaderModule('FoliageShadowDepthFragmentShader_Module', {
                code: foliageShadowDepthWGSL,
            });
        }
        this.#shadowDepthFragmentShaderModule = shadowDepthFModule;
    }
}

Object.freeze(FoliagePipelineRegistry);
export default FoliagePipelineRegistry;

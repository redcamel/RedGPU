import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import foliageInstancedWGSL from "./foliageInstanced.wgsl";
import foliageDepthPrepassMaskedFragmentWGSL from "./foliageDepthPrepassMaskedFragment.wgsl";
import foliageDepthPrepassOpaqueFragmentWGSL from "./foliageDepthPrepassOpaqueFragment.wgsl";
import OctahedralImpostorMaterial from "../baking/impostor/octahedral/OctahedralImpostorMaterial";

/**
 * [KO] 식생 렌더 파이프라인의 깊이 테스트 및 컬러 쓰기 동작 모드입니다.
 * [EN] Depth test and color write operation mode for foliage render pipelines.
 * @category Landscape
 */
export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';

const INSTANCE_ATTRIBUTES_ALL: GPUVertexAttribute[] = [
    {shaderLocation: 6, offset: 0, format: 'float32x4'},
    {shaderLocation: 7, offset: 16, format: 'snorm16x4'},
    {shaderLocation: 8, offset: 24, format: 'float16x2'},
    {shaderLocation: 9, offset: 28, format: 'unorm8x4'},
];

/**
 * [KO] 식생(Foliage)의 메인 패스, 깊이 프리패스, 그림자 패스용 인스턴싱 `GPURenderPipeline`을 생성하고 캐싱하는 레지스트리 클래스입니다.
 * [EN] Registry class that creates and caches instanced `GPURenderPipeline` objects for foliage main, depth prepass, and shadow passes.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class FoliagePipelineRegistry extends RedGPUObject {
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    #vertexShaderModule: GPUShaderModule;
    #depthPrepassMaskedFragmentShaderModule: GPUShaderModule;
    #depthPrepassOpaqueFragmentShaderModule: GPUShaderModule;

    /**
     * [KO] `FoliagePipelineRegistry` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliagePipelineRegistry` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {
            vertexShaderModule,
            depthPrepassMaskedFragmentShaderModule,
            depthPrepassOpaqueFragmentShaderModule
        } = this.#initShaderModules();
        this.#vertexShaderModule = vertexShaderModule;
        this.#depthPrepassMaskedFragmentShaderModule = depthPrepassMaskedFragmentShaderModule;
        this.#depthPrepassOpaqueFragmentShaderModule = depthPrepassOpaqueFragmentShaderModule;
    }

    #geoAttributesAll: GPUVertexAttribute[] = [
        {shaderLocation: 0, offset: 0, format: 'float32x3'},
        {shaderLocation: 1, offset: 12, format: 'float32x3'},
        {shaderLocation: 2, offset: 24, format: 'float32x2'},
        {shaderLocation: 3, offset: 32, format: 'float32x2'},
        {shaderLocation: 4, offset: 40, format: 'float32x4'},
        {shaderLocation: 5, offset: 56, format: 'float32x4'},
    ];

    #geoAttributesShadowOpaque: GPUVertexAttribute[] = [
        {shaderLocation: 0, offset: 0, format: 'float32x3'},
    ];

    #instanceBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8 * 4,
        stepMode: 'instance',
        attributes: INSTANCE_ATTRIBUTES_ALL,
    };

    /**
     * [KO] 메인 패스 또는 깊이 프리패스용 식생 렌더 파이프라인을 조회하거나 새로 생성하여 반환합니다.
     * [EN] Retrieves or creates a foliage render pipeline for the main pass or depth prepass.
     *
     * @param material -
     * [KO] 대상 머티리얼 인스턴스
     * [EN] Target material instance
     * @param sampleCount -
     * [KO] MSAA 샘플 수
     * [EN] MSAA sample count
     * @param msaaID -
     * [KO] MSAA 식별자 문자열
     * [EN] MSAA identifier string
     * @param strideBytes -
     * [KO] 정점 버퍼 스트라이드 바이트 수 (기본값: `72`)
     * [EN] Vertex buffer stride in bytes (default: `72`)
     * @param cullMode -
     * [KO] 폴리곤 컬링 모드 (기본값: `'none'`)
     * [EN] Polygon cull mode (default: `'none'`)
     * @param depthPassMode -
     * [KO] 깊이 패스 동작 모드 (기본값: `'normal'`)
     * [EN] Depth pass operation mode (default: `'normal'`)
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit dynamic uniform bind group layout (optional)
     * @param isMasked -
     * [KO] 알파 마스크 렌더링 여부 (기본값: `false`)
     * [EN] Whether alpha mask rendering is used (default: `false`)
     * @returns
     * [KO] 생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (유효하지 않은 경우 `null`)
     * [EN] Created or cached `GPURenderPipeline` instance (`null` if invalid)
     */
    getOrCreatePipeline(
        material: any,
        sampleCount: number,
        msaaID: string,
        strideBytes: number = 72,
        cullMode: GPUCullMode = 'none',
        depthPassMode: FoliageDepthPassMode = 'normal',
        renderUnitBindGroupLayout?: GPUBindGroupLayout | null,
        isMasked: boolean = false
    ): GPURenderPipeline | null {
        if (!material) return null;

        const {resourceManager, gpuDevice} = this;
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();

        const {dirtyPipeline, gpuRenderInfo, baseColorTexture, useCutOff, alphaBlend, transparent} = material;
        if (dirtyPipeline || !gpuRenderInfo?.fragmentShaderModule) {
            material._updateFragmentState();
        }

        const isDepthPrepass = depthPassMode === 'depthPrepass';
        const isOctahedral = material instanceof OctahedralImpostorMaterial;
        const hasBaseColorTexture = !!(baseColorTexture?.gpuTexture || baseColorTexture?.src || baseColorTexture?.url);

        const effectiveIsMasked = isMasked || !!useCutOff || alphaBlend === 1 || alphaBlend === 2 || !!transparent;
        if (isDepthPrepass && effectiveIsMasked && !hasBaseColorTexture) {
            return null;
        }

        const isDepthPrepassOpaque = isDepthPrepass && !effectiveIsMasked;
        const fragmentModule: GPUShaderModule | null = isDepthPrepass
            ? (isOctahedral
                ? (material.gpuRenderInfo?.fragmentShaderModule ?? null)
                : (isDepthPrepassOpaque ? this.#depthPrepassOpaqueFragmentShaderModule : this.#depthPrepassMaskedFragmentShaderModule))
            : (material.gpuRenderInfo?.fragmentShaderModule ?? null);

        if (!fragmentModule) {
            return null;
        }

        const isWireframe = !!material.wireframe;
        const topology: GPUPrimitiveTopology = isWireframe ? 'line-list' : 'triangle-list';
        const baseKey = material.uuid;
        const shaderLabel = fragmentModule?.label ?? (isDepthPrepassOpaque ? 'depthPrepass_opaque' : 'default');
        const maskedSuffix = isDepthPrepass ? (isDepthPrepassOpaque ? '_opaque' : '_masked') : '';
        const pipelineKey = `${baseKey}_${shaderLabel}_${msaaID}_stride${strideBytes}_cull${cullMode}_topo${topology}_depthMode_${depthPassMode}${maskedSuffix}`;

        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        const validStrideBytes = Math.max(strideBytes, 72);

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: validStrideBytes,
            attributes: isDepthPrepassOpaque ? this.#geoAttributesShadowOpaque : this.#geoAttributesAll,
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const {emptyBindGroupLayout} = resourceManager;
        const effectiveRenderUnitBGL = renderUnitBindGroupLayout ?? emptyBindGroupLayout;
        const materialBindGroupLayout = isDepthPrepassOpaque
            ? emptyBindGroupLayout
            : (material.gpuRenderInfo?.fragmentBindGroupLayout ?? emptyBindGroupLayout);

        const bindGroupLayouts: GPUBindGroupLayout[] = [systemBindGroupLayout, effectiveRenderUnitBGL, materialBindGroupLayout];

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            `Foliage_Render_PipelineLayout_${pipelineKey}`,
            {
                label: `Foliage_Render_PipelineLayout_${pipelineKey}`,
                bindGroupLayouts: bindGroupLayouts,
            }
        );

        let targets: (GPUColorTargetState | null)[] = [];
        let depthStencil: GPUDepthStencilState;

        if (isDepthPrepass) {
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

            const writeMask = material.writeMaskState ?? GPUColorWrite.ALL;
            targets = [
                {
                    format: 'rgba16float',
                    blend: undefined,
                    writeMask,
                },
                {
                    format: preferredFormat,
                    blend: undefined,
                    writeMask,
                },
                {
                    format: 'rgba16float',
                    blend: undefined,
                    writeMask,
                }
            ];

            if (isMainShadingAfterDepth) {
                depthStencil = {
                    format: 'depth32float',
                    depthWriteEnabled: false,
                    depthCompare: 'equal',
                };
            } else {
                depthStencil = {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less-equal',
                };
            }
        }

        const vertexEntryPoint = isDepthPrepassOpaque
            ? 'entryPointDepthPrepassOpaqueVertex'
            : 'entryPointMainVertex';

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `Foliage_RenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule,
                entryPoint: vertexEntryPoint,
                buffers: [geometryBufferLayout, this.#instanceBufferLayout],
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

    /**
     * [KO] 불투명 병합 지오메트리 전용 그림자 패스 렌더 파이프라인을 조회하거나 새로 생성하여 반환합니다.
     * [EN] Retrieves or creates a shadow pass render pipeline dedicated to opaque merged geometry.
     *
     * @param strideBytes -
     * [KO] 위치 전용 정점 버퍼 스트라이드 바이트 수 (기본값: `12`)
     * [EN] Position-only vertex buffer stride in bytes (default: `12`)
     * @param cullMode -
     * [KO] 폴리곤 컬링 모드 (기본값: `'back'`)
     * [EN] Polygon cull mode (default: `'back'`)
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit dynamic uniform bind group layout (optional)
     * @returns
     * [KO] 생성 또는 캐시된 그림자 렌더 파이프라인(`GPURenderPipeline`)
     * [EN] Created or cached shadow render pipeline (`GPURenderPipeline`)
     */
    getOrCreateShadowMergedPipeline(
        strideBytes: number = 12,
        cullMode: GPUCullMode = 'back',
        renderUnitBindGroupLayout?: GPUBindGroupLayout | null
    ): GPURenderPipeline {
        const pipelineKey = `FoliageShadowMerged_stride${strideBytes}_cull${cullMode}`;
        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        const {resourceManager, gpuDevice} = this;

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: strideBytes,
            attributes: this.#geoAttributesShadowOpaque,
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const {emptyBindGroupLayout} = resourceManager;
        const effectiveRenderUnitBGL = renderUnitBindGroupLayout ?? emptyBindGroupLayout;

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            `Foliage_ShadowMerged_PipelineLayout_${pipelineKey}`,
            {
                label: `Foliage_ShadowMerged_PipelineLayout_${pipelineKey}`,
                bindGroupLayouts: [systemBindGroupLayout, effectiveRenderUnitBGL],
            }
        );

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `Foliage_ShadowMerged_RenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule,
                entryPoint: 'entryPointShadowOpaqueVertex',
                buffers: [geometryBufferLayout, this.#instanceBufferLayout],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: cullMode,
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            },
            multisample: {
                count: 1,
            },
        };

        const newPipeline = gpuDevice.createRenderPipeline(pipelineDescriptor);
        this.#pipelineCache.set(pipelineKey, newPipeline);
        return newPipeline;
    }

    /**
     * [KO] 알파 마스크(컷오프)가 적용된 식생 또는 임포스터용 그림자 패스 렌더 파이프라인을 조회하거나 생성하여 반환합니다.
     * [EN] Retrieves or creates a shadow pass render pipeline for alpha-masked (cutoff) foliage or impostors.
     *
     * @param material -
     * [KO] 대상 머티리얼 인스턴스
     * [EN] Target material instance
     * @param strideBytes -
     * [KO] 정점 버퍼 스트라이드 바이트 수 (기본값: `72`)
     * [EN] Vertex buffer stride in bytes (default: `72`)
     * @param cullMode -
     * [KO] 폴리곤 컬링 모드 (기본값: `'none'`)
     * [EN] Polygon cull mode (default: `'none'`)
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit dynamic uniform bind group layout (optional)
     * @returns
     * [KO] 생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (머티리얼 부재 시 `null`)
     * [EN] Created or cached `GPURenderPipeline` instance (`null` if material is absent)
     */
    getOrCreateShadowMaskedPipeline(
        material: any,
        strideBytes: number = 72,
        cullMode: GPUCullMode = 'none',
        renderUnitBindGroupLayout?: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        if (!material) return null;

        const {dirtyPipeline, gpuRenderInfo, uuid, name} = material;
        if (dirtyPipeline || !gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState();
            material.dirtyPipeline = false;
        }

        const {resourceManager, gpuDevice} = this;

        const materialUUID = uuid ?? name ?? 'mat';
        const pipelineKey = `FoliageShadowMasked_${materialUUID}_stride${strideBytes}_cull${cullMode}`;
        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: strideBytes,
            attributes: this.#geoAttributesAll,
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const {emptyBindGroupLayout} = resourceManager;
        const effectiveRenderUnitBGL = renderUnitBindGroupLayout ?? emptyBindGroupLayout;
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentBindGroupLayout
            ?? emptyBindGroupLayout;

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            `Foliage_ShadowMasked_PipelineLayout_${pipelineKey}`,
            {
                label: `Foliage_ShadowMasked_PipelineLayout_${pipelineKey}`,
                bindGroupLayouts: [systemBindGroupLayout, effectiveRenderUnitBGL, materialBindGroupLayout],
            }
        );

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `Foliage_ShadowMasked_RenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule,
                entryPoint: 'entryPointShadowMaskedVertex',
                buffers: [geometryBufferLayout, this.#instanceBufferLayout],
            },
            fragment: {
                module: this.#vertexShaderModule,
                entryPoint: 'entryPointShadowMaskedFragment',
                targets: [],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: cullMode,
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            },
            multisample: {
                count: 1,
            },
        };

        const newPipeline = gpuDevice.createRenderPipeline(pipelineDescriptor);
        this.#pipelineCache.set(pipelineKey, newPipeline);
        return newPipeline;
    }

    /**
     * [KO] 캐싱된 모든 렌더 파이프라인을 초기화합니다.
     * [EN] Clears all cached render pipelines.
     */
    clearCache(): void {
        this.#pipelineCache.clear();
    }

    #initShaderModules(): {
        vertexShaderModule: GPUShaderModule;
        depthPrepassMaskedFragmentShaderModule: GPUShaderModule;
        depthPrepassOpaqueFragmentShaderModule: GPUShaderModule;
    } {
        const {resourceManager} = this;

        let vertexShaderModule = resourceManager.getGPUShaderModule('Foliage_Instanced_VertexShaderModule');
        if (!vertexShaderModule) {
            vertexShaderModule = resourceManager.createGPUShaderModule('Foliage_Instanced_VertexShaderModule', {
                code: foliageInstancedWGSL,
            });
        }

        let depthPrepassMaskedFragmentShaderModule = resourceManager.getGPUShaderModule('Foliage_DepthPrepass_Masked_FragmentShaderModule');
        if (!depthPrepassMaskedFragmentShaderModule) {
            depthPrepassMaskedFragmentShaderModule = resourceManager.createGPUShaderModule('Foliage_DepthPrepass_Masked_FragmentShaderModule', {
                code: foliageDepthPrepassMaskedFragmentWGSL,
            });
        }

        let depthPrepassOpaqueFragmentShaderModule = resourceManager.getGPUShaderModule('Foliage_DepthPrepass_Opaque_FragmentShaderModule');
        if (!depthPrepassOpaqueFragmentShaderModule) {
            depthPrepassOpaqueFragmentShaderModule = resourceManager.createGPUShaderModule('Foliage_DepthPrepass_Opaque_FragmentShaderModule', {
                code: foliageDepthPrepassOpaqueFragmentWGSL,
            });
        }

        return {vertexShaderModule, depthPrepassMaskedFragmentShaderModule, depthPrepassOpaqueFragmentShaderModule};
    }
}

Object.freeze(FoliagePipelineRegistry);
export default FoliagePipelineRegistry;

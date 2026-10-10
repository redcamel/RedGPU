/**
 * [KO] 식생 WebGPU 렌더 파이프라인 생성 및 캐시 레지스트리 모듈입니다.
 * [EN] Foliage WebGPU render pipeline creation and cache registry module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import foliageInstancedWGSL from "./foliageInstanced.wgsl";
import foliageDepthPrepassMaskedFragmentWGSL from "./foliageDepthPrepassMaskedFragment.wgsl";
import foliageDepthPrepassOpaqueFragmentWGSL from "./foliageDepthPrepassOpaqueFragment.wgsl";
import OctahedralImpostorMaterial from "../baking/impostor/octahedral/OctahedralImpostorMaterial";

/**
 * [KO] 식생 뎁스 패스 동작 모드 ('normal' | 'depthPrepass' | 'mainShadingAfterDepth')
 * [EN] Foliage depth pass operation mode ('normal' | 'depthPrepass' | 'mainShadingAfterDepth')
 */
export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';

/**
 * [KO] 머티리얼, MSAA, 스트라이드, 컬링 모드 및 뎁스 패스 조합에 따라 식생 렌더 파이프라인을 생성 및 캐싱하는 레지스트리 클래스입니다.
 * [EN] Registry class that creates and caches foliage render pipelines according to material, MSAA, stride, cull mode, and depth pass combinations.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
class FoliagePipelineRegistry extends RedGPUObject {
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    #vertexShaderModule: GPUShaderModule;
    #depthPrepassMaskedFragmentShaderModule: GPUShaderModule;
    #depthPrepassOpaqueFragmentShaderModule: GPUShaderModule;

    /**
     * [KO] FoliagePipelineRegistry 인스턴스를 생성하고 공용 셰이더 모듈을 컴파일합니다.
     * [EN] Creates a FoliagePipelineRegistry instance and compiles common shader modules.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {vModule, depthPrepassMaskedFModule, depthPrepassOpaqueFModule} = this.#initShaderModules();
        this.#vertexShaderModule = vModule;
        this.#depthPrepassMaskedFragmentShaderModule = depthPrepassMaskedFModule;
        this.#depthPrepassOpaqueFragmentShaderModule = depthPrepassOpaqueFModule;
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

    #instanceAttributesAll: GPUVertexAttribute[] = [
        {shaderLocation: 6, offset: 0, format: 'float32x4'},
        {shaderLocation: 7, offset: 16, format: 'snorm16x4'},
        {shaderLocation: 8, offset: 24, format: 'float16x2'},
        {shaderLocation: 9, offset: 28, format: 'unorm8x4'},
    ];

    #instanceBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8 * 4,
        stepMode: 'instance',
        attributes: this.#instanceAttributesAll,
    };

    /**
     * [KO] 주어진 머티리얼 및 렌더 파라미터에 대응하는 식생 렌더 파이프라인을 조회하거나 새로 생성합니다.
     * [EN] Retrieves or creates a foliage render pipeline corresponding to the given material and render parameters.
     * @param material -
     * [KO] 적용할 머티리얼 인스턴스
     * [EN] Material instance to apply
     * @param sampleCount -
     * [KO] MSAA 샘플 수
     * [EN] MSAA sample count
     * @param msaaID -
     * [KO] MSAA 식별자 키
     * [EN] MSAA identifier key
     * @param strideBytes -
     * [KO] 정점 스트라이드 바이트 수 (기본값: 72)
     * [EN] Vertex stride in bytes (default: 72)
     * @param cullMode -
     * [KO] 컬링 모드 (기본값: 'none')
     * [EN] Cull mode (default: 'none')
     * @param depthPassMode -
     * [KO] 뎁스 패스 모드 (기본값: 'normal')
     * [EN] Depth pass mode (default: 'normal')
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 바인드 그룹 레이아웃 (선택사항)
     * [EN] Render unit bind group layout (optional)
     * @param isMasked -
     * [KO] 렌더 유닛의 알파 마스킹 여부 (기본값: false)
     * [EN] Whether render unit uses alpha masking (default: false)
     * @returns
     * [KO] 생성되거나 캐시된 GPURenderPipeline (실패 시 null)
     * [EN] Created or cached GPURenderPipeline (null on failure)
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

        const resourceManager = this.resourceManager;
        const gpuDevice: GPUDevice = this.gpuDevice;
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();

        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentShaderModule) {
            material._updateFragmentState();
        }

        const isDepthPrepass = depthPassMode === 'depthPrepass';
        const isOctahedral = material instanceof OctahedralImpostorMaterial;
        const bTex = material.baseColorTexture;
        const hasBaseColorTexture = !!(bTex && (bTex.gpuTexture || bTex.src || bTex.url));

        if (isOctahedral && isDepthPrepass) {
            return null;
        }

        const effectiveIsMasked = isMasked || !!material.useCutOff || material.alphaBlend === 1 || material.alphaBlend === 2 || !!material.transparent;
        if (isDepthPrepass && effectiveIsMasked && !hasBaseColorTexture) {
            return null;
        }

        const isDepthPrepassOpaque = isDepthPrepass && !effectiveIsMasked;
        const fragmentModule: GPUShaderModule | null = isDepthPrepass
            ? (isDepthPrepassOpaque ? this.#depthPrepassOpaqueFragmentShaderModule : this.#depthPrepassMaskedFragmentShaderModule)
            : (material.gpuRenderInfo?.fragmentShaderModule || null);

        if (!fragmentModule) {
            return null;
        }

        const isWireframe = !!material.wireframe;
        const topology: GPUPrimitiveTopology = isWireframe ? 'line-list' : 'triangle-list';
        const baseKey = material.uuid;
        const shaderLabel = fragmentModule?.label || (isDepthPrepassOpaque ? 'depthPrepass_opaque' : 'default');
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
        const effectiveRenderUnitBGL = renderUnitBindGroupLayout || emptyBindGroupLayout;
        const materialBindGroupLayout = isDepthPrepassOpaque
            ? emptyBindGroupLayout
            : (material.gpuRenderInfo?.fragmentBindGroupLayout
                || emptyBindGroupLayout);

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
     * [KO] 통합된 위치 전용 그림자 지오메트리를 위한 WebGPU 렌더 파이프라인을 조회하거나 생성합니다.
     * [EN] Retrieves or creates a WebGPU render pipeline for unified position-only shadow geometry.
     * @param strideBytes -
     * [KO] 정점 스트라이드 바이트 수 (기본값: 12)
     * [EN] Vertex stride in bytes (default: 12)
     * @param cullMode -
     * [KO] 컬링 모드 (기본값: 'back')
     * [EN] Cull mode (default: 'back')
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 바인드 그룹 레이아웃 (선택사항)
     * [EN] Render unit bind group layout (optional)
     * @returns
     * [KO] 생성되거나 캐시된 GPURenderPipeline
     * [EN] Created or cached GPURenderPipeline
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

        const resourceManager = this.resourceManager;
        const gpuDevice: GPUDevice = this.gpuDevice;

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: strideBytes,
            attributes: this.#geoAttributesShadowOpaque,
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const {emptyBindGroupLayout} = resourceManager;
        const effectiveRenderUnitBGL = renderUnitBindGroupLayout || emptyBindGroupLayout;

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
     * [KO] 알파 마스킹(Cutout)이 적용된 그림자 캐스팅용 WebGPU 렌더 파이프라인을 조회하거나 생성합니다.
     * [EN] Retrieves or creates a WebGPU render pipeline for shadow casting with alpha masking (cutout).
     * @param material -
     * [KO] 적용할 머티리얼 인스턴스
     * [EN] Material instance to apply
     * @param strideBytes -
     * [KO] 정점 스트라이드 바이트 수 (기본값: 72)
     * [EN] Vertex stride in bytes (default: 72)
     * @param cullMode -
     * [KO] 컬링 모드 (기본값: 'none')
     * [EN] Cull mode (default: 'none')
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 바인드 그룹 레이아웃 (선택사항)
     * [EN] Render unit bind group layout (optional)
     * @returns
     * [KO] 생성되거나 캐시된 GPURenderPipeline (실패 시 null)
     * [EN] Created or cached GPURenderPipeline (null on failure)
     */
    getOrCreateShadowMaskedPipeline(
        material: any,
        strideBytes: number = 72,
        cullMode: GPUCullMode = 'none',
        renderUnitBindGroupLayout?: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        if (!material) return null;

        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState();
            material.dirtyPipeline = false;
        }

        const resourceManager = this.resourceManager;
        const gpuDevice: GPUDevice = this.gpuDevice;

        const materialUUID = material.uuid || material.name || 'mat';
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
        const effectiveRenderUnitBGL = renderUnitBindGroupLayout || emptyBindGroupLayout;
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentBindGroupLayout
            || emptyBindGroupLayout;

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
     * [KO] 캐시된 모든 WebGPU 렌더 파이프라인을 비웁니다.
     * [EN] Clears all cached WebGPU render pipelines.
     */
    clearCache(): void {
        this.#pipelineCache.clear();
    }

    #initShaderModules(): {
        vModule: GPUShaderModule;
        depthPrepassMaskedFModule: GPUShaderModule;
        depthPrepassOpaqueFModule: GPUShaderModule;
    } {
        const resourceManager = this.resourceManager;

        let vModule = resourceManager.getGPUShaderModule('Foliage_Instanced_VertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('Foliage_Instanced_VertexShaderModule', {
                code: foliageInstancedWGSL,
            });
        }

        let depthPrepassMaskedFModule = resourceManager.getGPUShaderModule('Foliage_DepthPrepass_Masked_FragmentShaderModule');
        if (!depthPrepassMaskedFModule) {
            depthPrepassMaskedFModule = resourceManager.createGPUShaderModule('Foliage_DepthPrepass_Masked_FragmentShaderModule', {
                code: foliageDepthPrepassMaskedFragmentWGSL,
            });
        }

        let depthPrepassOpaqueFModule = resourceManager.getGPUShaderModule('Foliage_DepthPrepass_Opaque_FragmentShaderModule');
        if (!depthPrepassOpaqueFModule) {
            depthPrepassOpaqueFModule = resourceManager.createGPUShaderModule('Foliage_DepthPrepass_Opaque_FragmentShaderModule', {
                code: foliageDepthPrepassOpaqueFragmentWGSL,
            });
        }

        return {vModule, depthPrepassMaskedFModule, depthPrepassOpaqueFModule};
    }
}

Object.freeze(FoliagePipelineRegistry);
export default FoliagePipelineRegistry;

import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import foliageInstancedWGSL from "./foliageInstanced.wgsl";
import foliageDepthPrepassMaskedFragmentWGSL from "./foliageDepthPrepassMaskedFragment.wgsl";
import foliageDepthPrepassOpaqueFragmentWGSL from "./foliageDepthPrepassOpaqueFragment.wgsl";
import OctahedralImpostorMaterial from "../baking/impostor/octahedral/OctahedralImpostorMaterial";

export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';

const INSTANCE_ATTRIBUTES_ALL: GPUVertexAttribute[] = [
    {shaderLocation: 6, offset: 0, format: 'float32x4'},
    {shaderLocation: 7, offset: 16, format: 'snorm16x4'},
    {shaderLocation: 8, offset: 24, format: 'float16x2'},
    {shaderLocation: 9, offset: 28, format: 'unorm8x4'},
];

class FoliagePipelineRegistry extends RedGPUObject {
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    #vertexShaderModule: GPUShaderModule;
    #depthPrepassMaskedFragmentShaderModule: GPUShaderModule;
    #depthPrepassOpaqueFragmentShaderModule: GPUShaderModule;

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


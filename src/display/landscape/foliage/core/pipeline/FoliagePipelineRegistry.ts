import RedGPUContext from "../../../../../context/RedGPUContext";
import ResourceManager from "../../../../../resources/core/resourceManager/ResourceManager";
import foliageInstancedWGSL from "./foliageInstanced.wgsl";
import foliageDepthPrepassWGSL from "./foliageDepthPrepass.wgsl";
import OctahedralImpostorMaterial from "../impostor/octahedral/OctahedralImpostorMaterial";

export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';

class FoliagePipelineRegistry {
    #redGPUContext: RedGPUContext;
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    #vertexShaderModule: GPUShaderModule | null = null;
    #depthPrepassFragmentShaderModule: GPUShaderModule | null = null;
    #emptyBindGroupLayout: GPUBindGroupLayout | null = null;

    constructor(redGPUContext: RedGPUContext, emptyBindGroupLayout?: GPUBindGroupLayout | null) {
        this.#redGPUContext = redGPUContext;
        this.#emptyBindGroupLayout = emptyBindGroupLayout || redGPUContext.gpuDevice?.createBindGroupLayout({
            label: 'EmptyFoliageBindGroupLayout',
            entries: []
        }) || null;
        this.#initShaderModules();
    }

    static readonly #GEO_ATTRIBUTES_ALL: readonly GPUVertexAttribute[] = [
        {shaderLocation: 0, offset: 0, format: 'float32x3'},
        {shaderLocation: 1, offset: 12, format: 'float32x3'},
        {shaderLocation: 2, offset: 24, format: 'float32x2'},
        {shaderLocation: 3, offset: 32, format: 'float32x2'},
        {shaderLocation: 4, offset: 40, format: 'float32x4'},
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

        const isDepthPrepass = depthPassMode === 'depthPrepass';
        const isOctahedral = material instanceof OctahedralImpostorMaterial || material?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof material?.name === 'string' && material.name.includes('Octahedral'));
        const hasBaseColorTexture = !!(material.baseColorTexture?.gpuTexture || material.baseColorTexture?.src || material.baseColorTexture?.url || (material.diffuseTexture && (material.diffuseTexture.gpuTexture || material.diffuseTexture.src || material.diffuseTexture.url)));

        if (isOctahedral && isDepthPrepass) {
            return null;
        }
        if (isDepthPrepass && !hasBaseColorTexture) {
            return null;
        }

        const fragmentModule: GPUShaderModule | null = isDepthPrepass
            ? this.#depthPrepassFragmentShaderModule
            : (material.gpuRenderInfo?.fragmentShaderModule || material.fragmentShaderModule);

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

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: validStrideBytes,
            attributes: FoliagePipelineRegistry.#GEO_ATTRIBUTES_ALL as GPUVertexAttribute[],
        };

        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8 * 4,
            stepMode: 'instance',
            attributes: FoliagePipelineRegistry.#INSTANCE_ATTRIBUTES_ALL as GPUVertexAttribute[],
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const effectiveSubMeshBGL = subMeshBindGroupLayout || this.#emptyBindGroupLayout!;
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentBindGroupLayout
            || material.gpuRenderInfo?.fragmentUniformBindGroup?.layout
            || this.#emptyBindGroupLayout;

        const bindGroupLayouts: GPUBindGroupLayout[] = [systemBindGroupLayout, effectiveSubMeshBGL, materialBindGroupLayout];

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `FoliagePipelineLayout_${pipelineKey}`,
            bindGroupLayouts: bindGroupLayouts,
        });

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

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `FoliageRenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule!,
                entryPoint: 'mainInput',
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: {
                module: fragmentModule!,
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
        subMeshBindGroupLayout?: GPUBindGroupLayout | null
    ): GPURenderPipeline {
        const pipelineKey = `FoliageShadowMerged_stride${strideBytes}_cull${cullMode}`;
        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        const resourceManager = this.#redGPUContext.resourceManager;
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: strideBytes,
            attributes: FoliagePipelineRegistry.#GEO_ATTRIBUTES_SHADOW_OPAQUE as GPUVertexAttribute[],
        };

        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8 * 4,
            stepMode: 'instance',
            attributes: FoliagePipelineRegistry.#INSTANCE_ATTRIBUTES_ALL as GPUVertexAttribute[],
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const effectiveSubMeshBGL = subMeshBindGroupLayout || this.#emptyBindGroupLayout!;

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `FoliagePipelineLayout_${pipelineKey}`,
            bindGroupLayouts: [systemBindGroupLayout, effectiveSubMeshBGL],
        });

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `FoliageRenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule!,
                entryPoint: 'entryPointShadowOpaqueVertex',
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: {
                module: this.#vertexShaderModule!,
                entryPoint: 'entryPointShadowOpaqueFragment',
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

    getOrCreateShadowMaskedPipeline(
        material: any,
        strideBytes: number = 72,
        cullMode: GPUCullMode = 'none',
        subMeshBindGroupLayout?: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        if (!material) return null;

        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState?.();
            material.dirtyPipeline = false;
        }

        const resourceManager = this.#redGPUContext.resourceManager;
        const gpuDevice: GPUDevice = this.#redGPUContext.gpuDevice;

        const materialUUID = material.uuid || material.name || 'mat';
        const pipelineKey = `FoliageShadowMasked_${materialUUID}_stride${strideBytes}_cull${cullMode}`;
        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: strideBytes,
            attributes: FoliagePipelineRegistry.#GEO_ATTRIBUTES_ALL as GPUVertexAttribute[],
        };

        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8 * 4,
            stepMode: 'instance',
            attributes: FoliagePipelineRegistry.#INSTANCE_ATTRIBUTES_ALL as GPUVertexAttribute[],
        };

        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const effectiveSubMeshBGL = subMeshBindGroupLayout || this.#emptyBindGroupLayout!;
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentBindGroupLayout
            || material.gpuRenderInfo?.fragmentUniformBindGroup?.layout
            || this.#emptyBindGroupLayout;

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `FoliagePipelineLayout_${pipelineKey}`,
            bindGroupLayouts: [systemBindGroupLayout, effectiveSubMeshBGL, materialBindGroupLayout],
        });

        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `FoliageRenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule!,
                entryPoint: 'entryPointShadowMaskedVertex',
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: {
                module: this.#vertexShaderModule!,
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
    }
}

Object.freeze(FoliagePipelineRegistry);
export default FoliagePipelineRegistry;

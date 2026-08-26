import RedGPUContext from "../../../../../context/RedGPUContext";
import ResourceManager from "../../../../../resources/core/resourceManager/ResourceManager";
import foliageInstancedWGSL from "./foliageInstanced.wgsl";
import foliageDepthInstancedWGSL from "./foliageDepthInstanced.wgsl";
import foliageDepthOnlyWGSL from "./foliageDepthOnly.wgsl";

export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';

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
        if (isDepthPrepass) {
            const hasBaseColorTexture = !!(material.baseColorTexture?.gpuTexture || material.baseColorTexture?.src || material.baseColorTexture?.url || (material.diffuseTexture && (material.diffuseTexture.gpuTexture || material.diffuseTexture.src || material.diffuseTexture.url)));
            if (!hasBaseColorTexture) {
                return null;
            }
        }
        const fragmentModule = isDepthPrepass
            ? this.#depthOnlyFragmentShaderModule
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
        const geoAttributes: GPUVertexAttribute[] = [
            {shaderLocation: 0, offset: 0, format: 'float32x3'},
            {shaderLocation: 1, offset: 12, format: 'float32x3'},
            {shaderLocation: 2, offset: 24, format: 'float32x2'},
            {shaderLocation: 3, offset: 32, format: 'float32x2'},
            {shaderLocation: 4, offset: 40, format: 'float32x4'},
            {shaderLocation: 5, offset: 56, format: 'float32x4'},
        ];

        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: validStrideBytes,
            attributes: geoAttributes,
        };

        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 12 * 4,
            stepMode: 'instance',
            attributes: [
                {shaderLocation: 6, offset: 0, format: 'float32x3'},
                {shaderLocation: 7, offset: 12, format: 'float32x4'},
                {shaderLocation: 8, offset: 28, format: 'float32x3'},
                {shaderLocation: 9, offset: 40, format: 'float32x2'},
            ],
        };

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
                depthCompare: 'less',
            };
        } else {

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

        let vModule = resourceManager.getGPUShaderModule('FoliageInstancedVertexShader_Module');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('FoliageInstancedVertexShader_Module', {
                code: foliageInstancedWGSL,
            });
        }
        this.#vertexShaderModule = vModule;

        let depthVModule = resourceManager.getGPUShaderModule('FoliageDepthInstancedVertexShader_Module');
        if (!depthVModule) {
            depthVModule = resourceManager.createGPUShaderModule('FoliageDepthInstancedVertexShader_Module', {
                code: foliageDepthInstancedWGSL,
            });
        }
        this.#depthVertexShaderModule = depthVModule;

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

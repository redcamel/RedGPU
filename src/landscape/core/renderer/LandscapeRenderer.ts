import RedGPUContext from "../../../context/RedGPUContext";
import type Landscape from "../../Landscape";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import type RenderViewStateData from "../../../display/view/core/RenderViewStateData";

class LandscapeRenderer {
    #landscape: Landscape;
    #redGPUContext: RedGPUContext;

    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();
    #cachedRenderPipeline: GPURenderPipeline | null = null;
    #lastRenderTopology: string = '';
    #lastRenderMaterialUUID: string = '';
    #lastRenderVariantModule: any = null;
    #lastRenderMsaaID: string = '';

    constructor(landscape: Landscape) {
        this.#landscape = landscape;
        this.#redGPUContext = landscape.redGPUContext;
    }

    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        const renderPassEncoder = passEncoder || view?.currentRenderPassEncoder || view?.renderPassEncoder;
        const view3D = view?.view || view;
        if (!renderPassEncoder) return;

        const landscape = this.#landscape;
        const material = landscape.material;
        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        if (material) {
            if (material.dirtyPipeline) {
                material._updateFragmentState();
                material.dirtyPipeline = false;
                this.clearPipelineCaches();
                if (renderResults) {
                    renderResults.numDirtyPipelines++;
                }
            }
        }

        const instanceBuffer = landscape.instanceBuffer;
        const sharedGeometry = landscape.sharedGeometry;
        const combinedVB = sharedGeometry?.combinedVertexBuffer;
        const isWireframe = !!landscape.debuggerManager?.landscapeWireframe;
        const combinedIB = isWireframe ? sharedGeometry?.combinedWireframeIndexBuffer : sharedGeometry?.combinedIndexBuffer;

        if (!instanceBuffer || !combinedVB || !combinedIB) return;

        const storageBG = instanceBuffer.instanceStorageBindGroup;
        const storageBGLayout = instanceBuffer.instanceStorageBindGroupLayout;
        if (!storageBG || !storageBGLayout) return;

        const pipeline = this.getOrCreateRenderPipeline(combinedVB, storageBGLayout);
        if (!pipeline) return;

        renderPassEncoder.setPipeline(pipeline);

        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup;
        if (systemBG) {
            renderPassEncoder.setBindGroup(0, systemBG);
        }

        renderPassEncoder.setBindGroup(1, storageBG);

        const matUniformBG = material?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG) {
            renderPassEncoder.setBindGroup(2, matUniformBG);
        }
        renderPassEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        renderPassEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        const lodMaxLevel = sharedGeometry.lodMaxLevel;
        const indirectDrawBuffer = instanceBuffer.indirectDrawBuffer;

        if (indirectDrawBuffer) {
            for (let lod = 0; lod < lodMaxLevel; lod++) {
                const offset = lod * 20;
                renderPassEncoder.drawIndexedIndirect(indirectDrawBuffer, offset);

                if (renderResults) {
                    renderResults.numDrawCalls++;
                }
            }
        }
    }

    getOrCreateRenderPipeline(geom: any, storageBGLayout: GPUBindGroupLayout): GPURenderPipeline | null {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const landscape = this.#landscape;
        const material = landscape.material;
        if (!gpuDevice || !material || !material.gpuRenderInfo) return null;

        const {msaaID, useMSAA} = this.#redGPUContext.antialiasingManager;
        const sampleCount = useMSAA ? 4 : 1;
        const isWireframe = !!landscape.debuggerManager?.landscapeWireframe;
        const topology = isWireframe ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        const fragModule = material.gpuRenderInfo.fragmentShaderModule;

        if (
            this.#cachedRenderPipeline &&
            this.#lastRenderTopology === topology &&
            this.#lastRenderMaterialUUID === material.uuid &&
            this.#lastRenderVariantModule === fragModule &&
            this.#lastRenderMsaaID === msaaID
        ) {
            return this.#cachedRenderPipeline;
        }

        const variantKey = fragModule.label || 'default';
        const key = `${topology}_${material.uuid}_${variantKey}_${msaaID}`;

        if (this.#renderPipelineCache.has(key)) {
            const pipeline = this.#renderPipelineCache.get(key)!;
            this.#cachedRenderPipeline = pipeline;
            this.#lastRenderTopology = topology;
            this.#lastRenderMaterialUUID = material.uuid;
            this.#lastRenderVariantModule = fragModule;
            this.#lastRenderMsaaID = msaaID;
            return pipeline;
        }

        try {
            const resourceManager = this.#redGPUContext.resourceManager;
            const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');
            const fragUniformBGLayout = material.gpuRenderInfo.fragmentBindGroupLayout;

            const pipelineLayout = resourceManager.createGPUPipelineLayout(`Landscape_PipelineLayout_${key}`, {
                bindGroupLayouts: [systemBGLayout, storageBGLayout, fragUniformBGLayout]
            });

            const vertexBuffers: GPUVertexBufferLayout[] = [{
                arrayStride: geom?.interleavedStruct?.arrayStride ?? 20,
                attributes: geom?.interleavedStruct?.attributes ?? [
                    {shaderLocation: 0, offset: 0, format: 'float32x3'},
                    {shaderLocation: 1, offset: 12, format: 'float32x2'}
                ]
            }];

            const pipeline = gpuDevice.createRenderPipeline({
                label: `Landscape_RenderPipeline_${key}`,
                layout: pipelineLayout,
                vertex: {
                    module: landscape.vertexShaderModule,
                    entryPoint: 'main',
                    buffers: vertexBuffers,
                },
                fragment: material.gpuRenderInfo.fragmentState,
                primitive: {
                    topology: topology,
                    cullMode: isWireframe ? 'none' : 'back'
                },
                depthStencil: {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less-equal',
                },
                multisample: {count: sampleCount}
            });

            this.#renderPipelineCache.set(key, pipeline);
            this.#cachedRenderPipeline = pipeline;
            this.#lastRenderTopology = topology;
            this.#lastRenderMaterialUUID = material.uuid;
            this.#lastRenderVariantModule = fragModule;
            this.#lastRenderMsaaID = msaaID;
            return pipeline;
        } catch (e) {
            console.warn('Failed to create Landscape RenderPipeline:', e);
            return null;
        }
    }

    clearPipelineCaches(): void {
        this.#renderPipelineCache.clear();
        this.#cachedRenderPipeline = null;
        this.#lastRenderTopology = '';
        this.#lastRenderMaterialUUID = '';
        this.#lastRenderVariantModule = null;
        this.#lastRenderMsaaID = '';
    }

    destroy(): void {
        this.clearPipelineCaches();
        this.#landscape = null!;
        this.#redGPUContext = null!;
    }
}

Object.freeze(LandscapeRenderer);
export default LandscapeRenderer;


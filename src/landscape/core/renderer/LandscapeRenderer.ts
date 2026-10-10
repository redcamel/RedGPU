/**
 * [KO] 지형 전용 WebGPU 렌더러 모듈입니다.
 * [EN] Dedicated WebGPU renderer module for terrain landscape.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import type Landscape from "../../Landscape";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import type RenderViewStateData from "../../../display/view/core/RenderViewStateData";

/**
 * [KO] 지형 파이프라인 캐싱 및 인다이렉트 드로우(Indirect Draw)를 전담 수행하는 렌더러 클래스입니다.
 * [EN] Renderer class dedicated to pipeline caching and indirect drawing of terrain.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeRenderer {
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

    /**
     * [KO] 지형의 인다이렉트 드로우 파이프라인을 실행하여 현재 렌더 패스에 지형 렌더링 커맨드를 기록합니다.
     * [EN] Executes the indirect draw pipeline of the landscape to record terrain rendering commands into the active render pass.
     *
     * @param view - {@link RedGPU.Display.View3D} 또는 렌더 뷰 상태 객체
     * @param passEncoder - 대상 WebGPU 렌더 패스 인코더 (생략 시 view에서 추출)
     */
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

    /**
     * [KO] 버텍스 레이아웃 및 머티리얼 상태에 부합하는 WebGPU 렌더 파이프라인을 캐시에서 조회하거나 새로 생성합니다.
     * [EN] Retrieves from cache or creates a new WebGPU render pipeline matching the vertex layout and material state.
     */
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

    /**
     * [KO] 캐시된 모든 지형 렌더 파이프라인을 비웁니다.
     * [EN] Clears all cached terrain render pipelines.
     */
    clearPipelineCaches(): void {
        this.#renderPipelineCache.clear();
        this.#cachedRenderPipeline = null;
        this.#lastRenderTopology = '';
        this.#lastRenderMaterialUUID = '';
        this.#lastRenderVariantModule = null;
        this.#lastRenderMsaaID = '';
    }

    /**
     * [KO] 렌더러가 보유한 파이프라인 캐시 및 내부 참조를 해제합니다.
     * [EN] Releases pipeline caches and internal references held by the renderer.
     */
    destroy(): void {
        this.clearPipelineCaches();
        this.#landscape = null!;
        this.#redGPUContext = null!;
    }
}

Object.freeze(LandscapeRenderer);
export default LandscapeRenderer;

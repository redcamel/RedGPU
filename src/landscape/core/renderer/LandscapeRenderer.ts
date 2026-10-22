import RedGPUObject from "../../../base/RedGPUObject";
import type Landscape from "../../Landscape";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import type RenderViewStateData from "../../../display/view/core/RenderViewStateData";

/**
 * [KO] `Landscape` 지형 객체의 렌더 파이프라인 캐싱과 LOD별 간접 드로우(`drawIndexedIndirect`) 호출을 수행하는 렌더러 클래스입니다.
 * [EN] Renderer class that manages render pipeline caching and executes per-LOD indirect draw (`drawIndexedIndirect`) calls for a `Landscape` terrain object.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class LandscapeRenderer extends RedGPUObject {
    #landscape: Landscape | null;

    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();
    #cachedRenderPipeline: GPURenderPipeline | null = null;
    #lastRenderTopology: string = '';
    #lastRenderMaterialUUID: string = '';
    #lastRenderVariantModule: any = null;
    #lastRenderMsaaID: string = '';

    /**
     * [KO] `LandscapeRenderer` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeRenderer` instance.
     *
     * @param landscape -
     * [KO] 렌더링할 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance to render
     */
    constructor(landscape: Landscape) {
        super(landscape.redGPUContext);
        this.#landscape = landscape;
    }

    /**
     * [KO] 현재 렌더 패스 인코더에 지형 파이프라인 및 바인드 그룹을 설정하고 모든 LOD 레벨에 대해 간접 드로우를 수행합니다.
     * [EN] Binds the terrain pipeline and bind groups to the current render pass encoder and executes indirect draws for all LOD levels.
     *
     * @param view -
     * [KO] 현재 렌더링 뷰 또는 `RenderViewStateData` 객체
     * [EN] Current render view or `RenderViewStateData` object
     * @param passEncoder -
     * [KO] 사용할 `GPURenderPassEncoder` (생략 시 `view`에서 추출)
     * [EN] `GPURenderPassEncoder` to use (extracted from `view` if omitted)
     */
    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        const renderPassEncoder = passEncoder || view?.currentRenderPassEncoder || view?.renderPassEncoder;
        const view3D = view?.view || view;
        if (!renderPassEncoder) return;

        const landscape = this.#landscape;
        if (!landscape) return;
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

        const pipeline = this.#getOrCreateRenderPipeline(combinedVB, storageBGLayout);
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
     * [KO] 현재 지오메트리 레이아웃, 토폴로지, 머티리얼 및 MSAA 상태에 부합하는 `GPURenderPipeline`을 조회하거나 새로 생성하여 반환합니다.
     * [EN] Retrieves or creates a `GPURenderPipeline` matching the current geometry layout, topology, material, and MSAA state.
     *
     * @param geom -
     * [KO] 정점 버퍼 인터리브 구조 정보를 포함한 지오메트리 버퍼 객체
     * [EN] Geometry buffer object containing vertex buffer interleaved struct information
     * @param storageBGLayout -
     * [KO] 지형 인스턴스 스토리지 바인드 그룹 레이아웃 (`GPUBindGroupLayout`)
     * [EN] Terrain instance storage bind group layout (`GPUBindGroupLayout`)
     * @returns
     * [KO] 생성 또는 캐시된 `GPURenderPipeline` 인스턴스 또는 실패 시 `null`
     * [EN] Created or cached `GPURenderPipeline` instance, or `null` on failure
     */
    #getOrCreateRenderPipeline(geom: any, storageBGLayout: GPUBindGroupLayout): GPURenderPipeline | null {
        const {gpuDevice, antialiasingManager, resourceManager} = this;
        const landscape = this.#landscape;
        if (!landscape) return null;
        const material = landscape.material;
        if (!gpuDevice || !material || !material.gpuRenderInfo) return null;

        const {msaaID, useMSAA} = antialiasingManager;
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

        const cachedPipeline = this.#renderPipelineCache.get(key);
        if (cachedPipeline) {
            this.#cachedRenderPipeline = cachedPipeline;
            this.#lastRenderTopology = topology;
            this.#lastRenderMaterialUUID = material.uuid;
            this.#lastRenderVariantModule = fragModule;
            this.#lastRenderMsaaID = msaaID;
            return cachedPipeline;
        }

        try {
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
     * [KO] 캐싱된 모든 지형 렌더 파이프라인 상태를 초기화합니다.
     * [EN] Clears all cached terrain render pipeline states.
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
     * [KO] 렌더러의 파이프라인 캐시 및 지형 참조를 해제합니다.
     * [EN] Releases the renderer's pipeline cache and terrain references.
     */
    destroy(): void {
        this.clearPipelineCaches();
        this.#landscape = null;
    }
}

Object.freeze(LandscapeRenderer);
export default LandscapeRenderer;

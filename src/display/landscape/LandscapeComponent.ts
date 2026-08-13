import RedGPUContext from "../../context/RedGPUContext";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import RenderViewStateData from "../view/core/RenderViewStateData";
import landscapeVertexSource from "./shader/landscapeVertex.wgsl";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";

/**
 * [KO] SpatialGrid의 단일 공간 셀(타일) 단위를 렌더링 디스패치하는 내부 렌더링 컴포넌트 클래스입니다 (Multi-LOD Batching 전담).
 * [EN] Internal rendering component class that dispatches rendering for a single spatial cell (tile) unit of SpatialGrid (Dedicated to Multi-LOD Batching).
 */
export class LandscapeComponent {
    #redGPUContext: RedGPUContext;
    #sharedGeometry: LandscapeSharedGeometry;
    #tileX: number = 0;
    #tileZ: number = 0;
    #prevTileX: number = 0;
    #prevTileZ: number = 0;
    #lodLevel: number = 0;
    #material: LandscapeMaterial;
    #wireframe: boolean = false;
    #topology: GPUPrimitiveTopology = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;

    #vertexShaderModule: GPUShaderModule;
    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();
    #lastUpdateMSAAID: string = '';

    /**
     * [KO] LandscapeComponent 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeComponent.
     */
    constructor(
        redGPUContext: RedGPUContext,
        sharedGeometry: LandscapeSharedGeometry,
        tileX: number,
        tileZ: number,
        material: LandscapeMaterial,
        wireframe: boolean = false
    ) {
        this.#redGPUContext = redGPUContext;
        this.#sharedGeometry = sharedGeometry;
        this.#tileX = tileX;
        this.#tileZ = tileZ;
        this.#prevTileX = tileX;
        this.#prevTileZ = tileZ;
        this.#material = material;
        this.#wireframe = wireframe;
        this.#topology = wireframe ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;

        const resourceManager = redGPUContext.resourceManager;
        let vModule = resourceManager.getGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule', {
                code: landscapeVertexSource
            });
        }
        this.#vertexShaderModule = vModule;
    }

    set x(val: number) {
        this.#prevTileX = this.#tileX;
        this.#tileX = val;
    }

    get x(): number {
        return this.#tileX;
    }

    set z(val: number) {
        this.#prevTileZ = this.#tileZ;
        this.#tileZ = val;
    }

    get z(): number {
        return this.#tileZ;
    }

    get prevTileX(): number {
        return this.#prevTileX;
    }

    get tileX(): number {
        return this.#tileX;
    }

    get tileZ(): number {
        return this.#tileZ;
    }

    get prevTileZ(): number {
        return this.#prevTileZ;
    }

    updateSharedGeometry(sharedGeometry: LandscapeSharedGeometry): void {
        this.#sharedGeometry = sharedGeometry;
        this.#renderPipelineCache.clear();
    }

    /**
     * [KO] 프레임 종료 후 이전 타일 위치를 현재 위치로 안전하게 업데이트합니다 (Mesh prevModelMatrix 동기화와 100% 동일).
     */
    updatePrevPosition(): void {
        this.#prevTileX = this.#tileX;
        this.#prevTileZ = this.#tileZ;
    }

    get lodLevel(): number {
        return this.#lodLevel;
    }

    set lodLevel(val: number) {
        this.#lodLevel = val;
    }

    get material(): LandscapeMaterial {
        return this.#material;
    }

    set material(val: LandscapeMaterial) {
        this.#material = val;
    }

    get wireframe(): boolean {
        return this.#wireframe;
    }

    set wireframe(val: boolean) {
        this.#wireframe = val;
        this.#topology = val ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
    }

    /**
     * [KO] Multi-LOD Batching 인스턴싱으로 64개 전체 지형 타일을 디스패치하고 RenderViewStateData 통계를 기록합니다 (Zero-GC).
     */
    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        const renderPassEncoder = passEncoder || view?.currentRenderPassEncoder || view?.renderPassEncoder;
        const view3D = view?.view || view;
        if (!renderPassEncoder) return;

        const scene = view3D?.rawScene || view3D?.scene;
        const landscape = (scene as any)?.landscapeChildren?.[0];
        if (!landscape) return;

        const instanceBuffer = landscape.instanceBuffer;
        const sharedGeometry = landscape.sharedGeometry;
        const combinedVB = sharedGeometry?.combinedVertexBuffer;
        const combinedIB = sharedGeometry?.combinedIndexBuffer;

        if (!instanceBuffer || !combinedVB || !combinedIB) return;

        const storageBG = instanceBuffer.instanceStorageBindGroup;
        const storageBGLayout = instanceBuffer.instanceStorageBindGroupLayout;
        if (!storageBG || !storageBGLayout) return;

        // 1. GPURenderPipeline 취득 및 세팅 (RedGPU 표준 msaaID 정동기화)
        const pipeline = this.#getOrCreateRenderPipeline(combinedVB, storageBGLayout);
        if (!pipeline) return;

        renderPassEncoder.setPipeline(pipeline);

        // 2. RedGPU 표준 systemUniform_Vertex_UniformBindGroup (0번) 세팅
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup;
        if (systemBG) {
            renderPassEncoder.setBindGroup(0, systemBG);
        }

        // 3. Material fragmentUniformBindGroup (1번 - Material Uniform) 세팅
        const matUniformBG = this.#material?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG) {
            renderPassEncoder.setBindGroup(1, matUniformBG);
        }

        // 4. 전체 타일 GPU StorageBuffer (2번) 세팅
        renderPassEncoder.setBindGroup(2, storageBG);

        // 5. 단일 거대 통합 Vertex & Index Buffer 바인딩 (Zero-Rebind)
        renderPassEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        renderPassEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        // 6. RenderViewStateData 통계 집계 참조
        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        // 7. LOD 단계별 Multi-LOD Batching 드로우 디스패치
        const lodCount = sharedGeometry.lodCount;
        for (let lod = 0; lod < lodCount; lod++) {
            const instanceCount = instanceBuffer.getLODInstanceCount(lod);
            if (instanceCount === 0) continue;

            const lodRange = sharedGeometry.getLODRange(lod);
            const firstInstance = instanceBuffer.getLODFirstInstance(lod);

            renderPassEncoder.drawIndexed(
                lodRange.indexCount,
                instanceCount,
                lodRange.firstIndex,
                lodRange.baseVertex,
                firstInstance
            );

            // RenderViewStateData 통계 집계 누적 기록
            if (renderResults) {
                renderResults.numDrawCalls++;
                renderResults.numInstances += instanceCount;
                renderResults.num3DObjects += instanceCount;
                renderResults.numTriangles += (lodRange.indexCount / 3) * instanceCount;
            }
        }
    }

    #getOrCreateRenderPipeline(geom: any, storageBGLayout: GPUBindGroupLayout): GPURenderPipeline | null {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const material = this.#material;
        if (!gpuDevice || !material || !material.gpuRenderInfo) return null;

        // RedGPU 표준 msaaID 기반 안티앨리어싱 상태 추적 및 파이프라인 캐싱
        const antialiasingManager = this.#redGPUContext.antialiasingManager;
        const msaaID = antialiasingManager.msaaID;
        const useMSAA = antialiasingManager.useMSAA;
        const sampleCount = useMSAA ? 4 : 1;
        const key = `${this.#lodLevel}_${this.#topology}_${material.uuid}_${msaaID}`;

        if (this.#renderPipelineCache.has(key)) {
            return this.#renderPipelineCache.get(key);
        }

        try {
            const resourceManager = this.#redGPUContext.resourceManager;
            const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');
            const fragUniformBGLayout = material.gpuRenderInfo.fragmentBindGroupLayout;

            const pipelineLayout = gpuDevice.createPipelineLayout({
                label: `LandscapePipelineLayout_${key}`,
                bindGroupLayouts: [systemBGLayout, fragUniformBGLayout, storageBGLayout]
            });

            const vertexBuffers: GPUVertexBufferLayout[] = [{
                arrayStride: geom?.interleavedStruct?.arrayStride ?? 32,
                attributes: geom?.interleavedStruct?.attributes ?? [
                    {shaderLocation: 0, offset: 0, format: 'float32x3'},
                    {shaderLocation: 1, offset: 12, format: 'float32x3'},
                    {shaderLocation: 2, offset: 24, format: 'float32x2'}
                ]
            }];

            const pipeline = gpuDevice.createRenderPipeline({
                label: `LandscapeRenderPipeline_${key}`,
                layout: pipelineLayout,
                vertex: {
                    module: this.#vertexShaderModule,
                    entryPoint: 'main',
                    buffers: vertexBuffers,
                },
                fragment: material.gpuRenderInfo.fragmentState,
                primitive: {
                    topology: this.#topology,
                    cullMode: 'none'
                },
                depthStencil: {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less-equal', // RedGPU 3D 표준 정동기화 (less -> less-equal Z-Fighting 소멸)
                },
                multisample: {count: sampleCount}
            });

            this.#lastUpdateMSAAID = String(msaaID);
            this.#renderPipelineCache.set(key, pipeline);
            return pipeline;
        } catch (e) {
            console.warn('Failed to create Landscape RenderPipeline:', e);
            return null;
        }
    }
}

export default LandscapeComponent;

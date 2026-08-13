import RedGPUContext from "../../context/RedGPUContext";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import RenderViewStateData from "../view/core/RenderViewStateData";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";
import landscapeVertexSource from "./shader/landscapeVertex.wgsl";

/**
 * [KO] 단일 지형 타일 인스턴스 전용 순수 데이터 & 렌더 디스패치 클래스입니다 (Mesh 미상속 / Zero-Weight 경량 객체).
 * [EN] Pure data & render dispatch class dedicated to single terrain tile instance (Non-Mesh inheritance / Zero-Weight lightweight object).
 */
export class LandscapeComponent {
    #redGPUContext: RedGPUContext;
    #sharedGeometry: LandscapeSharedGeometry;
    #tileX: number = 0;
    #tileZ: number = 0;
    #lodLevel: number = 0;
    #material: LandscapeMaterial;
    #wireframe: boolean = false;
    #topology: GPUPrimitiveTopology = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;

    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();
    #vertexShaderModule: GPUShaderModule;

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
        this.#material = material;
        this.wireframe = wireframe;

        // WGSL 버텍스 셰이더 모듈 취득
        const resourceManager = redGPUContext.resourceManager;
        let vModule = resourceManager.getGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule', {
                code: landscapeVertexSource
            });
        }
        this.#vertexShaderModule = vModule;
    }

    public updateSharedGeometry(sharedGeometry: LandscapeSharedGeometry): void {
        this.#sharedGeometry = sharedGeometry;
    }

    public get x(): number {
        return this.#tileX;
    }

    public set x(val: number) {
        this.#tileX = val;
    }

    public get y(): number {
        return 0;
    }

    public get z(): number {
        return this.#tileZ;
    }

    public set z(val: number) {
        this.#tileZ = val;
    }

    public get tileX(): number {
        return this.#tileX;
    }

    public get tileZ(): number {
        return this.#tileZ;
    }

    public get lodLevel(): number {
        return this.#lodLevel;
    }

    public set lodLevel(val: number) {
        this.#lodLevel = val;
    }

    public get material(): LandscapeMaterial {
        return this.#material;
    }

    public set material(val: LandscapeMaterial) {
        this.#material = val;
    }

    public get wireframe(): boolean {
        return this.#wireframe;
    }

    public set wireframe(val: boolean) {
        this.#wireframe = val;
        this.#topology = val ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
    }

    /**
     * [KO] Multi-LOD Batching 인스턴싱으로 64개 전체 지형 타일을 디스패치하고 RenderViewStateData 통계를 기록합니다.
     */
    public render(view: any, passEncoder?: GPURenderPassEncoder): void {
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

        // 1. GPURenderPipeline 취득 및 세팅
        const pipeline = this.#getOrCreateRenderPipeline(combinedVB, storageBGLayout);
        if (!pipeline) return;

        renderPassEncoder.setPipeline(pipeline);

        // 2. RedGPU 표준 systemUniform_Vertex_UniformBindGroup (0번) 세팅
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup;
        if (systemBG) {
            renderPassEncoder.setBindGroup(0, systemBG);
        }

        // 3. Material fragmentUniformBindGroup (1번) 세팅
        const matBG = this.#material?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matBG) {
            renderPassEncoder.setBindGroup(1, matBG);
        }

        // 4. 전체 타일 GPU StorageBuffer (2번) 세팅
        renderPassEncoder.setBindGroup(2, storageBG);

        // 5. 단일 거대 통합 Vertex & Index Buffer 바인딩 (Zero-Rebind)
        renderPassEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        renderPassEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        // 6. RenderViewStateData 통계 집계 참조
        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        // 7. LOD 단계별 Multi-LOD Batching 드로우 디스패치 (baseVertex 오프셋 정밀 수술)
        const lodCount = sharedGeometry.lodCount;
        for (let lod = 0; lod < lodCount; lod++) {
            const instanceCount = instanceBuffer.getLODInstanceCount(lod);
            if (instanceCount === 0) continue;

            const lodRange = sharedGeometry.getLODRange(lod);
            const firstInstance = instanceBuffer.getLODFirstInstance(lod);

            // baseVertex 오프셋으로 lodRange.baseVertex를 명시 전달하여 각 LOD별 세분화 격자가 차등 적용되도록 완벽 수술!
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

        const key = `${this.#lodLevel}_${this.#topology}_${material.uuid}`;
        if (this.#renderPipelineCache.has(key)) {
            return this.#renderPipelineCache.get(key);
        }

        try {
            const resourceManager = this.#redGPUContext.resourceManager;
            const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');
            const fragBGLayout = material.gpuRenderInfo.fragmentBindGroupLayout;

            const pipelineLayout = gpuDevice.createPipelineLayout({
                label: `LandscapePipelineLayout_${key}`,
                bindGroupLayouts: [systemBGLayout, fragBGLayout, storageBGLayout]
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
                    depthCompare: 'less',
                },
                multisample: {count: 1}
            });

            this.#renderPipelineCache.set(key, pipeline);
            return pipeline;
        } catch (e) {
            console.warn('Failed to create Landscape RenderPipeline:', e);
            return null;
        }
    }
}

export default LandscapeComponent;

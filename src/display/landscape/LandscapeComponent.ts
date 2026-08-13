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

    // 타일 위치 오프셋 전달용 GPU UniformBuffer & BindGroup (Zero-GC)
    #tileUniformBuffer: GPUBuffer | null = null;
    #tileBindGroup: GPUBindGroup | null = null;
    #tileUniformData: Float32Array = new Float32Array(2);

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

        const gpuDevice = redGPUContext.gpuDevice;

        // 타일 유니폼 버퍼 생성 (tileX, tileZ)
        if (gpuDevice) {
            this.#tileUniformBuffer = gpuDevice.createBuffer({
                size: 16,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                label: `LandscapeTileUniformBuffer_${tileX}_${tileZ}`
            });
            this.#updateTileUniform();
        }

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

    #updateTileUniform(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#tileUniformBuffer) return;

        this.#tileUniformData[0] = this.#tileX;
        this.#tileUniformData[1] = this.#tileZ;

        gpuDevice.queue.writeBuffer(this.#tileUniformBuffer, 0, this.#tileUniformData.buffer as ArrayBuffer, 0, 8);
    }

    public get x(): number {
        return this.#tileX;
    }

    public set x(val: number) {
        this.#tileX = val;
        this.#updateTileUniform();
    }

    public get y(): number {
        return 0;
    }

    public get z(): number {
        return this.#tileZ;
    }

    public set z(val: number) {
        this.#tileZ = val;
        this.#updateTileUniform();
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

    public updateSharedGeometry(sharedGeometry: LandscapeSharedGeometry): void {
        this.#sharedGeometry = sharedGeometry;
    }

    /**
     * [KO] 단일 거대 통합 GPU 버퍼에서 현재 LOD 오프셋을 선택하여 Render Pass Encoder에 렌더 커맨드를 디스패치합니다.
     */
    public render(renderViewStateData: RenderViewStateData): void {
        const passEncoder = renderViewStateData.currentRenderPassEncoder;
        if (!passEncoder) return;

        const combinedVB = this.#sharedGeometry.combinedVertexBuffer;
        const combinedIB = this.#sharedGeometry.combinedIndexBuffer;
        if (!combinedVB || !combinedIB) return;

        const lodRange = this.#sharedGeometry.getLODRange(this.#lodLevel);

        // 1. GPURenderPipeline 취득 및 세팅
        const pipeline = this.#getOrCreateRenderPipeline(combinedVB);
        if (!pipeline) return;

        passEncoder.setPipeline(pipeline);

        // 2. RedGPU 표준 systemUniform_Vertex_UniformBindGroup (0번) 세팅
        const view = renderViewStateData.view as any;
        const systemBG = view?.systemUniform_Vertex_UniformBindGroup;
        if (systemBG) {
            passEncoder.setBindGroup(0, systemBG);
        }

        // 3. Material fragmentUniformBindGroup (1번) 세팅
        const matBG = this.#material?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matBG) {
            passEncoder.setBindGroup(1, matBG);
        }

        // 4. Tile UniformBindGroup (2번) 세팅
        if (this.#tileBindGroup) {
            passEncoder.setBindGroup(2, this.#tileBindGroup);
        }

        // 5. 단일 거대 통합 Vertex & Index Buffer 바인딩
        passEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        passEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        // 6. LOD 오프셋 선택 Draw Call 발사 (firstIndex 선택)
        passEncoder.drawIndexed(lodRange.indexCount, 1, lodRange.firstIndex, 0, 0);
    }

    #getOrCreateRenderPipeline(geom: any): GPURenderPipeline | null {
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

            const tileBGLayout = gpuDevice.createBindGroupLayout({
                label: `LandscapeTileBGLayout`,
                entries: [{
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {type: 'uniform'}
                }]
            });

            if (this.#tileUniformBuffer) {
                this.#tileBindGroup = gpuDevice.createBindGroup({
                    label: `LandscapeTileBindGroup_${this.#tileX}_${this.#tileZ}`,
                    layout: tileBGLayout,
                    entries: [{
                        binding: 0,
                        resource: {buffer: this.#tileUniformBuffer}
                    }]
                });
            }

            const pipelineLayout = gpuDevice.createPipelineLayout({
                label: `LandscapePipelineLayout_${key}`,
                bindGroupLayouts: [systemBGLayout, fragBGLayout, tileBGLayout]
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

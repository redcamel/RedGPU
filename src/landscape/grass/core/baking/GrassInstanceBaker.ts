/**
 * [KO] 절차적 잔디 인스턴스 지형 물리 베이커 모듈입니다.
 * [EN] Procedural grass instance terrain physical baker module.
 * @packageDocumentation
 */
import type RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import grassBakeComputeWGSL from "./grassBakeCompute.wgsl";
import type {GrassMegaBuffer} from "../buffer/GrassMegaBuffer";

/**
 * [KO] 지형(Landscape) 표면에 잔디 인스턴스들을 물리적으로 안착·정렬시키는 GPU Compute 기반 잔디 인스턴스 베이커 클래스입니다.
 * [EN] GPU compute-based grass instance baker class that physically conforms and aligns grass instances to the landscape terrain surface.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class GrassInstanceBaker extends RedGPUObject {
    #bakePipeline: GPUComputePipeline | null = null;
    #bakeBindGroupLayout: GPUBindGroupLayout | null = null;
    #bakeBindGroup: GPUBindGroup | null = null;

    #uniformGPUBuffer: GPUBuffer | null = null;
    #uniformCPUBuffer: Float32Array;
    #uniformUintBuffer: Uint32Array;

    #tasksGPUBuffer: GPUBuffer | null = null;
    #tasksCPUBuffer: Uint32Array;
    #taskCapacity: number = 65536;
    #taskCount: number = 0;

    #cachedRawBuffer: GPUBuffer | null = null;
    #cachedTypeParamsBuffer: GPUBuffer | null = null;
    #cachedVHTTextureView: GPUTextureView | null = null;
    #cachedVBTTextureView: GPUTextureView | null = null;

    /**
     * [KO] GrassInstanceBaker 인스턴스를 생성하고 내부 유니폼 버퍼 및 GPU 컴퓨트 파이프라인을 초기화합니다. (사용자가 직접 생성하지 마시고 `landscape.grassManager` 프로퍼티를 통해 접근하십시오.)
     * [EN] Creates a GrassInstanceBaker instance and initializes internal uniform buffers and the GPU compute pipeline. (Do not instantiate directly; access via the `landscape.grassManager` property instead.)
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

        this.#uniformCPUBuffer = new Float32Array(8);
        this.#uniformUintBuffer = new Uint32Array(this.#uniformCPUBuffer.buffer);

        this.#tasksCPUBuffer = new Uint32Array(this.#taskCapacity * 2);

        this.#init();
    }

    /**
     * [KO] GPU 디스패치 대기 중인 베이킹 작업이 남아있는지 여부를 반환합니다.
     * [EN] Gets whether there are pending bake tasks awaiting GPU dispatch.
     *
     * @returns
     * [KO] 대기 중인 베이킹 작업이 있으면 `true`, 없으면 `false`
     * [EN] `true` if there are pending bake tasks, otherwise `false`
     */
    get hasPendingTasks(): boolean {
        return this.#taskCount > 0;
    }

    /**
     * [KO] 현재 캐시된 WebGPU 바인드그룹 및 버퍼/텍스처 캐시를 무효화하여, 다음 디스패치 시 최신 리소스로 재생성하도록 강제합니다.
     * [EN] Invalidates the currently cached WebGPU bind group and buffer/texture caches, forcing recreation with latest resources on the next dispatch.
     */
    invalidateBindGroup(): void {
        this.#bakeBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedVHTTextureView = null;
        this.#cachedVBTTextureView = null;
    }

    /**
     * [KO] 지정된 잔디 타입과 인스턴스 범위에 대한 베이킹 작업을 큐에 추가합니다.
     * [EN] Adds bake tasks for a specified grass type and instance range to the task queue.
     *
     * @param startIndex -
     * [KO] GrassMegaBuffer 내 인스턴스 시작 오프셋 인덱스
     * [EN] Starting offset index of instances within GrassMegaBuffer
     * @param count -
     * [KO] 베이킹할 인스턴스 개수
     * [EN] Number of instances to bake
     * @param typeId -
     * [KO] 잔디 종류의 고유 식별자 ID
     * [EN] Unique identifier ID of the grass type
     */
    addBakeTasks(startIndex: number, count: number, typeId: number): void {
        if (count <= 0) return;
        this.#ensureTaskCapacity(this.#taskCount + count);

        const buf = this.#tasksCPUBuffer;
        let offset = this.#taskCount * 2;
        for (let i = 0; i < count; i++) {
            buf[offset++] = startIndex + i;
            buf[offset++] = typeId;
        }
        this.#taskCount += count;
    }

    /**
     * [KO] 등록된 베이킹 작업들을 GPU Compute Pass에 전달하여 실제 지형 흡착, 쿼터니언 회전 및 바운딩 연산을 고속 실행합니다.
     * [EN] Dispatches registered bake tasks to the GPU compute pass to execute high-speed terrain snapping, quaternion rotation, and bounding calculations.
     *
     * @param computePass -
     * [KO] 현재 실행 중인 GPUComputePassEncoder
     * [EN] Active GPUComputePassEncoder
     * @param megaBuffer -
     * [KO] 잔디 인스턴스 데이터를 저장하는 GrassMegaBuffer 인스턴스
     * [EN] GrassMegaBuffer instance storing grass instance data
     * @param vhtTextureView -
     * [KO] 지형 가상 높이맵(VHT) 텍스처 뷰
     * [EN] Terrain virtual height texture (VHT) texture view
     * @param vbtTextureView -
     * [KO] 지형 가상 베이스 컬러(VBT) 텍스처 뷰
     * [EN] Terrain virtual base texture (VBT) texture view
     * @param worldSizeX -
     * [KO] 지형의 월드 X 크기
     * [EN] World X dimension of the landscape
     * @param worldSizeZ -
     * [KO] 지형의 월드 Z 크기
     * [EN] World Z dimension of the landscape
     * @param heightScale -
     * [KO] 지형의 최대 높이 스케일
     * [EN] Maximum height scale of the landscape
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassMegaBuffer,
        vhtTextureView: GPUTextureView | null | undefined,
        vbtTextureView: GPUTextureView | null | undefined,
        worldSizeX: number,
        worldSizeZ: number,
        heightScale: number
    ): void {
        if (this.#taskCount === 0 || !this.#bakePipeline || !this.#bakeBindGroupLayout || !this.#uniformGPUBuffer || !this.#tasksGPUBuffer) {
            return;
        }

        const {gpuDevice, resourceManager} = this;
        const {rawGPUBuffer, typeParamsGPUBuffer} = megaBuffer;
        if (!gpuDevice || !rawGPUBuffer || !typeParamsGPUBuffer) {
            return;
        }

        const {emptyBitmapTextureView} = resourceManager;
        const targetVHTView = vhtTextureView || emptyBitmapTextureView;
        const targetVBTView = vbtTextureView || emptyBitmapTextureView;

        const f32 = this.#uniformCPUBuffer;
        const u32 = this.#uniformUintBuffer;
        f32[0] = worldSizeX > 0 ? 1.0 / worldSizeX : 0.0;
        f32[1] = worldSizeZ > 0 ? 1.0 / worldSizeZ : 0.0;
        f32[2] = heightScale;
        u32[3] = this.#taskCount;
        u32[4] = vbtTextureView ? 1 : 0;
        f32[5] = 0.0;
        f32[6] = 0.0;
        u32[7] = 0;

        gpuDevice.queue.writeBuffer(
            this.#uniformGPUBuffer,
            0,
            this.#uniformCPUBuffer.buffer,
            0,
            32
        );

        const taskBytes = this.#taskCount * 8;
        gpuDevice.queue.writeBuffer(
            this.#tasksGPUBuffer,
            0,
            this.#tasksCPUBuffer.buffer,
            0,
            taskBytes
        );

        if (
            !this.#bakeBindGroup ||
            this.#cachedRawBuffer !== rawGPUBuffer ||
            this.#cachedTypeParamsBuffer !== typeParamsGPUBuffer ||
            this.#cachedVHTTextureView !== targetVHTView ||
            this.#cachedVBTTextureView !== targetVBTView
        ) {
            this.#cachedRawBuffer = rawGPUBuffer;
            this.#cachedTypeParamsBuffer = typeParamsGPUBuffer;
            this.#cachedVHTTextureView = targetVHTView;
            this.#cachedVBTTextureView = targetVBTView;

            const {basicSampler} = resourceManager;
            this.#bakeBindGroup = gpuDevice.createBindGroup({
                label: `Grass_Bake_BindGroup_${this.instanceId}`,
                layout: this.#bakeBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: rawGPUBuffer}},
                    {binding: 1, resource: {buffer: this.#uniformGPUBuffer}},
                    {binding: 2, resource: {buffer: typeParamsGPUBuffer}},
                    {binding: 3, resource: {buffer: this.#tasksGPUBuffer}},
                    {binding: 4, resource: targetVHTView},
                    {binding: 5, resource: targetVBTView},
                    {binding: 6, resource: basicSampler.gpuSampler},
                ],
            });
        }

        const workgroups = Math.ceil(this.#taskCount / 64);
        computePass.setPipeline(this.#bakePipeline);
        computePass.setBindGroup(0, this.#bakeBindGroup);
        computePass.dispatchWorkgroups(workgroups);

        this.#taskCount = 0;
    }

    /**
     * [KO] GrassInstanceBaker가 점유하고 있는 내부 GPU 버퍼, 파이프라인 및 바인드그룹 리소스를 완전히 해제합니다.
     * [EN] Completely releases internal GPU buffers, pipelines, and bind group resources held by GrassInstanceBaker.
     */
    destroy(): void {
        this.#uniformGPUBuffer?.destroy();
        this.#uniformGPUBuffer = null;
        this.#tasksGPUBuffer?.destroy();
        this.#tasksGPUBuffer = null;
        this.#bakePipeline = null;
        this.#bakeBindGroupLayout = null;
        this.invalidateBindGroup();
        this.#taskCount = 0;
    }

    #init(): void {
        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice) return;

        this.#uniformGPUBuffer = gpuDevice.createBuffer({
            label: `Grass_Bake_UniformBuffer_${this.instanceId}`,
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#tasksGPUBuffer = gpuDevice.createBuffer({
            label: `Grass_Bake_TasksBuffer_${this.instanceId}`,
            size: this.#taskCapacity * 8,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const shaderModule = resourceManager.createGPUShaderModule('Grass_Bake_ComputeModule', {
            code: grassBakeComputeWGSL,
        });

        this.#bakeBindGroupLayout = resourceManager.createBindGroupLayout('Grass_Bake_BindGroupLayout', {
            label: 'Grass_Bake_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 6, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
            ],
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout('Grass_Bake_PipelineLayout', {
            bindGroupLayouts: [this.#bakeBindGroupLayout],
        });

        this.#bakePipeline = gpuDevice.createComputePipeline({
            label: `Grass_Bake_ComputePipeline_${this.instanceId}`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main',
            },
        });
    }

    #ensureTaskCapacity(requiredCapacity: number): void {
        if (requiredCapacity <= this.#taskCapacity) return;

        const gpuDevice = this.gpuDevice;
        let newCap = this.#taskCapacity;
        while (newCap < requiredCapacity) {
            newCap *= 2;
        }

        const oldCpu = this.#tasksCPUBuffer;
        this.#tasksCPUBuffer = new Uint32Array(newCap * 2);
        this.#tasksCPUBuffer.set(oldCpu);
        this.#taskCapacity = newCap;

        if (gpuDevice) {
            this.#tasksGPUBuffer?.destroy();
            this.#tasksGPUBuffer = gpuDevice.createBuffer({
                label: `Grass_Bake_TasksBuffer_${this.instanceId}`,
                size: this.#taskCapacity * 8,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            this.invalidateBindGroup();
        }
    }
}

Object.freeze(GrassInstanceBaker);

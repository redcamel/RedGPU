import RedGPUContext from "../../../../../context/RedGPUContext";
import grassBakeComputeSource from "./grassBakeCompute.wgsl";
import GrassMegaBuffer from "../buffer/GrassMegaBuffer";

/**
 * 잔디 스폰 전용 GPU 1회성 지형 베이커 (GrassBaker)
 * 신규 셀 스폰 시 생성된 인스턴스에 대해서만 1회성으로 VHT(높이/법선) 및 VBT(지면 베이스컬러) 텍스처를 샘플링하여
 * 지형 높이, 패킹된 법선, 패킹된 지면 색상을 rawInstances에 영구 기록합니다.
 * 평상시 프레임(스폰 없음)에는 GPU 디스패치 0회로 동작합니다.
 */
export class GrassBaker {
    #redGPUContext: RedGPUContext;
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
    #cachedTasksBuffer: GPUBuffer | null = null;
    #cachedVHTTextureView: GPUTextureView | null = null;
    #cachedVHTSampler: GPUSampler | null = null;
    #cachedVBTTextureView: GPUTextureView | null = null;
    #cachedVBTSampler: GPUSampler | null = null;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        // invWorldSizeX(f32), invWorldSizeZ(f32), heightScale(f32), totalTasks(u32), hasVBT(u32), pad(3) = 32 bytes
        this.#uniformCPUBuffer = new Float32Array(8);
        this.#uniformUintBuffer = new Uint32Array(this.#uniformCPUBuffer.buffer);

        this.#tasksCPUBuffer = new Uint32Array(this.#taskCapacity * 2);

        this.#init();
    }

    /**
     * 베이크 대기 중인 태스크가 있는지 여부 반환
     */
    get hasPendingTasks(): boolean {
        return this.#taskCount > 0;
    }

    invalidateBindGroup(): void {
        this.#bakeBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedTasksBuffer = null;
        this.#cachedVHTTextureView = null;
        this.#cachedVHTSampler = null;
        this.#cachedVBTTextureView = null;
        this.#cachedVBTSampler = null;
    }

    /**
     * 신규 생성된 인스턴스 슬롯들을 1회성 베이크 큐에 추가 (Zero-GC)
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
     * GPU 컴퓨트 패스에서 대기 중인 태스크들을 1회 디스패치 (이후 큐 자동 비움)
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassMegaBuffer,
        vhtTextureView: GPUTextureView | null | undefined,
        vhtSampler: GPUSampler | null | undefined,
        vbtTextureView: GPUTextureView | null | undefined,
        vbtSampler: GPUSampler | null | undefined,
        worldSizeX: number,
        worldSizeZ: number,
        heightScale: number
    ): void {
        if (this.#taskCount === 0 || !this.#bakePipeline || !this.#bakeBindGroupLayout || !this.#uniformGPUBuffer || !this.#tasksGPUBuffer) {
            return;
        }

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !megaBuffer.rawGPUBuffer || !megaBuffer.typeParamsGPUBuffer) {
            return;
        }

        const targetVHTView = vhtTextureView || this.#redGPUContext.resourceManager.emptyTexture2DArrayView;
        const targetVHTSampler = vhtSampler || this.#redGPUContext.resourceManager.basicSampler.gpuSampler;
        const targetVBTView = vbtTextureView || this.#redGPUContext.resourceManager.emptyTexture2DArrayView;
        const targetVBTSampler = vbtSampler || this.#redGPUContext.resourceManager.basicSampler.gpuSampler;

        // 1. 유니폼 업로드
        const f32 = this.#uniformCPUBuffer;
        const u32 = this.#uniformUintBuffer;
        f32[0] = worldSizeX > 0 ? 1.0 / worldSizeX : 0.0;
        f32[1] = worldSizeZ > 0 ? 1.0 / worldSizeZ : 0.0;
        f32[2] = heightScale;
        u32[3] = this.#taskCount;
        u32[4] = vbtTextureView ? 1 : 0;
        u32[5] = 0;
        u32[6] = 0;
        u32[7] = 0;

        gpuDevice.queue.writeBuffer(
            this.#uniformGPUBuffer,
            0,
            this.#uniformCPUBuffer.buffer,
            0,
            32
        );

        // 2. 태스크 인덱스 버퍼 업로드
        const taskBytes = this.#taskCount * 8;
        gpuDevice.queue.writeBuffer(
            this.#tasksGPUBuffer,
            0,
            this.#tasksCPUBuffer.buffer,
            0,
            taskBytes
        );

        // 3. 바인드 그룹 검사 및 생성
        if (
            !this.#bakeBindGroup ||
            this.#cachedRawBuffer !== megaBuffer.rawGPUBuffer ||
            this.#cachedTypeParamsBuffer !== megaBuffer.typeParamsGPUBuffer ||
            this.#cachedTasksBuffer !== this.#tasksGPUBuffer ||
            this.#cachedVHTTextureView !== targetVHTView ||
            this.#cachedVHTSampler !== targetVHTSampler ||
            this.#cachedVBTTextureView !== targetVBTView ||
            this.#cachedVBTSampler !== targetVBTSampler
        ) {
            this.#cachedRawBuffer = megaBuffer.rawGPUBuffer;
            this.#cachedTypeParamsBuffer = megaBuffer.typeParamsGPUBuffer;
            this.#cachedTasksBuffer = this.#tasksGPUBuffer;
            this.#cachedVHTTextureView = targetVHTView;
            this.#cachedVHTSampler = targetVHTSampler;
            this.#cachedVBTTextureView = targetVBTView;
            this.#cachedVBTSampler = targetVBTSampler;

            this.#bakeBindGroup = gpuDevice.createBindGroup({
                label: 'GrassBaker_BindGroup',
                layout: this.#bakeBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: megaBuffer.rawGPUBuffer}},
                    {binding: 1, resource: {buffer: this.#uniformGPUBuffer}},
                    {binding: 2, resource: {buffer: megaBuffer.typeParamsGPUBuffer}},
                    {binding: 3, resource: {buffer: this.#tasksGPUBuffer}},
                    {binding: 4, resource: targetVHTView},
                    {binding: 5, resource: targetVHTSampler},
                    {binding: 6, resource: targetVBTView},
                    {binding: 7, resource: targetVBTSampler},
                ],
            });
        }

        // 4. 디스패치 (신규 인스턴스 개수만큼만 1회 실행)
        const workgroups = Math.ceil(this.#taskCount / 64);
        computePass.setPipeline(this.#bakePipeline);
        computePass.setBindGroup(0, this.#bakeBindGroup);
        computePass.dispatchWorkgroups(workgroups);

        // 5. 완료 후 큐 리셋 (Zero-GC)
        this.#taskCount = 0;
    }

    destroy(): void {
        this.#uniformGPUBuffer?.destroy();
        this.#uniformGPUBuffer = null;
        this.#tasksGPUBuffer?.destroy();
        this.#tasksGPUBuffer = null;
        this.#bakePipeline = null;
        this.#bakeBindGroupLayout = null;
        this.#bakeBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedTasksBuffer = null;
        this.#cachedVHTTextureView = null;
        this.#cachedVHTSampler = null;
        this.#cachedVBTTextureView = null;
        this.#cachedVBTSampler = null;
        this.#taskCount = 0;
    }

    #init(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#uniformGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassBaker_UniformBuffer',
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#tasksGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassBaker_TasksBuffer',
            size: this.#taskCapacity * 8, // 8 bytes per task (vec2<u32>)
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const shaderModule = gpuDevice.createShaderModule({
            label: 'GrassBakeComputeModule',
            code: grassBakeComputeSource,
        });

        this.#bakeBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'GrassBaker_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
                {binding: 6, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 7, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
            ],
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'GrassBaker_PipelineLayout',
            bindGroupLayouts: [this.#bakeBindGroupLayout],
        });

        this.#bakePipeline = gpuDevice.createComputePipeline({
            label: 'GrassBaker_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main',
            },
        });
    }

    #ensureTaskCapacity(requiredCapacity: number): void {
        if (requiredCapacity <= this.#taskCapacity) return;

        const gpuDevice = this.#redGPUContext.gpuDevice;
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
                label: 'GrassBaker_TasksBuffer',
                size: this.#taskCapacity * 8,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            this.invalidateBindGroup();
        }
    }
}

export default GrassBaker;

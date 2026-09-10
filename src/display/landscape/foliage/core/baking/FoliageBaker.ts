import RedGPUContext from "../../../../../context/RedGPUContext";
import foliageBakeComputeSource from "./foliageBakeCompute.wgsl";
import FoliageMegaBuffer from "../buffer/FoliageMegaBuffer";

/**
 * 식생(Foliage) 스폰/마운트 전용 GPU 1회성 지형 베이커 (FoliageBaker)
 * 서브셀이 GPU 버퍼에 마운트될 때 신규 인스턴스에 대해서만 VHT를 1회 읽어
 * 지형 정밀 높이를 rawInstances에 영구 기록합니다.
 * 마운트가 없는 일반 프레임에는 GPU 디스패치 0회로 완전 유휴 상태를 유지합니다.
 */
export class FoliageBaker {
    #redGPUContext: RedGPUContext;
    #bakePipeline: GPUComputePipeline | null = null;
    #bakeBindGroupLayout: GPUBindGroupLayout | null = null;
    #bakeBindGroup: GPUBindGroup | null = null;

    #uniformGPUBuffer: GPUBuffer | null = null;
    #uniformCPUBuffer: Float32Array;
    #uniformUintBuffer: Uint32Array;

    #tasksGPUBuffer: GPUBuffer | null = null;
    #tasksCPUBuffer: Uint32Array;
    #taskCapacity: number = 32768;
    #taskCount: number = 0;

    #cachedRawBuffer: GPUBuffer | null = null;
    #cachedTypeParamsBuffer: GPUBuffer | null = null;
    #cachedTasksBuffer: GPUBuffer | null = null;
    #cachedVHTTextureView: GPUTextureView | null = null;
    #cachedVHTSampler: GPUSampler | null = null;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        // invWorldSizeX(f32), invWorldSizeZ(f32), heightScale(f32), totalTasks(u32) = 16 bytes
        this.#uniformCPUBuffer = new Float32Array(4);
        this.#uniformUintBuffer = new Uint32Array(this.#uniformCPUBuffer.buffer);

        this.#tasksCPUBuffer = new Uint32Array(this.#taskCapacity * 2);

        this.#init();
    }

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
    }

    /**
     * 신규 마운트된 식생 슬롯들을 1회성 베이크 큐에 추가 (Zero-GC)
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
     * GPU 컴퓨트 패스에서 대기 중인 베이크 태스크들을 1회 디스패치 (이후 큐 자동 비움)
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: FoliageMegaBuffer,
        vhtTextureView: GPUTextureView | null | undefined,
        vhtSampler: GPUSampler | null | undefined,
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

        // 1. 유니폼 업로드
        const f32 = this.#uniformCPUBuffer;
        const u32 = this.#uniformUintBuffer;
        f32[0] = worldSizeX > 0 ? 1.0 / worldSizeX : 0.0;
        f32[1] = worldSizeZ > 0 ? 1.0 / worldSizeZ : 0.0;
        f32[2] = heightScale;
        u32[3] = this.#taskCount;

        gpuDevice.queue.writeBuffer(
            this.#uniformGPUBuffer,
            0,
            this.#uniformCPUBuffer.buffer,
            0,
            16
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
            this.#cachedVHTSampler !== targetVHTSampler
        ) {
            this.#cachedRawBuffer = megaBuffer.rawGPUBuffer;
            this.#cachedTypeParamsBuffer = megaBuffer.typeParamsGPUBuffer;
            this.#cachedTasksBuffer = this.#tasksGPUBuffer;
            this.#cachedVHTTextureView = targetVHTView;
            this.#cachedVHTSampler = targetVHTSampler;

            this.#bakeBindGroup = gpuDevice.createBindGroup({
                label: 'FoliageBaker_BindGroup',
                layout: this.#bakeBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: megaBuffer.rawGPUBuffer}},
                    {binding: 1, resource: {buffer: this.#uniformGPUBuffer}},
                    {binding: 2, resource: {buffer: megaBuffer.typeParamsGPUBuffer}},
                    {binding: 3, resource: {buffer: this.#tasksGPUBuffer}},
                    {binding: 4, resource: targetVHTView},
                    {binding: 5, resource: targetVHTSampler},
                ],
            });
        }

        // 4. 디스패치
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
        this.#taskCount = 0;
    }

    #init(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#uniformGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageBaker_UniformBuffer',
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#tasksGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageBaker_TasksBuffer',
            size: this.#taskCapacity * 8, // 8 bytes per task (vec2<u32>)
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const shaderModule = gpuDevice.createShaderModule({
            label: 'FoliageBakeComputeModule',
            code: foliageBakeComputeSource,
        });

        this.#bakeBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'FoliageBaker_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
            ],
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'FoliageBaker_PipelineLayout',
            bindGroupLayouts: [this.#bakeBindGroupLayout],
        });

        this.#bakePipeline = gpuDevice.createComputePipeline({
            label: 'FoliageBaker_ComputePipeline',
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
                label: 'FoliageBaker_TasksBuffer',
                size: this.#taskCapacity * 8,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            this.invalidateBindGroup();
        }
    }
}

export default FoliageBaker;

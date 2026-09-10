import RedGPUContext from "../../../../../context/RedGPUContext";
import grassBakeComputeSource from "./grassBakeCompute.wgsl";
import GrassMegaBuffer from "../buffer/GrassMegaBuffer";

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

        this.#uniformCPUBuffer = new Float32Array(8);
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
        this.#cachedVBTTextureView = null;
        this.#cachedVBTSampler = null;
    }

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

        const workgroups = Math.ceil(this.#taskCount / 64);
        computePass.setPipeline(this.#bakePipeline);
        computePass.setBindGroup(0, this.#bakeBindGroup);
        computePass.dispatchWorkgroups(workgroups);

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
            size: this.#taskCapacity * 8,
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

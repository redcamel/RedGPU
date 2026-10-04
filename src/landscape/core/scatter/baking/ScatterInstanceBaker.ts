/**
 * [KO] 스캐터 인스턴스 지형 물리 베이커 모듈입니다.
 * [EN] Scatter instance terrain physical baker module.
 * @packageDocumentation
 */

import type RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] 인스턴스 베이킹에 필요한 최소 GPU 버퍼 프로퍼티를 정의하는 메가버퍼 인터페이스입니다.
 * [EN] MegaBuffer interface defining the minimum GPU buffer properties required for instance baking.
 */
export interface IScatterBakeMegaBuffer {
    /**
     * [KO] 원본 인스턴스 데이터가 저장되는 GPU 스토리지 버퍼
     * [EN] GPU storage buffer storing raw instance data
     */
    rawGPUBuffer: GPUBuffer | null;
    /**
     * [KO] 타입별 설정 파라미터가 저장되는 GPU 스토리지 버퍼 (선택사항)
     * [EN] GPU storage buffer storing type-specific configuration parameters (optional)
     */
    typeParamsGPUBuffer?: GPUBuffer | null;
    /**
     * [KO] CPU 측 타입 파라미터 버퍼 (bottomOffset 동기화용)
     * [EN] CPU-side type parameter buffer (for bottomOffset synchronization)
     */
    cpuTypeParamsBuffer?: Float32Array;
    /**
     * [KO] 단일 타입당 float 요소 수
     * [EN] Number of float elements per single type
     */
    typeParamFloats?: number;
    /**
     * [KO] 최대 지원 식생 타입 수
     * [EN] Maximum supported foliage types
     */
    maxTypes?: number;
}

/**
 * [KO] ScatterInstanceBaker 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for ScatterInstanceBaker.
 */
export interface ScatterInstanceBakerOptions {
    /**
     * [KO] 실행할 WebGPU Compute WGSL 셰이더 소스코드 문자열
     * [EN] WebGPU Compute WGSL shader source code string to execute
     */
    computeShaderCode: string;
    /**
     * [KO] 디버깅 및 프로파일링용 베이커 식별 라벨
     * [EN] Identifier label for debugging and profiling
     */
    label: string;
    /**
     * [KO] 초기 태스크 큐 수용 용량 (인스턴스 수, 기본값: 32768)
     * [EN] Initial task queue capacity (number of instances, default: 32768)
     */
    initialTaskCapacity?: number;
}

/**
 * [KO] 지형(Landscape) 표면에 스캐터 인스턴스(식생, 잔디 등)들을 물리적으로 안착시키는 GPU Compute 기반 베이커 기본 클래스입니다.
 * [EN] GPU compute-based baker base class that physically conforms scatter instances (foliage, grass, etc.) to the landscape terrain surface.
 */
export class ScatterInstanceBaker extends RedGPUObject {
    #bakePipeline: GPUComputePipeline | null = null;
    #bakeBindGroupLayout: GPUBindGroupLayout | null = null;
    #bakeBindGroup: GPUBindGroup | null = null;

    #uniformGPUBuffer: GPUBuffer | null = null;
    #uniformCPUBuffer: Float32Array;
    #uniformUintBuffer: Uint32Array;

    #tasksGPUBuffer: GPUBuffer | null = null;
    #tasksCPUBuffer: Uint32Array;
    #taskCapacity: number;
    #taskCount: number = 0;

    #cachedRawBuffer: GPUBuffer | null = null;
    #cachedVHTTextureView: GPUTextureView | null = null;
    #cachedVBTTextureView: GPUTextureView | null = null;

    #computeShaderCode: string;
    #label: string;

    /**
     * [KO] ScatterInstanceBaker 인스턴스를 생성하고 내부 유니폼 버퍼 및 GPU 컴퓨트 파이프라인을 초기화합니다.
     * [EN] Creates a ScatterInstanceBaker instance and initializes internal uniform buffers and the GPU compute pipeline.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param options -
     * [KO] 베이커 초기화 설정 옵션
     * [EN] Baker initialization configuration options
     */
    constructor(redGPUContext: RedGPUContext, options: ScatterInstanceBakerOptions) {
        super(redGPUContext);

        this.#computeShaderCode = options.computeShaderCode;
        this.#label = options.label;
        this.#taskCapacity = options.initialTaskCapacity || 32768;

        this.#uniformCPUBuffer = new Float32Array(72);
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
        this.#cachedVHTTextureView = null;
        this.#cachedVBTTextureView = null;
    }

    /**
     * [KO] 지정된 인스턴스 타입과 인스턴스 범위에 대한 베이킹 작업을 큐에 추가합니다.
     * [EN] Adds bake tasks for a specified instance type and instance range to the task queue.
     *
     * @param startIndex -
     * [KO] MegaBuffer 내 인스턴스 시작 오프셋 인덱스
     * [EN] Starting offset index of instances within MegaBuffer
     * @param count -
     * [KO] 베이킹할 인스턴스 개수
     * [EN] Number of instances to bake
     * @param typeId -
     * [KO] 인스턴스 종류의 고유 식별자 ID
     * [EN] Unique identifier ID of the instance type
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
     * [KO] 등록된 베이킹 작업들을 GPU Compute Pass에 전달하여 실제 지형 스냅 및 지면 색상 샘플링을 실행합니다.
     * [EN] Dispatches registered bake tasks to the GPU compute pass to execute physical terrain height snapping and ground color sampling.
     *
     * @param computePass -
     * [KO] 현재 실행 중인 GPUComputePassEncoder
     * [EN] Active GPUComputePassEncoder
     * @param megaBuffer -
     * [KO] 인스턴스 데이터를 저장하는 IScatterBakeMegaBuffer 호환 메가버퍼 인스턴스
     * [EN] IScatterBakeMegaBuffer-compatible megaBuffer instance storing instance data
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
        megaBuffer: IScatterBakeMegaBuffer,
        vhtTextureView: GPUTextureView | null | undefined,
        vbtTextureView: GPUTextureView | null | undefined,
        worldSizeX: number,
        worldSizeZ: number,
        heightScale: number
    ): void {
        if (this.#taskCount === 0 || !this.#bakePipeline || !this.#bakeBindGroupLayout || !this.#uniformGPUBuffer || !this.#tasksGPUBuffer) {
            return;
        }

        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !megaBuffer.rawGPUBuffer) {
            return;
        }

        const basicGPUSampler = this.resourceManager.basicSampler.gpuSampler;
        const emptyBitmapView = this.resourceManager.emptyBitmapTextureView;
        const targetVHTView = vhtTextureView || emptyBitmapView;
        const targetVBTView = vbtTextureView || emptyBitmapView;

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

        const cpuTypeParams = megaBuffer.cpuTypeParamsBuffer;
        const stride = megaBuffer.typeParamFloats || 80;
        const maxTypes = Math.min(megaBuffer.maxTypes || 64, 64);
        if (cpuTypeParams) {
            for (let t = 0; t < maxTypes; t++) {
                f32[8 + t] = cpuTypeParams[t * stride + 3];
            }
        }

        gpuDevice.queue.writeBuffer(
            this.#uniformGPUBuffer,
            0,
            this.#uniformCPUBuffer.buffer,
            0,
            288
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
            this.#cachedVHTTextureView !== targetVHTView ||
            this.#cachedVBTTextureView !== targetVBTView
        ) {
            this.#cachedRawBuffer = megaBuffer.rawGPUBuffer;
            this.#cachedVHTTextureView = targetVHTView;
            this.#cachedVBTTextureView = targetVBTView;

            this.#bakeBindGroup = gpuDevice.createBindGroup({
                label: `${this.#label}_BindGroup`,
                layout: this.#bakeBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: megaBuffer.rawGPUBuffer}},
                    {binding: 1, resource: {buffer: this.#uniformGPUBuffer}},
                    {binding: 2, resource: {buffer: this.#tasksGPUBuffer}},
                    {binding: 3, resource: targetVHTView},
                    {binding: 4, resource: targetVBTView},
                    {binding: 5, resource: basicGPUSampler},
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
     * [KO] ScatterInstanceBaker가 점유하고 있는 내부 GPU 버퍼, 파이프라인 및 바인드그룹 리소스를 완전히 해제합니다.
     * [EN] Completely releases internal GPU buffers, pipelines, and bind group resources held by ScatterInstanceBaker.
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
            label: `${this.#label}_UniformBuffer`,
            size: 288,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#tasksGPUBuffer = gpuDevice.createBuffer({
            label: `${this.#label}_TasksBuffer`,
            size: this.#taskCapacity * 8,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const shaderModule = resourceManager.createGPUShaderModule(`${this.#label}_ComputeModule`, {
            code: this.#computeShaderCode,
        });

        this.#bakeBindGroupLayout = resourceManager.createBindGroupLayout(`${this.#label}_BindGroupLayout`, {
            label: `${this.#label}_BindGroupLayout`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
            ],
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout(`${this.#label}_PipelineLayout`, {
            bindGroupLayouts: [this.#bakeBindGroupLayout],
        });

        this.#bakePipeline = gpuDevice.createComputePipeline({
            label: `${this.#label}_ComputePipeline`,
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
                label: `${this.#label}_TasksBuffer`,
                size: this.#taskCapacity * 8,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            this.invalidateBindGroup();
        }
    }
}

Object.freeze(ScatterInstanceBaker);

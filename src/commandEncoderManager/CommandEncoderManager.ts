import RedGPUContext from "../context/RedGPUContext";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "./COMMAND_ENCODER_TYPE";
import RedGPUObject from "../base/RedGPUObject";
import keepLog from "../utils/keepLog";

/**
 * [KO] 실행 단계(Phase)별 커맨드 제출 및 패스 통계 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining command submission and pass statistics per execution phase.
 *
 * @category CommandEncoderManager
 */
export interface CommandPhaseStats {
    /**
     * [KO] 인코더의 실행 단계(Phase) 타입
     * [EN] Execution phase type of the encoder
     */
    'Phase'?: CommandEncoderType;
    /**
     * [KO] 제출된 커맨드 버퍼의 총 개수
     * [EN] Total number of submitted command buffers
     */
    'Command Buffers': number;
    /**
     * [KO] 렌더 패스 실행 통계 정보
     * [EN] Render pass execution statistics
     */
    'Render Passes': {
        /**
         * [KO] 실행된 렌더 패스의 총 개수
         * [EN] Total number of executed render passes
         */
        count: number;
        /**
         * [KO] 실행된 렌더 패스들의 레이블 목록
         * [EN] List of labels for executed render passes
         */
        list: string[];
    };
    /**
     * [KO] 컴퓨트 패스 실행 통계 정보
     * [EN] Compute pass execution statistics
     */
    'Compute Passes': {
        /**
         * [KO] 실행된 컴퓨트 패스의 총 개수
         * [EN] Total number of executed compute passes
         */
        count: number;
        /**
         * [KO] 실행된 컴퓨트 패스들의 레이블 목록
         * [EN] List of labels for executed compute passes
         */
        list: string[];
    };
    /**
     * [KO] 인코더 직접 참조(`useEncoder`) 호출 횟수
     * [EN] Number of direct encoder usages (`useEncoder` call count)
     */
    'Raw Usages': number;
}

/**
 * [KO] 전체 단계 일괄 제출(`submitAll`) 결과 통계 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining the batch submission (`submitAll`) statistics across all phases.
 *
 * @category CommandEncoderManager
 */
export interface CommandBatchStats {
    /**
     * [KO] 각 단계(Phase)별 상세 통계 정보 레코드 (`Record<string, CommandPhaseStats>`)
     * [EN] Detailed statistics record per phase (`Record<string, CommandPhaseStats>`)
     */
    phases: Record<string, CommandPhaseStats>;
    /**
     * [KO] 제출 완료 후 지연 파괴(Deferred Destroy)된 리소스의 개수
     * [EN] Number of resources destroyed via deferred destruction after submission
     */
    deferredDestroyCount: number;
}

/**
 * [KO] 컴퓨트 패스 생성 시 전달할 수 있는 입력 타입(레이블 문자열 또는 `GPUComputePassDescriptor` 객체)입니다.
 * [EN] Input type for compute pass creation (label string or `GPUComputePassDescriptor` object).
 *
 * @category CommandEncoderManager
 */
export type ComputePassDescriptorInput = string | GPUComputePassDescriptor;

/**
 * [KO] GPU 커맨드 인코더 및 렌더/컴퓨트 패스의 생명주기를 단계별로 관리하는 클래스입니다. 단계별로 단일 인코더를 공유하며 중첩 패스 호출 시 자동으로 새 인코더를 분리 생성합니다.
 * [EN] Class that manages the lifecycle of GPU command encoders and render/compute passes by phase. Shares a single encoder per phase and automatically spawns a new encoder when nested pass calls occur.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category CommandEncoderManager
 */
class CommandEncoderManager extends RedGPUObject {

    readonly #encoderMap: Map<CommandEncoderType, GPUCommandEncoder[]> = new Map();
    readonly #isPassActive: Partial<Record<CommandEncoderType, boolean>> = {};
    readonly #stats: Map<CommandEncoderType, {
        renderPasses: string[],
        computePasses: string[],
        rawUsages: number
    }> = new Map();
    readonly #deferredDestroyList: { destroy(): void }[] = [];

    /**
     * [KO] CommandEncoderManager 인스턴스를 생성합니다.
     * [EN] Creates a CommandEncoderManager instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 커맨드 제출 완료 후 안전한 시점에 파괴할 리소스를 지연 파괴 목록에 등록합니다.
     * [EN] Registers a resource to the deferred destroy list to be safely destroyed after command submission completes.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addDeferredDestroy(tempBuffer);
     * ```
     *
     * @param resource -
     * [KO] 파괴할 리소스 객체 (`destroy` 메서드를 구현해야 함)
     * [EN] Resource object to destroy (must implement the `destroy` method)
     */
    addDeferredDestroy(resource: { destroy(): void }): void {
        this.#deferredDestroyList.push(resource);
    }

    /**
     * [KO] `RESOURCE` 단계의 렌더 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a render pass for the `RESOURCE` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addResourceRenderPass(renderPassDescriptor, (pass) => {
     *     pass.setPipeline(myRenderPipeline);
     *     pass.setVertexBuffer(0, myVertexBuffer);
     *     pass.draw(3);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] 렌더 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands
     */
    addResourceRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.RESOURCE, descriptor, executor);
    }

    /**
     * [KO] `RESOURCE` 단계의 컴퓨트 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a compute pass for the `RESOURCE` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addResourceComputePass('MyResourceComputePass', (pass) => {
     *     pass.setPipeline(myComputePipeline);
     *     pass.setBindGroup(0, myBindGroup);
     *     pass.dispatchWorkgroups(64, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] 컴퓨트 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the compute pass
     * @param executor -
     * [KO] 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands
     */
    addResourceComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.RESOURCE, labelOrDescriptor, executor);
    }

    /**
     * [KO] `PRE_PROCESS` 단계의 렌더 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a render pass for the `PRE_PROCESS` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addPreProcessRenderPass(shadowPassDescriptor, (pass) => {
     *     pass.setPipeline(shadowPipeline);
     *     pass.drawIndexed(indexCount);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] 렌더 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands
     */
    addPreProcessRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.PRE_PROCESS, descriptor, executor);
    }

    /**
     * [KO] `PRE_PROCESS` 단계의 컴퓨트 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a compute pass for the `PRE_PROCESS` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addPreProcessComputePass('ParticleSimulation', (pass) => {
     *     pass.setPipeline(particleComputePipeline);
     *     pass.dispatchWorkgroups(32, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] 컴퓨트 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the compute pass
     * @param executor -
     * [KO] 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands
     */
    addPreProcessComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.PRE_PROCESS, labelOrDescriptor, executor);
    }

    /**
     * [KO] `MAIN` 단계의 렌더 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a render pass for the `MAIN` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addMainRenderPass(mainRenderPassDescriptor, (pass) => {
     *     pass.setPipeline(mainPipeline);
     *     pass.drawIndexed(indexCount);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] 렌더 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands
     */
    addMainRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.MAIN, descriptor, executor);
    }

    /**
     * [KO] `MAIN` 단계의 컴퓨트 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a compute pass for the `MAIN` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addMainComputePass('MainCullingCompute', (pass) => {
     *     pass.setPipeline(cullingPipeline);
     *     pass.dispatchWorkgroups(16, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] 컴퓨트 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the compute pass
     * @param executor -
     * [KO] 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands
     */
    addMainComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.MAIN, labelOrDescriptor, executor);
    }

    /**
     * [KO] `POST_PROCESS` 단계의 렌더 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a render pass for the `POST_PROCESS` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addPostProcessRenderPass(postRenderPassDescriptor, (pass) => {
     *     pass.setPipeline(postProcessPipeline);
     *     pass.draw(6);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] 렌더 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands
     */
    addPostProcessRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.POST_PROCESS, descriptor, executor);
    }

    /**
     * [KO] `POST_PROCESS` 단계의 컴퓨트 패스를 추가하고 실행합니다.
     * [EN] Adds and executes a compute pass for the `POST_PROCESS` phase.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.addPostProcessComputePass('BloomCompute', (pass) => {
     *     pass.setPipeline(bloomComputePipeline);
     *     pass.dispatchWorkgroups(width / 16, height / 16, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] 컴퓨트 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the compute pass
     * @param executor -
     * [KO] 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands
     */
    addPostProcessComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.POST_PROCESS, labelOrDescriptor, executor);
    }

    /**
     * [KO] 특정 단계의 커맨드 인코더를 직접 참조하여 복사 등의 명령을 기록합니다.
     * [EN] Directly accesses the command encoder of a specific phase to record commands such as resource copies.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
     *     encoder.copyBufferToBuffer(srcBuffer, 0, dstBuffer, 0, bufferSize);
     * });
     * ```
     *
     * @param type -
     * [KO] 사용할 커맨드 인코더 단계 타입
     * [EN] Command encoder phase type to use
     * @param executor -
     * [KO] 커맨드 인코더(`GPUCommandEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the command encoder (`GPUCommandEncoder`) to record commands
     */
    useEncoder(type: CommandEncoderType, executor: (encoder: GPUCommandEncoder) => void): void {
        const encoder = this.#getEncoder(type);
        this.#incrementStat(type, 'rawUsages');
        executor(encoder);
    }

    /**
     * [KO] 독립된 커맨드 인코더로 렌더 패스를 즉시 실행하고 GPU 제출 완료까지 대기합니다.
     * [EN] Immediately executes a render pass with an independent command encoder and awaits GPU submission completion.
     *
     * ### Example
     * ```typescript
     * await context.commandEncoderManager.immediateRenderPass(descriptor, (pass) => {
     *     pass.draw(3);
     * });
     * ```
     *
     * @param descriptor -
     * [KO] 렌더 패스 디스크립터
     * [EN] Render pass descriptor
     * @param executor -
     * [KO] 렌더 패스 인코더(`GPURenderPassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the render pass encoder (`GPURenderPassEncoder`) to record commands
     * @param afterExecutor -
     * [KO] 패스 종료 후 제출 전에 커맨드 인코더를 제어할 선택적 콜백 함수
     * [EN] Optional callback function to control the command encoder after the pass ends and before submission
     */
    async immediateRenderPass(
        descriptor: GPURenderPassDescriptor,
        executor: (pass: GPURenderPassEncoder) => void,
        afterExecutor?: (encoder: GPUCommandEncoder) => void
    ): Promise<void> {
        const label = descriptor.label || 'RedGPU_Immediate_Render_Encoder';
        await this.#submitImmediate(label, (encoder) => {
            const pass = encoder.beginRenderPass(descriptor);
            executor(pass)
            pass.end();
            if (afterExecutor) afterExecutor(encoder);
        }, 'Immediate Submitted Render Pass');
    }

    /**
     * [KO] 독립된 커맨드 인코더로 컴퓨트 패스를 즉시 실행하고 GPU 제출 완료까지 대기합니다.
     * [EN] Immediately executes a compute pass with an independent command encoder and awaits GPU submission completion.
     *
     * ### Example
     * ```typescript
     * await context.commandEncoderManager.immediateComputePass('ImmediateMipmapGen', (pass) => {
     *     pass.setPipeline(mipmapPipeline);
     *     pass.dispatchWorkgroups(1, 1, 1);
     * });
     * ```
     *
     * @param labelOrDescriptor -
     * [KO] 컴퓨트 패스의 레이블 또는 디스크립터 객체
     * [EN] Label or descriptor object for the compute pass
     * @param executor -
     * [KO] 컴퓨트 패스 인코더(`GPUComputePassEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the compute pass encoder (`GPUComputePassEncoder`) to record commands
     * @param afterExecutor -
     * [KO] 패스 종료 후 제출 전에 커맨드 인코더를 제어할 선택적 콜백 함수
     * [EN] Optional callback function to control the command encoder after the pass ends and before submission
     */
    async immediateComputePass(
        labelOrDescriptor: ComputePassDescriptorInput,
        executor: (pass: GPUComputePassEncoder) => void,
        afterExecutor?: (encoder: GPUCommandEncoder) => void
    ): Promise<void> {
        const descriptor = this.#checkDescriptor(labelOrDescriptor);
        const label = descriptor.label || 'RedGPU_Immediate_Compute_Encoder';
        await this.#submitImmediate(label, (encoder) => {
            const pass = encoder.beginComputePass(descriptor);
            executor(pass);
            pass.end();
            if (afterExecutor) afterExecutor(encoder);
        }, 'Immediate Submitted Compute Pass');
    }

    /**
     * [KO] 독립된 커맨드 인코더로 명령을 즉시 제출하고 GPU 작업 완료까지 대기합니다.
     * [EN] Immediately submits commands with an independent command encoder and awaits GPU work completion.
     *
     * ### Example
     * ```typescript
     * await context.commandEncoderManager.immediateSubmit('InitializeBuffer', (encoder) => {
     *     encoder.copyTextureToBuffer(srcTexture, srcLayout, dstBuffer, dstLayout, copySize);
     * });
     * ```
     *
     * @param label -
     * [KO] 생성할 커맨드 인코더의 레이블
     * [EN] Label of the command encoder to create
     * @param executor -
     * [KO] 커맨드 인코더(`GPUCommandEncoder`)를 받아 명령을 기록할 콜백 함수
     * [EN] Callback function that receives the command encoder (`GPUCommandEncoder`) to record commands
     */
    async immediateSubmit(
        label: string,
        executor: (encoder: GPUCommandEncoder) => void
    ): Promise<void> {
        await this.#submitImmediate(label, executor, 'Immediate Submitted Commands');
    }

    /**
     * [KO] 특정 단계의 모든 인코더를 종료하고 큐에 즉시 제출합니다.
     * [EN] Finishes all encoders for the specified phase and immediately submits them to the queue.
     *
     * ### Example
     * ```typescript
     * const stats = context.commandEncoderManager.submit(COMMAND_ENCODER_TYPE.RESOURCE);
     * ```
     *
     * @param type -
     * [KO] 제출할 커맨드 인코더 단계 타입
     * [EN] Command encoder phase type to submit
     * @returns
     * [KO] 제출된 단계의 통계 정보 (제출된 버퍼가 없으면 `null`)
     * [EN] Statistics for the submitted phase (`null` if no buffers were submitted)
     */
    submit(type: CommandEncoderType): CommandPhaseStats | null {
        if (this.#isPassActive[type]) {
            throw new Error(`[RedGPU] Cannot submit ${type} phase while a pass is still active.`);
        }
        const buffers = this.#finish(type);
        if (buffers.length > 0) {
            this.gpuDevice.queue.submit(buffers);
            const logData = this.#createPhaseStats(type, buffers.length);
            console.log(`🚀 [CommandEncoderManager] Submitted ${type} Phase`, logData);
            this.#resetStat(type);
            this.#processDeferredDestroys();
            return logData;
        }
        this.#processDeferredDestroys();
        return null;
    }

    /**
     * [KO] 모든 단계(`RESOURCE` -> `PRE_PROCESS` -> `MAIN` -> `POST_PROCESS`)의 인코더를 순서대로 종료하고 일괄 제출합니다.
     * [EN] Finishes encoders across all phases (`RESOURCE` -> `PRE_PROCESS` -> `MAIN` -> `POST_PROCESS`) in order and submits them in a single batch.
     *
     * ### Example
     * ```typescript
     * const batchStats = context.commandEncoderManager.submitAll();
     * ```
     *
     * @returns
     * [KO] 전체 일괄 제출 통계 정보 (제출된 버퍼나 지연 파괴 리소스가 없으면 `null`)
     * [EN] Batch submission statistics (`null` if no buffers were submitted and no deferred resources were destroyed)
     */
    submitAll(): CommandBatchStats | null {
        const allBuffers: GPUCommandBuffer[] = [];
        const phases: Record<string, CommandPhaseStats> = {};

        const order = [
            COMMAND_ENCODER_TYPE.RESOURCE,
            COMMAND_ENCODER_TYPE.PRE_PROCESS,
            COMMAND_ENCODER_TYPE.MAIN,
            COMMAND_ENCODER_TYPE.POST_PROCESS
        ] as const;

        order.forEach(type => {
            if (this.#isPassActive[type]) {
                throw new Error(`[RedGPU] Cannot submit ${type} phase while a pass is still active.`);
            }
            const buffers = this.#finish(type);
            allBuffers.push(...buffers);
            phases[type] = this.#createPhaseStats(type, buffers.length);
            this.#resetStat(type);
        });

        if (allBuffers.length > 0) {
            this.gpuDevice.queue.submit(allBuffers);
            const deferredDestroyCount = this.#processDeferredDestroys();
            const batchStats: CommandBatchStats = {phases, deferredDestroyCount};
            console.log(`🚀 [CommandEncoderManager] Batch Submitted ${allBuffers.length} Command Buffer(s)`, batchStats);
            return batchStats;
        }
        const deferredDestroyCount = this.#processDeferredDestroys();
        if (deferredDestroyCount > 0) {
            return {phases, deferredDestroyCount};
        }
        return null;
    }

    /**
     * [KO] 모든 인코더 상태와 통계를 초기화하고 등록된 지연 파괴 리소스를 정리합니다.
     * [EN] Resets all encoder states and statistics, and processes registered deferred destroy resources.
     *
     * ### Example
     * ```typescript
     * context.commandEncoderManager.resetAll();
     * ```
     */
    resetAll(): void {
        this.#encoderMap.clear();
        this.#stats.clear();
        this.#processDeferredDestroys();
        Object.keys(this.#isPassActive).forEach(key => {
            delete this.#isPassActive[key as CommandEncoderType];
        });
    }

    /**
     * [KO] CommandEncoderManager 인스턴스를 파기하고 모든 커맨드 인코더 및 지연 파괴 리소스 참조를 정리합니다.
     * [EN] Destroys the CommandEncoderManager instance and cleans up all command encoder and deferred destroy resource references.
     */
    destroy(): void {
        this.resetAll();
        this.#deferredDestroyList.length = 0;
        keepLog("🧹 CommandEncoderManager destroy 완료");
    }

    #processDeferredDestroys(): number {
        const len = this.#deferredDestroyList.length;
        if (len > 0) {
            let i = 0;
            for (i; i < len; i++) {
                try {
                    this.#deferredDestroyList[i].destroy();
                } catch (e) {
                    console.warn("⚠️ 지연 자원 소멸 실패:", e);
                }
            }
            this.#deferredDestroyList.length = 0;
        }
        return len;
    }

    async #submitImmediate(label: string, executor: (encoder: GPUCommandEncoder) => void, logTag: string): Promise<void> {
        const {gpuDevice} = this
        const encoder = gpuDevice.createCommandEncoder({label});
        executor(encoder);
        const buffer = encoder.finish();
        gpuDevice.queue.submit([buffer]);
        await gpuDevice.queue.onSubmittedWorkDone();
        console.log(`🚀 [CommandEncoderManager] ${logTag}`, {label});
    }

    #getEncoder(type: CommandEncoderType): GPUCommandEncoder {
        if (!this.#encoderMap.has(type)) {
            this.#encoderMap.set(type, []);
        }

        const list = this.#encoderMap.get(type)!;

        if (list.length === 0 || this.#isPassActive[type]) {
            const newEncoder = this.gpuDevice.createCommandEncoder({
                label: `RedGPU_${type}_Encoder_${list.length}`
            });
            list.push(newEncoder);
            return newEncoder;
        }

        return list[list.length - 1];
    }

    #addRenderPass(
        type: CommandEncoderType,
        descriptor: GPURenderPassDescriptor,
        executor: (pass: GPURenderPassEncoder) => void
    ): void {
        const encoder = this.#getEncoder(type);
        this.#incrementStat(type, 'renderPasses', descriptor.label);
        this.#isPassActive[type] = true;
        try {
            const pass = encoder.beginRenderPass(descriptor);
            executor(pass);
            pass.end();
        } finally {
            this.#isPassActive[type] = false;
        }
    }

    #addComputePass(
        type: CommandEncoderType,
        labelOrDescriptor: ComputePassDescriptorInput,
        executor: (pass: GPUComputePassEncoder) => void
    ): void {
        const encoder = this.#getEncoder(type);
        const descriptor = this.#checkDescriptor(labelOrDescriptor);
        this.#incrementStat(type, 'computePasses', descriptor.label);
        this.#isPassActive[type] = true;
        try {
            const pass = encoder.beginComputePass(descriptor)
            executor(pass);
            pass.end();
        } finally {
            this.#isPassActive[type] = false;
        }
    }

    #checkDescriptor = (labelOrDescriptor: ComputePassDescriptorInput): GPUComputePassDescriptor => {
        return typeof labelOrDescriptor === 'string' ? {label: labelOrDescriptor} : labelOrDescriptor
    }

    #createPhaseStats(type: CommandEncoderType, buffersLength: number): CommandPhaseStats {
        const stat = this.#stats.get(type) || {renderPasses: [], computePasses: [], rawUsages: 0};
        return {
            'Phase': type,
            'Command Buffers': buffersLength,
            'Render Passes': {
                count: stat.renderPasses.length,
                list: stat.renderPasses
            },
            'Compute Passes': {
                count: stat.computePasses.length,
                list: stat.computePasses
            },
            'Raw Usages': stat.rawUsages
        };
    }

    #incrementStat(type: CommandEncoderType, key: 'renderPasses' | 'computePasses' | 'rawUsages', label?: string) {
        if (!this.#stats.has(type)) {
            this.#stats.set(type, {renderPasses: [], computePasses: [], rawUsages: 0});
        }
        const stat = this.#stats.get(type)!;
        if (key === 'rawUsages') {
            stat.rawUsages++;
        } else {
            stat[key].push(label || 'unlabeled');
        }
    }

    #resetStat(type: CommandEncoderType) {
        this.#stats.set(type, {renderPasses: [], computePasses: [], rawUsages: 0});
    }

    #finish(type: CommandEncoderType): GPUCommandBuffer[] {
        const list = this.#encoderMap.get(type);
        if (list && list.length > 0) {
            const buffers = list.map(encoder => encoder.finish());
            this.#encoderMap.set(type, []);
            delete this.#isPassActive[type];
            return buffers;
        }
        return [];
    }
}

export default CommandEncoderManager;

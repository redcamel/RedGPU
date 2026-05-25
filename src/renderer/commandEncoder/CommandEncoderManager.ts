import RedGPUContext from "../../context/RedGPUContext";
import {COMMAND_ENCODER_TYPE, CommandEncoderType} from "./COMMAND_ENCODER_TYPE";
import {keepLog} from "../../utils";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] 단계별 통계 상세 정보 인터페이스
 * [EN] Detailed statistics per phase
 */
export interface CommandPhaseStats {
    'Phase'?: CommandEncoderType;
    'Command Buffers': number;
    'Render Passes': {
        count: number;
        list: string[];
    };
    'Compute Passes': {
        count: number;
        list: string[];
    };
    'Raw Usages': number;
}

/**
 * [KO] 일괄 제출 통계 정보 인터페이스
 * [EN] Batch submission statistics
 */
export interface CommandBatchStats {
    phases: Record<string, CommandPhaseStats>;
    deferredDestroyCount: number;
}

/**
 * [KO] Compute 패스 디스크립터 입력을 위한 타입 (레이블 문자열 또는 전체 디스크립터 객체)
 * [EN] Type for compute pass descriptor input (label string or full descriptor object)
 */
export type ComputePassDescriptorInput = string | GPUComputePassDescriptor;

/**
 * [KO] GPU 커맨드 인코더 및 패스의 생명주기를 지능적으로 관리하는 클래스입니다.
 * [EN] Class that intelligently manages the lifecycle of GPU command encoders and passes.
 *
 * [KO] 기본적으로 단계별로 하나의 인코더를 공유하여 효율을 높이지만,
 *      패스가 열려있는 상태에서 중첩 호출이 발생하면 자동으로 새로운 인코더를 생성하여 안전성을 보장합니다.
 * [EN] Basically increases efficiency by sharing one encoder per phase,
 *      but automatically creates a new encoder when nested calls occur while a pass is open to ensure safety.
 *
 * @category Renderer
 */
class CommandEncoderManager extends RedGPUObject {

    /** [KO] 타입별 활성화된 인코더 리스트 [EN] List of active encoders per type */
    readonly #encoderMap: Map<CommandEncoderType, GPUCommandEncoder[]> = new Map();
    /** [KO] 타입별 현재 패스 활성화 여부 [EN] Whether a pass is currently active per type */
    readonly #isPassActive: Partial<Record<CommandEncoderType, boolean>> = {};
    /** [KO] 타입별 통계 데이터 [EN] Statistics per type */
    readonly #stats: Map<CommandEncoderType, {
        renderPasses: string[],
        computePasses: string[],
        rawUsages: number
    }> = new Map();
    /** [KO] 지연 파괴될 리소스 리스트 [EN] List of resources to be destroyed lazily */
    readonly #deferredDestroyList: { destroy(): void }[] = [];

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 모든 커맨드 제출 후 안전한 시점에 파괴할 리소스를 등록합니다.
     * [EN] Registers a resource to be destroyed at a safe time after all commands are submitted.
     */
    addDeferredDestroy(resource: { destroy(): void }): void {
        this.#deferredDestroyList.push(resource);
    }

    /**
     * [KO] RESOURCE 단계의 Render 패스를 추가합니다.
     */
    addResourceRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.RESOURCE, descriptor, executor);
    }

    /**
     * [KO] RESOURCE 단계의 Compute 패스를 추가합니다.
     */
    addResourceComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.RESOURCE, labelOrDescriptor, executor);
    }

    /**
     * [KO] PRE_PROCESS 단계의 Render 패스를 추가합니다.
     */
    addPreProcessRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.PRE_PROCESS, descriptor, executor);
    }

    /**
     * [KO] PRE_PROCESS 단계의 Compute 패스를 추가합니다.
     */
    addPreProcessComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.PRE_PROCESS, labelOrDescriptor, executor);
    }

    /**
     * [KO] MAIN 단계의 Render 패스를 추가합니다.
     */
    addMainRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.MAIN, descriptor, executor);
    }

    /**
     * [KO] MAIN 단계의 Compute 패스를 추가합니다.
     */
    addMainComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.MAIN, labelOrDescriptor, executor);
    }

    /**
     * [KO] POST_PROCESS 단계의 Render 패스를 추가합니다.
     */
    addPostProcessRenderPass(descriptor: GPURenderPassDescriptor, executor: (pass: GPURenderPassEncoder) => void): void {
        this.#addRenderPass(COMMAND_ENCODER_TYPE.POST_PROCESS, descriptor, executor);
    }

    /**
     * [KO] POST_PROCESS 단계의 Compute 패스를 추가합니다.
     */
    addPostProcessComputePass(labelOrDescriptor: ComputePassDescriptorInput, executor: (pass: GPUComputePassEncoder) => void): void {
        this.#addComputePass(COMMAND_ENCODER_TYPE.POST_PROCESS, labelOrDescriptor, executor);
    }

    /**
     * [KO] 특정 타입의 인코더를 직접 사용합니다 (복사 명령 등).
     * [EN] Directly uses an encoder of a specific type (e.g., for copy commands).
     */
    useEncoder(type: CommandEncoderType, executor: (encoder: GPUCommandEncoder) => void): void {
        const encoder = this.#getEncoder(type);
        this.#incrementStat(type, 'rawUsages');
        executor(encoder);
    }

    /**
     * [KO] 즉시 실행 Render 패스를 사용합니다. 호출 즉시 패스가 종료되고 서밋됩니다.
     * [EN] Uses an immediate Render pass. The pass is finished and submitted immediately upon call.
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
     * [KO] 즉시 실행 Compute 패스를 사용합니다. 호출 즉시 패스가 종료되고 서밋됩니다.
     * [EN] Uses an immediate Compute pass. The pass is finished and submitted immediately upon call.
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
     * [KO] 즉시 실행 인코더를 사용합니다. 호출 즉시 서밋되고 완료를 기다립니다.
     * [EN] Uses an immediate encoder. It is submitted immediately and awaits completion.
     */
    async immediateSubmit(
        label: string,
        executor: (encoder: GPUCommandEncoder) => void
    ): Promise<void> {
        await this.#submitImmediate(label, executor, 'Immediate Submitted Commands');
    }

    /**
     * [KO] 특정 타입의 모든 인코더를 종료하고 즉시 서밋합니다.
     * [EN] Finishes all encoders for the specific type and submits them immediately.
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
     * [KO] 모든 타입의 인코더를 한꺼번에 종료하고 단 한 번의 호출로 서밋합니다. (성능 최적화용)
     * [EN] Finishes encoders of all types and submits them in a single call. (For performance optimization)
     */
    submitAll(): CommandBatchStats | null {
        const allBuffers: GPUCommandBuffer[] = [];
        const phases: Record<string, CommandPhaseStats> = {};

        // [KO] 실행 순서 보장: RESOURCE -> PRE_PROCESS -> MAIN -> POST_PROCESS
        // [EN] Ensure execution order: RESOURCE -> PRE_PROCESS -> MAIN -> POST_PROCESS
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
     * [KO] 모든 인코더 초기화
     * [EN] Reset all encoders
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
     * [KO] 등록된 모든 지연 파괴 리소스를 파괴합니다.
     * [EN] Destroys all registered deferred destroy resources.
     */
    #processDeferredDestroys(): number {
        const len = this.#deferredDestroyList.length;
        if (len > 0) {
            let i = 0;
            for (i; i < len; i++) {
                keepLog(this.#deferredDestroyList[i])
                this.#deferredDestroyList[i].destroy();
            }
            this.#deferredDestroyList.length = 0;
            // console.log(`🗑️ [CommandEncoderManager] Destroyed ${len} deferred resource(s)`);
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

    /**
     * [KO] 사용 가능한 인코더를 반환합니다. 필요한 경우 자동으로 추가 생성합니다.
     */
    #getEncoder(type: CommandEncoderType): GPUCommandEncoder {
        if (!this.#encoderMap.has(type)) {
            this.#encoderMap.set(type, []);
        }

        const list = this.#encoderMap.get(type)!;

        // [KO] 리스트가 비어있거나, 마지막 인코더가 이미 패스를 기록 중이면 새 인코더 생성
        // [EN] Create a new encoder if the list is empty or the last encoder is already recording a pass
        if (list.length === 0 || this.#isPassActive[type]) {
            const newEncoder = this.gpuDevice.createCommandEncoder({
                label: `RedGPU_${type}_Encoder_${list.length}`
            });
            list.push(newEncoder);
            return newEncoder;
        }

        return list[list.length - 1];
    }

    /**
     * [KO] Render 패스를 추가하고 실행하는 내부 공통 메서드
     */
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

    /**
     * [KO] Compute 패스를 추가하고 실행하는 내부 공통 메서드
     */
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

    /**
     * [KO] 특정 타입의 모든 인코더 종료 및 커맨드 버퍼 배열 반환
     */
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

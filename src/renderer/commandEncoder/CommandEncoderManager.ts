import RedGPUContext from "../../context/RedGPUContext";
import { COMMAND_ENCODER_TYPE, CommandEncoderType } from "./COMMAND_ENCODER_TYPE";
import { keepLog } from "../../utils";

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
class CommandEncoderManager {
    readonly #redGPUContext: RedGPUContext;
    /** [KO] 타입별 활성화된 인코더 리스트 [EN] List of active encoders per type */
    readonly #encoderMap: Map<CommandEncoderType, GPUCommandEncoder[]> = new Map();
    /** [KO] 타입별 현재 패스 활성화 여부 [EN] Whether a pass is currently active per type */
    readonly #isPassActive: Partial<Record<CommandEncoderType, boolean>> = {};

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

    /**
     * [KO] RESOURCE 단계의 패스를 추가합니다.
     */
    addResourcePass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.RESOURCE, labelOrDescriptor, callback);
    }

    /**
     * [KO] PRE_COMPUTE 단계의 패스를 추가합니다.
     */
    addPreComputePass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.PRE_COMPUTE, labelOrDescriptor, callback);
    }

    /**
     * [KO] MAIN 단계의 패스를 추가합니다.
     */
    addMainPass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.MAIN, labelOrDescriptor, callback);
    }

    /**
     * [KO] POST_PROCESS 단계의 패스를 추가합니다.
     */
    addPostProcessPass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.POST_PROCESS, labelOrDescriptor, callback);
    }

    /**
     * [KO] 특정 타입의 인코더를 직접 사용합니다 (복사 명령 등).
     * [EN] Directly uses an encoder of a specific type (e.g., for copy commands).
     */
    useEncoder(type: CommandEncoderType, callback: (encoder: GPUCommandEncoder) => void): void {
        const encoder = this.#getEncoder(type);
        callback(encoder);
    }

    /**
     * [KO] PRE_COMPUTE 단계의 인코더를 직접 사용합니다.
     */
    usePreComputeEncoder(callback: (encoder: GPUCommandEncoder) => void): void {
        this.useEncoder(COMMAND_ENCODER_TYPE.PRE_COMPUTE, callback);
    }

    /**
     * [KO] MAIN 단계의 인코더를 직접 사용합니다.
     */
    useMainEncoder(callback: (encoder: GPUCommandEncoder) => void): void {
        this.useEncoder(COMMAND_ENCODER_TYPE.MAIN, callback);
    }

    /**
     * [KO] POST_PROCESS 단계의 인코더를 직접 사용합니다.
     */
    usePostProcessEncoder(callback: (encoder: GPUCommandEncoder) => void): void {
        this.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, callback);
    }

    /**
     * [KO] 특정 타입의 모든 인코더를 종료하고 즉시 서밋합니다.
     * [EN] Finishes all encoders for the specific type and submits them immediately.
     */
    submit(type: CommandEncoderType): void {
        if (this.#isPassActive[type]) {
            throw new Error(`[RedGPU] Cannot submit ${type} phase while a pass is still active.`);
        }
        const buffers = this.#finish(type);
        if (buffers.length > 0) {
            this.#redGPUContext.gpuDevice.queue.submit(buffers);
            keepLog(`🚀 [CommandEncoderManager] Submitted ${buffers.length} command buffer(s) for ${type} phase.`);
        }
    }

    /**
     * [KO] 모든 타입의 인코더를 한꺼번에 종료하고 단 한 번의 호출로 서밋합니다. (성능 최적화용)
     * [EN] Finishes encoders of all types and submits them in a single call. (For performance optimization)
     */
    submitAll(): void {
        const allBuffers: GPUCommandBuffer[] = [];
        const submittedTypes: string[] = [];

        // [KO] 실행 순서 보장: RESOURCE -> PRE_COMPUTE -> MAIN -> POST_PROCESS
        // [EN] Ensure execution order: RESOURCE -> PRE_COMPUTE -> MAIN -> POST_PROCESS
        const order = [
            COMMAND_ENCODER_TYPE.RESOURCE,
            COMMAND_ENCODER_TYPE.PRE_COMPUTE,
            COMMAND_ENCODER_TYPE.MAIN,
            COMMAND_ENCODER_TYPE.POST_PROCESS
        ];

        order.forEach(type => {
            if (this.#isPassActive[type]) {
                throw new Error(`[RedGPU] Cannot submit ${type} phase while a pass is still active.`);
            }
            const buffers = this.#finish(type);
            if (buffers.length > 0) {
                allBuffers.push(...buffers);
                submittedTypes.push(`${type}(${buffers.length})`);
            }
        });

        if (allBuffers.length > 0) {
            this.#redGPUContext.gpuDevice.queue.submit(allBuffers);
            keepLog(`🚀 [CommandEncoderManager] Batch Submitted ${allBuffers.length} command buffer(s): [${submittedTypes.join(', ')}]`);
        }
    }

    /**
     * [KO] 모든 인코더 초기화
     * [EN] Reset all encoders
     */
    resetAll(): void {
        this.#encoderMap.clear();
        Object.keys(this.#isPassActive).forEach(key => {
            delete this.#isPassActive[key as CommandEncoderType];
        });
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
            const newEncoder = this.#redGPUContext.gpuDevice.createCommandEncoder({
                label: `RedGPU_${type}_Encoder_${list.length}`
            });
            list.push(newEncoder);
            return newEncoder;
        }

        return list[list.length - 1];
    }

    /**
     * [KO] 패스를 추가하고 실행하는 내부 공통 메서드
     */
    #addPass(
        type: CommandEncoderType,
        labelOrDescriptor: string | GPURenderPassDescriptor,
        callback: (pass: any) => void
    ): void {
        const encoder = this.#getEncoder(type);
        
        // [KO] 현재 인코더의 패스 활성화 상태 표시
        this.#isPassActive[type] = true;

        try {
            if (typeof labelOrDescriptor === 'string') {
                const pass = encoder.beginComputePass({ label: labelOrDescriptor });
                callback(pass);
                pass.end();
            } else {
                const pass = encoder.beginRenderPass(labelOrDescriptor);
                callback(pass);
                pass.end();
            }
        } finally {
            this.#isPassActive[type] = false;
        }
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

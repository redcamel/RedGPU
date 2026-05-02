import RedGPUContext from "../../context/RedGPUContext";
import { COMMAND_ENCODER_TYPE, CommandEncoderType } from "./COMMAND_ENCODER_TYPE";

/**
 * [KO] GPU 커맨드 인코더 및 패스의 생명주기를 통합 관리하는 클래스입니다.
 * [EN] Class that integrates and manages the lifecycle of GPU command encoders and passes.
 * 
 * [KO] 각 Phase(RESOURCE, PRE_COMPUTE, MAIN, POST_PROCESS) 전용 메서드를 통해 
 *      타입 지정 없이도 안전하고 명시적으로 패스를 구성할 수 있습니다.
 * [EN] Through methods dedicated to each phase, passes can be configured safely and explicitly 
 *      without specifying types.
 * 
 * @category Renderer
 */
class CommandEncoderManager {
    readonly #redGPUContext: RedGPUContext;
    /** [KO] 타입별 현재 활성화된 엔코더 [EN] Currently active encoder per type */
    readonly #encoders: Partial<Record<CommandEncoderType, GPUCommandEncoder>> = {};

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

    /**
     * [KO] 특정 타입의 엔코더를 반환합니다. 이미 존재할 경우 기존 것을 공유합니다.
     * [EN] Returns an encoder for a specific type. Shares the existing one if it already exists.
     * 
     * @param type - [KO] 엔코더 타입 [EN] Encoder type
     */
    getEncoder(type: CommandEncoderType): GPUCommandEncoder {
        if (!this.#encoders[type]) {
            this.#encoders[type] = this.#redGPUContext.gpuDevice.createCommandEncoder({
                label: `RedGPU_${type}_Encoder`
            });
        }
        return this.#encoders[type]!;
    }

    /**
     * [KO] RESOURCE 단계의 패스를 추가합니다. (Compute/Render 모두 수용)
     * [EN] Adds a pass in the RESOURCE phase. (Accepts both Compute/Render)
     */
    addResourcePass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.RESOURCE, labelOrDescriptor, callback);
    }

    /**
     * [KO] PRE_COMPUTE 단계의 패스를 추가합니다. (Compute/Render 모두 수용)
     * [EN] Adds a pass in the PRE_COMPUTE phase. (Accepts both Compute/Render)
     */
    addPreComputePass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.PRE_COMPUTE, labelOrDescriptor, callback);
    }

    /**
     * [KO] MAIN 단계의 패스를 추가합니다. (Compute/Render 모두 수용)
     * [EN] Adds a pass in the MAIN phase. (Accepts both Compute/Render)
     */
    addMainPass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.MAIN, labelOrDescriptor, callback);
    }

    /**
     * [KO] POST_PROCESS 단계의 패스를 추가합니다. (Compute/Render 모두 수용)
     * [EN] Adds a pass in the POST_PROCESS phase. (Accepts both Compute/Render)
     */
    addPostProcessPass(labelOrDescriptor: string | GPURenderPassDescriptor, callback: (pass: any) => void): void {
        this.#addPass(COMMAND_ENCODER_TYPE.POST_PROCESS, labelOrDescriptor, callback);
    }

    /**
     * [KO] 패스를 추가하고 실행하는 내부 공통 메서드입니다.
     * [EN] Internal common method to add and execute a pass.
     */
    #addPass(
        type: CommandEncoderType,
        labelOrDescriptor: string | GPURenderPassDescriptor,
        callback: (pass: any) => void
    ): void {
        const encoder = this.getEncoder(type);
        if (typeof labelOrDescriptor === 'string') {
            const pass = encoder.beginComputePass({ label: labelOrDescriptor });
            callback(pass);
            pass.end();
        } else {
            const pass = encoder.beginRenderPass(labelOrDescriptor);
            callback(pass);
            pass.end();
        }
    }

    /**
     * [KO] 특정 타입의 엔코더를 종료하고 커맨드 버퍼를 반환합니다.
     * [EN] Finishes the encoder for the specific type and returns the command buffer.
     * 
     * @param type - [KO] 엔코더 타입 [EN] Encoder type
     */
    finish(type: CommandEncoderType): GPUCommandBuffer | null {
        const encoder = this.#encoders[type];
        if (encoder) {
            const commandBuffer = encoder.finish();
            delete this.#encoders[type];
            return commandBuffer;
        }
        return null;
    }

    /**
     * [KO] 특정 타입의 엔코더를 종료하고 즉시 서밋합니다.
     * [EN] Finishes the encoder for the specific type and submits it immediately.
     * 
     * @param type - [KO] 엔코더 타입 [EN] Encoder type
     */
    submit(type: CommandEncoderType): void {
        const buffer = this.finish(type);
        if (buffer) {
            this.#redGPUContext.gpuDevice.queue.submit([buffer]);
        }
    }

    /**
     * [KO] 관리 중인 모든 인코더를 초기화합니다.
     * [EN] Resets all managed encoders.
     */
    resetAll(): void {
        for (const key in this.#encoders) {
            delete this.#encoders[key as CommandEncoderType];
        }
    }
}

export default CommandEncoderManager;

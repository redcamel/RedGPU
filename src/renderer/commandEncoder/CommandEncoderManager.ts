import RedGPUContext from "../../context/RedGPUContext";
import { COMMAND_ENCODER_TYPE, CommandEncoderType } from "./COMMAND_ENCODER_TYPE";

/**
 * [KO] GPU 커맨드 인코더를 렌더링 단계(Phase)별로 전역 관리하는 클래스입니다.
 * [EN] Class that globally manages GPU command encoders by rendering phase.
 * 
 * [KO] 하이브리드 서밋(Hybrid Submission)을 지원하며, 뷰 구분 없이 동일한 단계의 명령을 하나의 엔코더에 통합하여 효율을 높입니다.
 * [EN] Supports Hybrid Submission and increases efficiency by integrating commands of the same phase into a single encoder regardless of the view.
 * 
 * @category Renderer
 */
class CommandEncoderManager {
    readonly #redGPUContext: RedGPUContext;
    readonly #encoders: Partial<Record<CommandEncoderType, GPUCommandEncoder>> = {};

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
    }

    /**
     * [KO] 특정 타입(단계)에 해당하는 엔코더를 반환합니다. 없을 경우 새로 생성합니다.
     * [EN] Returns the encoder for the specific type (phase). Creates a new one if it doesn't exist.
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
     * [KO] 특정 타입의 엔코더를 즉시 종료하고 서밋합니다. (하이브리드 서밋 용)
     * [EN] Immediately finishes and submits the encoder for the specific type. (For Hybrid Submission)
     * 
     * @param type - [KO] 엔코더 타입 [EN] Encoder type
     */
    submit(type: CommandEncoderType): void {
        const commandBuffer = this.finish(type);
        if (commandBuffer) {
            this.#redGPUContext.gpuDevice.queue.submit([commandBuffer]);
        }
    }

    /**
     * [KO] 현재 프레임에서 관리 중인 모든 엔코더 상태를 초기화합니다.
     * [EN] Resets all encoder states being managed in the current frame.
     */
    resetAll(): void {
        for (const key in this.#encoders) {
            delete this.#encoders[key as CommandEncoderType];
        }
    }
}

export default CommandEncoderManager;

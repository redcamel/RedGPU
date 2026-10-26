/**
 * [KO] GPU 커맨드 인코더의 실행 단계(Phase) 타입을 정의하는 상수 객체입니다.
 * [EN] Constant object defining the execution phase types of GPU command encoders.
 *
 * @category CommandEncoderManager
 */
export declare const COMMAND_ENCODER_TYPE: {
    /**
     * [KO] 리소스 처리 단계 (버퍼 쓰기, 텍스처/버퍼 복사 등)
     * [EN] Resource processing phase (buffer write, texture/buffer copy, etc.)
     */
    readonly RESOURCE: "RESOURCE";
    /**
     * [KO] 전처리 단계 (G-Buffer 렌더링, 섀도우 맵 생성, 물리 시뮬레이션 등)
     * [EN] Pre-processing phase (G-Buffer rendering, shadow map generation, physics simulation, etc.)
     */
    readonly PRE_PROCESS: "PRE_PROCESS";
    /**
     * [KO] 메인 렌더링 단계 (메인 씬 드로우 등)
     * [EN] Main rendering phase (main scene draw, etc.)
     */
    readonly MAIN: "MAIN";
    /**
     * [KO] 후처리 단계 (블러, 톤매핑 등 포스트 프로세싱 효과 적용)
     * [EN] Post-processing phase (applying post-processing effects such as blur and tonemapping)
     */
    readonly POST_PROCESS: "POST_PROCESS";
    /**
     * [KO] 즉시 제출 단계 (독립된 커맨드 인코더로 즉시 큐에 제출)
     * [EN] Immediate submission phase (immediately submitted to the queue with an independent command encoder)
     */
    readonly IMMEDIATE: "IMMEDIATE";
};
/**
 * [KO] GPU 커맨드 인코더의 실행 단계 유니온 타입입니다.
 * [EN] Union type representing the execution phases of GPU command encoders.
 *
 * @category CommandEncoderManager
 */
export type CommandEncoderType = typeof COMMAND_ENCODER_TYPE[keyof typeof COMMAND_ENCODER_TYPE];

/**
 * [KO] GPU 커맨드 인코더의 타입을 정의하는 상수 객체입니다.
 * [EN] Constant object defining the types of GPU command encoders.
 * @category CommandEncoderManager
 */
export declare const COMMAND_ENCODER_TYPE: {
    /**
     * [KO] 리소스 처리 단계 (예: 복사, 데이터 쓰기 등)
     * [EN] Resource processing phase (e.g., copy, write buffer)
     */
    readonly RESOURCE: "RESOURCE";
    /**
     * [KO] 전처리 단계 (예: G-Buffer 렌더링, 섀도 맵 렌더링, 물리 시뮬레이션 등)
     * [EN] Pre-processing phase (e.g., G-Buffer rendering, shadow map rendering, physics simulation)
     */
    readonly PRE_PROCESS: "PRE_PROCESS";
    /**
     * [KO] 메인 렌더링 단계 (메인 씬 드로우 등)
     * [EN] Main rendering phase (main scene draw, etc.)
     */
    readonly MAIN: "MAIN";
    /**
     * [KO] 후처리 단계 (블러, 톤맵 등 포스트 프로세싱 효과 적용)
     * [EN] Post-processing phase (apply post-processing effects like blur, tonemapping)
     */
    readonly POST_PROCESS: "POST_PROCESS";
};
/**
 * [KO] GPU 커맨드 인코더의 타입 정의입니다.
 * [EN] Type definition for GPU command encoders.
 * @category CommandEncoderManager
 */
export type CommandEncoderType = typeof COMMAND_ENCODER_TYPE[keyof typeof COMMAND_ENCODER_TYPE];

/**
 * [KO] GPU 커맨드 인코더의 타입을 정의하는 상수 객체입니다.
 * [EN] Constant object defining the types of GPU command encoders.
 * @category CommandEncoderManager
 */
export const COMMAND_ENCODER_TYPE = {
    RESOURCE: 'RESOURCE',
    PRE_PROCESS: 'PRE_PROCESS',
    MAIN: 'MAIN',
    POST_PROCESS: 'POST_PROCESS',
} as const;

/**
 * [KO] GPU 커맨드 인코더의 타입 정의입니다.
 * [EN] Type definition for GPU command encoders.
 * @category CommandEncoderManager
 */
export type CommandEncoderType = typeof COMMAND_ENCODER_TYPE[keyof typeof COMMAND_ENCODER_TYPE];

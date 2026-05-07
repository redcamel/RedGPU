/**
 * G-Buffer 타입 상수 정의
 */
export const GBUFFER_TYPE = {
    COLOR: 'gBufferColor',
    NORMAL: 'gBufferNormal',
    MOTION_VECTOR: 'gBufferMotionVector'
} as const;

/**
 * G-Buffer 타입 별칭
 */
export type GBUFFER_TYPE = typeof GBUFFER_TYPE[keyof typeof GBUFFER_TYPE];

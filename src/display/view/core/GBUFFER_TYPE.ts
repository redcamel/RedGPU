/**
 * G-Buffer 타입 상수 정의
 */
 const GBUFFER_TYPE = {
    COLOR: 'gBufferColor',
    NORMAL: 'gBufferNormal',
    MOTION_VECTOR: 'gBufferMotionVector',
    RENDER_PATH1_RESULT: 'renderPath1ResultTexture'
} as const;

type GBUFFER_TYPE = typeof GBUFFER_TYPE[keyof typeof GBUFFER_TYPE];
Object.freeze(GBUFFER_TYPE)
export default GBUFFER_TYPE



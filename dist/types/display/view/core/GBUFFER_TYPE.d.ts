/**
 * [KO] G-Buffer 텍스처 타입 상수 모음입니다.
 * [EN] Collection of G-Buffer texture type constants.
 */
declare const GBUFFER_TYPE: {
    /**
     * [KO] 컬러 (알베도) 버퍼
     * [EN] Color (Albedo) buffer
     */
    readonly COLOR: "gBufferColor";
    /**
     * [KO] 법선 (노멀) 버퍼
     * [EN] Normal buffer
     */
    readonly NORMAL: "gBufferNormal";
    /**
     * [KO] 모션 벡터 버퍼
     * [EN] Motion vector buffer
     */
    readonly MOTION_VECTOR: "gBufferMotionVector";
    /**
     * [KO] 렌더 패스 1 단계 결과 버퍼
     * [EN] Render Path 1 stage result buffer
     */
    readonly RENDER_PATH1_RESULT: "renderPath1ResultTexture";
};
/**
 * [KO] GBUFFER_TYPE의 타입 정의
 * [EN] Type definition of GBUFFER_TYPE
 */
type GBUFFER_TYPE = typeof GBUFFER_TYPE[keyof typeof GBUFFER_TYPE];
export default GBUFFER_TYPE;

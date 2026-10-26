/**
 * [KO] 렌더링 파이프라인에서 카메라를 기준으로 앞면(Front) 또는 뒷면(Back) 폴리곤을 렌더링에서 제외(Culling)할지 결정하는 상수입니다.
 * [EN] Constants determining whether to cull front or back-facing polygons relative to the camera in a render pipeline.
 *
 * @category Constants
 */
const GPU_CULL_MODE = {
    /**
     * [KO] 면 컬링을 수행하지 않고 양면을 모두 렌더링합니다.
     * [EN] Performs no face culling and renders both sides.
     */
    NONE: 'none',
    /**
     * [KO] 앞면(Front Face)을 컬링하여 뒷면만 렌더링합니다.
     * [EN] Culls front faces, rendering only back faces.
     */
    FRONT: 'front',
    /**
     * [KO] 뒷면(Back Face)을 컬링하여 앞면만 렌더링합니다.
     * [EN] Culls back faces, rendering only front faces.
     */
    BACK: 'back',
} as const;
Object.freeze(GPU_CULL_MODE);
export default GPU_CULL_MODE;
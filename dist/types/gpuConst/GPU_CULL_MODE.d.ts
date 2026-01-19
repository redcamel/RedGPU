/**
 * [KO] 렌더링 시 제외할 면(컬링)을 정의하는 상수군입니다.
 * [EN] Constants defining which faces to cull during rendering.
 *
 * [KO] 카메라를 기준으로 앞면 혹은 뒷면을 렌더링에서 제외할지 결정합니다.
 * [EN] Determines whether to exclude front or back faces from rendering relative to the camera.
 *
 * @category Constants
 */
declare const GPU_CULL_MODE: {
    /**
     * [KO] 컬링을 수행하지 않습니다.
     * [EN] Does not perform any culling.
     */
    readonly NONE: "none";
    /**
     * [KO] 앞면을 컬링하여 뒷면만 렌더링합니다.
     * [EN] Culls front faces, rendering only back faces.
     */
    readonly FRONT: "front";
    /**
     * [KO] 뒷면을 컬링하여 앞면만 렌더링합니다. (일반적인 설정)
     * [EN] Culls back faces, rendering only front faces. (Standard setting)
     */
    readonly BACK: "back";
};
export default GPU_CULL_MODE;

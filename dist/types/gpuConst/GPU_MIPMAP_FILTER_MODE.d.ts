/**
 * [KO] 밉맵 레벨 간 샘플링 시의 필터링 모드 옵션을 정의하는 상수군입니다.
 * [EN] Constants defining filtering mode options for sampling between mipmap levels.
 *
 * [KO] 텍스처의 밉맵 레벨 사이를 어떻게 보간할지 결정합니다.
 * [EN] Determines how to interpolate between mipmap levels of a texture.
 *
 * @category Constants
 */
declare const GPU_MIPMAP_FILTER_MODE: {
    /**
     * [KO] 가장 가까운 밉맵 레벨에서 샘플링합니다.
     * [EN] Samples from the nearest mipmap level.
     */
    readonly NEAREST: "nearest";
    /**
     * [KO] 인접한 두 밉맵 레벨 사이를 선형 보간합니다.
     * [EN] Linearly interpolates between two adjacent mipmap levels.
     */
    readonly LINEAR: "linear";
};
export default GPU_MIPMAP_FILTER_MODE;

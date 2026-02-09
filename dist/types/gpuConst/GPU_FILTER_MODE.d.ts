/**
 * [KO] 텍스처 샘플링 시의 필터링 모드 옵션을 정의하는 상수군입니다.
 * [EN] Constants defining filtering mode options for texture sampling.
 *
 * [KO] 텍스처 확대 및 축소 시 픽셀 간 보간 방식을 결정합니다.
 * [EN] Determines the interpolation method between pixels during texture magnification and minification.
 *
 * @category Constants
 */
declare const GPU_FILTER_MODE: {
    /**
     * [KO] 가장 가까운 텍셀의 값을 사용합니다.
     * [EN] Uses the value of the nearest texel.
     */
    readonly NEAREST: "nearest";
    /**
     * [KO] 주변 텍셀 값들을 선형 보간하여 사용합니다.
     * [EN] Uses linear interpolation of surrounding texel values.
     */
    readonly LINEAR: "linear";
};
export default GPU_FILTER_MODE;

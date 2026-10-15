/**
 * [KO] 텍스처 확대(Magnification) 및 축소(Minification) 샘플링 시 픽셀 간 보간 방식을 정의하는 필터 모드 상수입니다.
 * [EN] Filter mode constants defining the pixel interpolation method during texture magnification and minification sampling.
 *
 * @category Constants
 */
const GPU_FILTER_MODE = {
    /**
     * [KO] 샘플링 좌표에서 가장 가까운 단일 텍셀(Texel)의 값을 그대로 반환합니다.
     * [EN] Returns the value of the single texel nearest to the sampling coordinates.
     */
    NEAREST: 'nearest',
    /**
     * [KO] 샘플링 좌표 주변의 인접 텍셀 값들을 선형 보간(Bilinear Interpolation)하여 반환합니다.
     * [EN] Linearly interpolates the values of adjacent texels surrounding the sampling coordinates.
     */
    LINEAR: 'linear'
} as const;
Object.freeze(GPU_FILTER_MODE);
export default GPU_FILTER_MODE;
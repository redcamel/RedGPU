/**
 * [KO] 주어진 텍스처의 width, height에 대해 생성 가능한 mipmap 레벨의 개수를 계산합니다.
 * [EN] Calculates the number of mipmap levels that can be generated for a given texture width and height.
 *
 * [KO] width, height 중 더 큰 값을 기준으로 log2를 취해, 1을 더한 값을 반환합니다. (예: 256x128 텍스처는 9레벨, 1x1 텍스처는 1레벨)
 * [EN] Returns log2 of the larger of width and height plus 1. (e.g., 256x128 texture yields 9 levels, 1x1 yields 1 level)
 *
 * @category Texture
 * @param width
 * [KO] 텍스처의 가로 크기 (픽셀)
 * [EN] Texture width (pixels)
 * @param height
 * [KO] 텍스처의 세로 크기 (픽셀)
 * [EN] Texture height (pixels)
 * @returns
 * [KO] 생성 가능한 mipmap 레벨의 개수
 * [EN] Number of generateable mipmap levels
 */
const getMipLevelCount = (width: number, height: number): number => {
    return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
export default getMipLevelCount
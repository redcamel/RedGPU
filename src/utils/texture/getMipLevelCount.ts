import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";

/**
 * [KO] 주어진 해상도에 대해 생성 가능한 최대 Mipmap 레벨 수를 계산합니다.
 * [EN] Calculates the maximum number of Mipmap levels for a given resolution.
 *
 * ### Example
 * ```typescript
 * // [KO] 1024x1024 해상도의 Mipmap 레벨 수 계산
 * // [EN] Calculate Mipmap level count for 1024x1024 resolution
 * const levels = RedGPU.Util.getMipLevelCount(1024, 1024); // 11
 * ```
 *
 * @param width -
 * [KO] 텍스처 가로 크기 (픽셀 단위)
 * [EN] Texture width in pixels
 * @param height -
 * [KO] 텍스처 세로 크기 (픽셀 단위)
 * [EN] Texture height in pixels
 * @returns
 * [KO] 계산된 Mipmap 레벨 수
 * [EN] Calculated number of Mipmap levels
 * @category Texture
 */
const getMipLevelCount = (width: number, height: number): number => {
    validateUintRange(width)
    validateUintRange(height)
    return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
export default getMipLevelCount

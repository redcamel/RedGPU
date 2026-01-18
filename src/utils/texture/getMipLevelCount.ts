/**
 * [KO] 주어진 크기에 대해 생성 가능한 mipmap 레벨의 개수를 계산합니다.
 * [EN] Calculates the number of mipmap levels that can be generated for a given size.
 *
 * * ### Example
 * ```typescript
 * const levels = getMipLevelCount(1024, 1024); // 11
 * ```
 *
 * @param width
 * [KO] 가로 크기 (픽셀)
 * [EN] Width (pixels)
 * @param height
 * [KO] 세로 크기 (픽셀)
 * [EN] Height (pixels)
 *
 * @returns
 * [KO] 생성 가능한 mipmap 레벨 개수
 * [EN] Number of mipmap levels
 *
 * @category Texture
 */
const getMipLevelCount = (width: number, height: number): number => {
    return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
export default getMipLevelCount
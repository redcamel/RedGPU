/**
 * [KO] 주어진 해상도에 대해 생성 가능한 최대 Mipmap 레벨 수를 계산합니다.
 * [EN] Calculates the maximum number of Mipmap levels for a given resolution.
 *
 * * ### Example
 * ```typescript
 * const levels = RedGPU.Util.getMipLevelCount(1024, 1024); // 11
 * ```
 *
 * @param width - [KO] 가로 크기 [EN] Width
 * @param height - [KO] 세로 크기 [EN] Height
 * @returns [KO] Mipmap 레벨 수 [EN] Number of Mipmap levels
 * @category Texture
 */
const getMipLevelCount = (width: number, height: number): number => {
    return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
export default getMipLevelCount

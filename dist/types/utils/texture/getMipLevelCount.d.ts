/**
 * [KO] 주어진 크기에 대해 생성 가능한 mipmap 레벨 개수를 계산합니다.
 * [EN] Calculates the number of mipmap levels for a given size.
 *
 * * ### Example
 * ```typescript
 * const levels = RedGPU.Util.getMipLevelCount(1024, 1024); // 11
 * ```
 *
 * @param width -
 * [KO] 가로 크기
 * [EN] Width
 * @param height -
 * [KO] 세로 크기
 * [EN] Height
 * @returns
 * [KO] 생성 가능한 mipmap 레벨 개수
 * [EN] Number of mipmap levels
 * @category Texture
 */
declare const getMipLevelCount: (width: number, height: number) => number;
export default getMipLevelCount;

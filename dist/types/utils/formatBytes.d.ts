/**
 * [KO] 바이트 값을 1024 단위 기준의 읽기 쉬운 문자열(Bytes, KB, MB, GB)로 변환합니다.
 * [EN] Converts a byte value into a human-readable string (Bytes, KB, MB, GB) based on 1024 units.
 *
 * ### Example
 * ```typescript
 * // [KO] '1 MB' 반환
 * // [EN] Returns '1 MB'
 * const readable = RedGPU.Util.formatBytes(1048576);
 * ```
 *
 * @param bytes -
 * [KO] 변환할 바이트 값 (0 이상의 정수)
 * [EN] Byte value to convert (non-negative integer)
 * @param decimals -
 * [KO] 소수점 자릿수 (기본값: 2, 음수는 0으로 처리)
 * [EN] Number of decimal places (Default: 2, negative values are treated as 0)
 * @returns
 * [KO] 단위가 포함된 변환 문자열
 * [EN] Converted string including the unit
 * @throws
 * [KO] `bytes`가 0 이상의 정수가 아닌 경우
 * [EN] If `bytes` is not a non-negative integer
 * @category Utility
 */
declare const formatBytes: (bytes: number, decimals?: number) => string;
export default formatBytes;

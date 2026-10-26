import consoleAndThrowError from "./consoleAndThrowError";

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
const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (typeof bytes !== 'number' || bytes < 0 || Number.isNaN(bytes) || !Number.isInteger(bytes)) {
        consoleAndThrowError("Invalid input: 'bytes' must be a positive integer.");
    }
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export default formatBytes

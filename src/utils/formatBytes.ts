import consoleAndThrowError from "./consoleAndThrowError";

/**
 * [KO] 바이트 단위를 사람이 읽기 쉬운 문자열로 변환합니다.
 * [EN] Converts byte units to a human-readable string.
 *
 * * ### Example
 * ```typescript
 * const readable = RedGPU.Util.formatBytes(1048576); // '1.00 MB'
 * ```
 *
 * @param bytes -
 * [KO] 변환할 바이트 값
 * [EN] Byte value to convert
 * @param decimals -
 * [KO] 소수점 자릿수 (기본값: 2)
 * [EN] Number of decimal places (Default: 2)
 * @returns
 * [KO] 변환된 바이트 문자열 (예: '1.23 MB')
 * [EN] Converted byte string (e.g., '1.23 MB')
 * @throws
 * [KO] bytes가 유효한 uint가 아닐 경우 Error 발생
 * [EN] Throws Error if bytes is not a valid uint
 * @category Math
 */
const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (typeof bytes !== 'number' || bytes < 0 || Number.isNaN(bytes) || !Number.isInteger(bytes)) {
        consoleAndThrowError("Invalid input: 'bytes' must be a uint");
    }
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export default formatBytes
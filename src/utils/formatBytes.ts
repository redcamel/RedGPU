import consoleAndThrowError from "./consoleAndThrowError";

/**
 * [KO] 바이트 단위를 읽기 쉬운 문자열(KB, MB, GB 등)로 변환합니다.
 * [EN] Converts bytes to a human-readable string (KB, MB, GB, etc.).
 *
 * * ### Example
 * ```typescript
 * const readable = RedGPU.Util.formatBytes(1048576); // '1.00 MB'
 * ```
 *
 * @param bytes - [KO] 변환할 바이트 값 [EN] Byte value to convert
 * @param decimals - [KO] 소수점 자릿수 (기본값: 2) [EN] Number of decimal places (Default: 2)
 * @returns [KO] 변환된 문자열 [EN] Converted string
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

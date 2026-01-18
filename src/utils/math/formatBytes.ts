import consoleAndThrowError from "../consoleAndThrowError";

/**
 * [KO] 바이트 단위를 사람이 읽기 쉬운 문자열로 변환합니다.
 * [EN] Converts byte units to a human-readable string.
 *
 * [KO] 입력된 바이트 수를 KB, MB, GB 등으로 변환하며 소수점 자릿수를 지정할 수 있습니다.
 * [EN] Converts input bytes to KB, MB, GB, etc., with a specified number of decimal places.
 *
 * * ### Example
 * ```typescript
 * const readable = formatBytes(1048576); // '1.00 MB'
 * ```
 *
 * @param bytes
 * [KO] 변환할 바이트 값
 * [EN] Byte value to convert
 * @param [decimals=2]
 * [KO] 소수점 자릿수
 * [EN] Number of decimal places
 *
 * @returns
 * [KO] 변환된 바이트 문자열 (예: '1.23 MB')
 * [EN] Converted byte string (e.g., '1.23 MB')
 *
 * @throws
 * [KO] bytes가 유효한 양의 정수가 아니면 예외 발생
 * [EN] Throws Error if bytes is not a valid positive integer
 *
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
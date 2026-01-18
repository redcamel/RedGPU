import consoleAndThrowError from "../consoleAndThrowError";

/**
 * [KO] 바이트(byte) 단위를 사람이 읽기 쉬운 문자열로 변환합니다.
 * [EN] Converts byte units to a human-readable string.
 *
 * [KO] 입력된 바이트 수를 KB, MB, GB 등으로 변환하여 반환합니다. 소수점 자릿수는 decimals로 지정할 수 있습니다. 음수, NaN, 정수가 아닌 값 입력 시 예외를 발생시킵니다.
 * [EN] Converts input bytes to KB, MB, GB, etc. The number of decimal places can be specified with decimals. Throws an exception for negative, NaN, or non-integer inputs.
 *
 * @param bytes
 * [KO] 변환할 바이트(byte) 값
 * [EN] Byte value to convert
 * @param decimals
 * [KO] 소수점 자릿수(기본값: 2)
 * [EN] Number of decimal places (default: 2)
 * @returns
 * [KO] 변환된 바이트 문자열 (예: '1.23 MB')
 * [EN] Converted byte string (e.g., '1.23 MB')
 * @throws
 * [KO] bytes가 0 미만이거나 정수가 아니면 예외 발생
 * [EN] Throws an exception if bytes is less than 0 or not an integer
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
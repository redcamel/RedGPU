/**
 * 바이트(byte) 단위를 사람이 읽기 쉬운 문자열로 변환합니다.
 *
 * 입력된 바이트 수를 KB, MB, GB 등으로 변환하여 반환합니다. 소수점 자릿수는 decimals로 지정할 수 있습니다.
 *
 * 음수, NaN, 정수가 아닌 값 입력 시 예외를 발생시킵니다.
 *
 * @param {number} bytes 변환할 바이트(byte) 값
 * @param {number} [decimals=2] 소수점 자릿수(기본값: 2)
 * @returns {string} 변환된 바이트 문자열 (예: '1.23 MB')
 * @throws {Error} bytes가 0 미만이거나 정수가 아니면 예외 발생
 */
declare const formatBytes: (bytes: number, decimals?: number) => string;
export default formatBytes;

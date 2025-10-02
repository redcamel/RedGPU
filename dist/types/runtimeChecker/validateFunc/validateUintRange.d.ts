/**
 * 주어진 값이 부호 없는 정수(unsigned integer) 범위 내에 있는지 검증합니다.
 *
 * value, min, max가 모두 0 이상의 정수(Uint)인지 확인하며,
 *
 * min이 max보다 크거나 같으면 예외를 발생시킵니다.
 *
 * value가 min보다 작거나 max보다 크면 예외를 발생시킵니다.
 *
 * @param {number} value 검증할 값
 * @param {number} [min=0] 허용되는 최소값 (기본값: 0)
 * @param {number} [max=4503599627370496] 허용되는 최대값 (기본값: 4503599627370496)
 * @returns {boolean} 값이 Uint 범위 내에 있으면 true
 * @throws {Error} 값 또는 범위가 Uint가 아니거나, 범위를 벗어나면 예외 발생
 */
declare const validateUintRange: (value: number, min?: number, max?: number) => boolean;
export default validateUintRange;

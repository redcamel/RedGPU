/**
 * 주어진 값이 0 이상의 양의 숫자이며, 지정한 범위 내에 있는지 검증합니다.
 *
 * value, minRange, maxRange가 모두 number 타입인지 확인하며,
 *
 * minRange와 value가 0 미만이 아니고, value가 minRange 이상 maxRange 이하인지 검사합니다.
 *
 * 조건을 만족하지 않으면 예외를 발생시킵니다.
 *
 * @param {number} value 검증할 값
 * @param {number} [minRange=0] 허용되는 최소값 (기본값: 0)
 * @param {number} [maxRange=Number.MAX_VALUE] 허용되는 최대값 (기본값: Number.MAX_VALUE)
 * @returns {boolean} 값이 범위 내의 양의 숫자이면 true
 * @throws {Error} 값이 숫자가 아니거나, 0 미만이거나, 범위를 벗어나면 예외 발생
 */
declare const validatePositiveNumberRange: (value: number, minRange?: number, maxRange?: number) => boolean;
export default validatePositiveNumberRange;

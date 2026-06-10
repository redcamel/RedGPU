/**
 * [KO] 주어진 값이 0 이상의 양수이며 지정된 범위 내에 있는지 검증합니다.
 * [EN] Validates if the given value is a positive number within the specified range.
 *
 * [KO] 값이 0 미만이거나 지정된 범위를 벗어날 경우 예외를 발생시킵니다.
 * [EN] Throws an exception if the value is less than 0 or out of range.
 *
 * * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 0, 100);
 * ```
 *
 * @param value -
 * [KO] 검증할 숫자 값
 * [EN] Value to validate
 * @param minRange -
 * [KO] 허용되는 최소값 (0 이상, 기본값: 0)
 * [EN] Minimum allowed value (>= 0, default: 0)
 * @param maxRange -
 * [KO] 허용되는 최대값 (기본값: Number.MAX_VALUE)
 * [EN] Maximum allowed value (default: Number.MAX_VALUE)
 * @returns
 * [KO] 범위 내의 양수이면 true
 * [EN] True if the value is a positive number within range
 * @throws
 * [KO] 입력값이 숫자가 아니거나, 0 미만이거나, 범위를 벗어날 경우 Error 발생
 * [EN] Throws Error if inputs are not numbers, negative, or the value is out of range
 * @category Validation
 */
declare const validatePositiveNumberRange: (value: number, minRange?: number, maxRange?: number) => boolean;
export default validatePositiveNumberRange;

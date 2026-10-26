/**
 * [KO] 값이 [minRange, maxRange] 범위 내의 숫자인지 검증하며, 실패 시 예외를 발생시킵니다.
 * [EN] Validates that the value is a number within [minRange, maxRange] and throws an exception on failure.
 *
 * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100);
 * ```
 *
 * @param value -
 * [KO] 검증할 숫자 값
 * [EN] Numeric value to validate
 * @param minRange -
 * [KO] 허용 최소값 (기본값: -Number.MAX_VALUE)
 * [EN] Minimum allowed value (default: -Number.MAX_VALUE)
 * @param maxRange -
 * [KO] 허용 최대값 (기본값: Number.MAX_VALUE)
 * [EN] Maximum allowed value (default: Number.MAX_VALUE)
 * @returns
 * [KO] 범위 내의 숫자이면 true
 * [EN] True if the value is within range
 * @throws
 * [KO] 인자가 숫자가 아니거나 NaN, 또는 값이 범위를 벗어난 경우 Error 발생
 * [EN] Throws Error if any argument is not a number or NaN, or the value is out of range
 * @category Validation
 */
declare const validateNumberRange: (value: number, minRange?: number, maxRange?: number) => boolean;
export default validateNumberRange;

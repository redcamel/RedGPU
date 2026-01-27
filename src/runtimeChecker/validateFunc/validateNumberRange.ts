import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * [KO] 주어진 값이 지정된 범위 내의 숫자인지 검증합니다.
 * [EN] Validates if the given value is a number within the specified range.
 *
 * [KO] 값이 지정된 최소/최대값 범위를 벗어나거나 숫자가 아니면 예외를 발생시킵니다.
 * [EN] Throws an exception if the value is out of range or not a number.
 *
 * * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100);
 * ```
 *
 * @param value - 
 * [KO] 검증할 숫자 값 
 * [EN] Value to validate
 * @param minRange - 
 * [KO] 허용되는 최소값 (기본값: -Number.MAX_VALUE) 
 * [EN] Minimum allowed value (default: -Number.MAX_VALUE)
 * @param maxRange - 
 * [KO] 허용되는 최대값 (기본값: Number.MAX_VALUE) 
 * [EN] Maximum allowed value (default: Number.MAX_VALUE)
 * @returns 
 * [KO] 범위 내의 숫자이면 true 
 * [EN] True if the value is a number within range
 * @throws 
 * [KO] 입력값이 숫자가 아니거나 범위를 벗어날 경우 Error 발생 
 * [EN] Throws Error if inputs are not numbers or the value is out of range
 * @category Validation
 */
const validateNumberRange = (value: number, minRange: number = -Number.MAX_VALUE, maxRange: number = Number.MAX_VALUE): boolean => {
    if (typeof value !== 'number') consoleAndThrowError('Only numbers allowed.');
    if (typeof minRange !== 'number') consoleAndThrowError('Only numbers allowed.');
    if (typeof maxRange !== 'number') consoleAndThrowError('Only numbers allowed.');
    if (value < minRange || value > maxRange) consoleAndThrowError(`Only numbers within the range of [${minRange}, ${maxRange}] are allowed. input : ${value}`);
    return true
}
export default validateNumberRange;
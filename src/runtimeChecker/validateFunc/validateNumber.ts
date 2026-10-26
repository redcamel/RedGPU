import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * [KO] 값이 NaN이 아닌 number 타입인지 검증하며, 실패 시 예외를 발생시킵니다.
 * [EN] Validates that the value is a non-NaN number and throws an exception on failure.
 *
 * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateNumber(123);
 * ```
 *
 * @param value -
 * [KO] 검증할 값
 * [EN] Value to validate
 * @returns
 * [KO] 유효한 숫자이면 true
 * [EN] True if the value is a valid number
 * @throws
 * [KO] number 타입이 아니거나 NaN인 경우 Error 발생
 * [EN] Throws Error if the value is not a number or is NaN
 * @category Validation
 */
const validateNumber = (value: number): boolean => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        consoleAndThrowError('Only numbers allowed.')
        return false
    }
    return true
}
export default validateNumber;
import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * [KO] 주어진 값이 숫자(Number) 타입인지 검증합니다.
 * [EN] Validates if the given value is a number type.
 *
 * [KO] 값이 number 타입이 아니면 예외를 발생시킵니다.
 * [EN] Throws an exception if the value is not a number type.
 *
 * * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateNumber(123);
 * ```
 *
 * @param value - 
 * [KO] 검증할 값 
 * [EN] Value to validate
 * @returns 
 * [KO] 값이 숫자이면 true 
 * [EN] True if the value is a number
 * @throws 
 * [KO] 값이 숫자가 아닐 경우 Error 발생 
 * [EN] Throws Error if the value is not a number
 * @category Validation
 */
const validateNumber = (value: number): boolean => {
    if (typeof value !== 'number') {
        consoleAndThrowError('Only numbers allowed.')
        return false
    }
    return true
}
export default validateNumber;
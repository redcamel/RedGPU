/**
 * [KO] 값이 0 이상의 정수(Unsigned Integer)인지 검사합니다.
 * [EN] Checks whether the value is an integer greater than or equal to 0 (unsigned integer).
 *
 * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.isUint(10); // true
 * RedGPU.RuntimeChecker.isUint(-1); // false
 * ```
 *
 * @param value -
 * [KO] 검사할 숫자 값
 * [EN] Numeric value to check
 * @returns
 * [KO] 부호 없는 정수이면 true, 아니면 false
 * [EN] True if the value is an unsigned integer, otherwise false
 * @category Checker
 */
const isUint = (value: number): boolean => {
    const passInteger = Number.isInteger(value)
    const passNaturalNumber = value >= 0
    return passInteger && passNaturalNumber
}
export default isUint;
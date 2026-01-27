/**
 * [KO] 주어진 값이 부호 없는 정수(Unsigned Integer)인지 검사합니다.
 * [EN] Checks if the given value is an unsigned integer.
 *
 * [KO] 0 이상의 정수이면 true를 반환합니다.
 * [EN] Returns true if the value is an integer greater than or equal to 0.
 *
 * * ### Example
 * ```typescript
 * const isValid = RedGPU.RuntimeChecker.isUint(10);
 * ```
 *
 * @param value -
 * [KO] 검사할 숫자 값
 * [EN] Value to check
 * @returns
 * [KO] 부호 없는 정수이면 true, 아니면 false
 * [EN] True if it is an unsigned integer, otherwise false
 * @category Checker
 */
declare const isUint: (value: number) => boolean;
export default isUint;

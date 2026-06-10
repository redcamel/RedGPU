/**
 * [KO] 주어진 값이 부호 없는 정수(Uint) 범위 내에 있는지 검증합니다.
 * [EN] Validates if the given value is an unsigned integer (Uint) within the specified range.
 *
 * [KO] 입력값들이 정수가 아니거나, 지정된 최소/최대 범위를 벗어날 경우 예외를 발생시킵니다.
 * [EN] Throws an exception if inputs are not integers or out of the specified range.
 *
 * * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateUintRange(10, 0, 100);
 * ```
 *
 * @param value -
 * [KO] 검증할 숫자 값
 * [EN] Value to validate
 * @param min -
 * [KO] 허용되는 최소 Uint 값 (기본값: 0)
 * [EN] Minimum allowed Uint value (default: 0)
 * @param max -
 * [KO] 허용되는 최대 Uint 값 (기본값: 4503599627370496)
 * [EN] Maximum allowed Uint value (default: 4503599627370496)
 * @returns
 * [KO] 범위 내의 Uint이면 true
 * [EN] True if the value is a Uint within range
 * @throws
 * [KO] 값 또는 범위가 Uint가 아니거나, 범위를 벗어날 경우 Error 발생
 * [EN] Throws Error if values/range are not Uint or out of range
 * @category Validation
 */
declare const validateUintRange: (value: number, min?: number, max?: number) => boolean;
export default validateUintRange;

import consoleAndThrowError from "../../utils/consoleAndThrowError";
import isUint from "../isFunc/isUint";

const MAX_UINT = 4503599627370496
/**
 * [KO] 값이 [min, max] 범위 내의 부호 없는 정수(Uint)인지 검증하며, 실패 시 예외를 발생시킵니다.
 * [EN] Validates that the value is an unsigned integer (Uint) within [min, max] and throws an exception on failure.
 *
 * [KO] min과 max 역시 Uint여야 하며, min은 max보다 작아야 합니다.
 * [EN] min and max must also be Uint values, and min must be less than max.
 *
 * ### Example
 * ```typescript
 * RedGPU.RuntimeChecker.validateUintRange(10, 0, 100);
 * ```
 *
 * @param value -
 * [KO] 검증할 숫자 값
 * [EN] Numeric value to validate
 * @param min -
 * [KO] 허용 최소 Uint 값 (기본값: 0)
 * [EN] Minimum allowed Uint value (default: 0)
 * @param max -
 * [KO] 허용 최대 Uint 값 (기본값: 4503599627370496)
 * [EN] Maximum allowed Uint value (default: 4503599627370496)
 * @returns
 * [KO] 범위 내의 Uint이면 true
 * [EN] True if the value is a Uint within range
 * @throws
 * [KO] value/min/max가 Uint가 아니거나, min이 max 이상이거나, 값이 범위를 벗어난 경우 Error 발생
 * [EN] Throws Error if value/min/max is not a Uint, min is not less than max, or the value is out of range
 * @category Validation
 */
const validateUintRange = (value: number, min: number = 0, max: number = MAX_UINT): boolean => {
    const passUint = isUint(value)
    const passUintMin = isUint(min)
    const passUintMax = isUint(max)
    const errorStr = `is not Uint! / value : `
    const rangeStr = `(check range : ${min}u ~ ${max}u)`
    if (!passUint) consoleAndThrowError(`value ${errorStr}${value} / ${rangeStr}`)
    if (!passUintMin) consoleAndThrowError(`min ${errorStr}${min} / ${rangeStr}`)
    if (!passUintMax) consoleAndThrowError(`max ${errorStr}${max} / ${rangeStr}`)
    if (min >= max) consoleAndThrowError(`maximum value is bigger than minimum value. / ${rangeStr}`)
    if (min > value) consoleAndThrowError(`value is smaller than minimum value. / value : ${value} / ${rangeStr}`)
    if (max < value) consoleAndThrowError(`value is bigger than maximum value. / value : ${value} / ${rangeStr}`)
    return true
}
export default validateUintRange;
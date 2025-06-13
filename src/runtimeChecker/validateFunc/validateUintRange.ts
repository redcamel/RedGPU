import consoleAndThrowError from "../../utils/consoleAndThrowError";
import isUint from "../isFunc/isUint";

const MAX_UINT = 4503599627370496
/**
 * Validates if a given value falls within a specified range.
 * This function checks if the value is a positive integer and within the specified range.
 * If the value or the range values are not positive integers, an error is thrown.
 * If the maximum value is smaller than the minimum value, an error is thrown.
 * If the value is smaller than the minimum value, an error is thrown.
 * If the value is larger than the maximum value, an error is thrown.
 *
 * @param {number} value - The value to be validated.
 * @param {number} [min=0] - The minimum value of the range.
 * @param {number} [max=Number.MAX_SAFE_INTEGER] - The maximum value of the range.
 * @returns {boolean} - Returns true if the value is within the specified range.
 * @throws {Error} - Throws an error if the value or the range values are not positive integers,
 *                  if the maximum value is smaller than the minimum value,
 *                  if the value is smaller than the minimum value,
 *                  or if the value is larger than the maximum value.
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
export default validateUintRange

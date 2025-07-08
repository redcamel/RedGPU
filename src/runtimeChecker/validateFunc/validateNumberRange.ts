import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * Validates whether a given number is within a specified range.
 *
 * @param {number} value - The number to validate.
 * @param {number} [minRange=0] - The minimum allowable range.
 * @param {number} [maxRange=Number.MAX_VALUE] - The maximum allowable range.
 * @throws {Error} if the value is not a number or if it is outside the specified range.
 */
const validateNumberRange = (value: number, minRange: number = -Number.MAX_VALUE, maxRange: number = Number.MAX_VALUE): boolean => {
	if (typeof value !== 'number') consoleAndThrowError('Only numbers allowed.');
	if (typeof minRange !== 'number') consoleAndThrowError('Only numbers allowed.');
	if (typeof maxRange !== 'number') consoleAndThrowError('Only numbers allowed.');
	if (value < minRange || value > maxRange) consoleAndThrowError(`Only numbers within the range of [${minRange}, ${maxRange}] are allowed. input : ${value}`);
	return true
}
export default validateNumberRange

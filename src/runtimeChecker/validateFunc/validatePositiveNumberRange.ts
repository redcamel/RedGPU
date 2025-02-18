import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * Validates if a number is within a positive range.
 *
 * @param {number} value - The number to validate.
 * @param {number} [minRange=0] - The minimum range allowed. Default is 0.
 * @param {number} [maxRange=Number.MAX_VALUE] - The maximum range allowed. Default is Number.MAX_VALUE.
 * @returns {boolean} - Returns true if the number is within the specified range, otherwise throws an error.
 * @throws {Error} - Throws an error if the value is not a number or if it is outside the specified range.
 */
const validatePositiveNumberRange = (value: number, minRange: number = 0, maxRange: number = Number.MAX_VALUE): boolean => {
    if (typeof value !== 'number') consoleAndThrowError('Only numbers allowed.');
    if (typeof minRange !== 'number') consoleAndThrowError('Only numbers allowed.');
    if (typeof maxRange !== 'number') consoleAndThrowError('Only numbers allowed.');
    if (minRange < 0 || value < 0 || value < minRange || value > maxRange) consoleAndThrowError(`Only numbers within the range of [${minRange}, ${maxRange}] are allowed.`);
    return true
}
export default validatePositiveNumberRange

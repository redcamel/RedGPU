import consoleAndThrowError from "../../utils/consoleAndThrowError";

/**
 * Validates a number value.
 *
 * @param {number} value - The value to be validated.
 * @returns {boolean} - Returns true if the value is a number, false otherwise.
 */
const validateNumber = (value: number): boolean => {
	if (typeof value !== 'number') {
		consoleAndThrowError('Only numbers allowed.')
		return false
	}
	return true
}
export default validateNumber

/**
 * Checks if a given value is an unsigned integer.
 *
 * @param {number} value - The value to be checked.
 * @returns {boolean} - Returns `true` if the value is an unsigned integer, otherwise returns `false`.
 */
const isUint = (value: number): boolean => {
	const passInteger = Number.isInteger(value)
	const passNaturalNumber = value >= 0
	return passInteger && passNaturalNumber
}
export default isUint


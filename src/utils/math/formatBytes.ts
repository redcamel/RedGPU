import consoleAndThrowError from "../consoleAndThrowError";

/**
 * Formats the given number of bytes into a human-readable format.
 *
 * @param {number} bytes - The number of bytes to format.
 * @param {number} [decimals=2] - The number of decimal places to round the result to. Defaults to 2.
 * @returns {string} The formatted string representing the number of bytes.
 * @throws {Error} If 'bytes' is not a positive integer.
 */
const formatBytes = (bytes: number, decimals: number = 2): string => {
	if (typeof bytes !== 'number' || bytes < 0 || Number.isNaN(bytes) || !Number.isInteger(bytes)) {
		consoleAndThrowError("Invalid input: 'bytes' must be a uint");
	}
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export default formatBytes

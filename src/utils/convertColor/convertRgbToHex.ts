import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";

/**
 * Converts RGB values to hexadecimal color code.
 *
 * @param {number} r - The red value (0-255).
 * @param {number} g - The green value (0-255).
 * @param {number} b - The blue value (0-255).
 * @returns {string} The equivalent hexadecimal color code.
 * @throws {Error} If any of the RGB values are invalid.
 */
const convertRgbToHex = (r: number, g: number, b: number): string => {
	validateUintRange(r, 0, 255)
	validateUintRange(g, 0, 255)
	validateUintRange(b, 0, 255)
	const r2 = r.toString(16).padStart(2, '0').toUpperCase();
	const g2 = g.toString(16).padStart(2, '0').toUpperCase();
	const b2 = b.toString(16).padStart(2, '0').toUpperCase();
	return `#${r2}${g2}${b2}`;
}
export default convertRgbToHex

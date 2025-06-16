import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import ColorRGB from "./ColorRGB";

/**
 * Represents a color with red, green, blue, and alpha values.
 * Extends the ColorRGB class.
 */
class ColorRGBA extends ColorRGB {
	#a: number
	readonly #onChange: Function;

	/**
	 * Creates a new instance of the Color class.
	 *
	 * @param {number} [r=255] - The red component of the color. Must be a number between 0 and 255.
	 * @param {number} [g=255] - The green component of the color. Must be a number between 0 and 255.
	 * @param {number} [b=255] - The blue component of the color. Must be a number between 0 and 255.
	 * @param {number} [a=1] - The alpha component of the color. Must be a number between 0 and 1.
	 * @param {Function} [onChange=undefined] - The callback function to be called when the color changes.
	 *
	 */
	constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 1, onChange: Function = undefined) {
		super(r, g, b, onChange)
		validatePositiveNumberRange(a, 0, 1)
		this.#a = a
		if (onChange) this.#onChange = onChange
	}

	get a(): number {
		return this.#a;
	}

	set a(value: number) {
		validatePositiveNumberRange(value, 0, 1);
		this.#a = value;
		this.#onChange?.()
	}

	/**
	 * Get the RGBA values of the color.
	 *
	 * @return {number[]} An array containing the red, green, blue, and alpha values.
	 */
	get rgba(): number[] {
		return [this.r, this.g, this.b, this.#a];
	}

	/**
	 * Returns the normalized RGBA values as an array.
	 *
	 * @returns {number[]} The normalized rgba values.
	 */
	get rgbaNormal(): number[] {
		return [this.r / 255, this.g / 255, this.b / 255, this.#a];
	}

	/**
	 * Sets the color of the object using RGBA values.
	 *
	 * @param {number} r - The red component of the color. Value should be between 0 and 255.
	 * @param {number} g - The green component of the color. Value should be between 0 and 255.
	 * @param {number} b - The blue component of the color. Value should be between 0 and 255.
	 * @param {number} a - The alpha component of the color. Value should be between 0 and 1.
	 * @throws {Error} If the RGBA color value is invalid.
	 */
	setColorByRGBA(r: number, g: number, b: number, a: number) {
		this.#validateRGBA(r, g, b, a)
		this.r = r
		this.g = g
		this.b = b
		this.#a = a;
		this.#onChange?.()
	}

	/**
	 * Sets the color of an object using an RGBA string.
	 *
	 * @param {string} rgbaString - The RGBA color value as a string.
	 * @throws {Error} If the RGBA color value is invalid.
	 */
	setColorByRGBAString(rgbaString: string) {
		const rgbaMatch = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*(?:\.\d+)?)\s*\)/.exec(rgbaString);
		if (!rgbaMatch) throw new Error(`Invalid rgba color value: ${rgbaString}`);
		const [, r, g, b, a] = rgbaMatch.map(Number);
		this.#validateRGBA(r, g, b, a)
		this.r = r;
		this.g = g;
		this.b = b;
		this.#a = a;
		this.#onChange?.()
	}

	/**
	 * Validates the RGBA color values.
	 *
	 * @param {number} r - The red color value (0 - 255).
	 * @param {number} g - The green color value (0 - 255).
	 * @param {number} b - The blue color value (0 - 255).
	 * @param {number} a - The alpha transparency value (0 - 1).
	 *
	 * @throws {Error} When any of the color values are outside the valid range.
	 * @throws {Error} When the alpha value is negative or greater than 1.
	 */
	#validateRGBA(r: number, g: number, b: number, a: number) {
		validateUintRange(r, 0, 255)
		validateUintRange(g, 0, 255)
		validateUintRange(b, 0, 255)
		validatePositiveNumberRange(a, 0, 1);
	}
}

export default ColorRGBA

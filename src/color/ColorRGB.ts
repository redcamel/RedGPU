import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import convertHexToRgb from "../utils/convertColor/convertHexToRgb";
import convertRgbToHex from "../utils/convertColor/convertRgbToHex";

/**
 * Represents an RGB color.
 */
class ColorRGB {
    #r: number
    #g: number
    #b: number
    readonly #onChange: Function;

    /**
     * Creates a new instance of the Color class.
     *
     * @param {number} r - The red component of the RGB color. Defaults to 255.
     * @param {number} g - The green component of the RGB color. Defaults to 255.
     * @param {number} b - The blue component of the RGB color. Defaults to 255.
     * @param {Function} onChange - Optional callback function to be called when the color changes. Defaults to undefined.
     */
    constructor(r: number = 255, g: number = 255, b: number = 255, onChange: Function = undefined) {
        // console.log(r, g, b)
        this.#validateRGB(r, g, b)
        this.#setRGB(r, g, b)
        if (onChange) this.#onChange = onChange
    }

    get r(): number {
        return this.#r;
    }

    set r(value: number) {
        validateUintRange(value, 0, 255)
        this.#r = value;
        this.#onChange?.()
    }

    get g(): number {
        return this.#g;
    }

    set g(value: number) {
        validateUintRange(value, 0, 255)
        this.#g = value;
        this.#onChange?.()
    }

    get b(): number {
        return this.#b;
    }

    set b(value: number) {
        validateUintRange(value, 0, 255)
        this.#b = value;
        this.#onChange?.()
    }

    /**
     * Returns an array containing the RGB values of the color.
     *
     * @return {number[]} An array of numbers representing the RGB values in the format [r, g, b].
     */
    get rgb(): number[] {
        return [this.#r, this.#g, this.#b];
    }

    /**
     * Returns the normalized RGB values as an array.
     *
     * @returns {number[]} An array containing the normalized RGB values.
     */
    get rgbNormal(): number[] {
        return [this.#r / 255, this.#g / 255, this.#b / 255];
    }

    /**
     * Returns the hexadecimal representation of the RGB color.
     *
     * @returns {string} The hexadecimal color value.
     */
    get hex(): string {
        return convertRgbToHex(this.#r, this.#g, this.#b);
    }

    /**
     * Sets the color of the object based on the provided RGB values.
     *
     * @param {number} r - The red value in the range of 0-255.
     * @param {number} g - The green value in the range of 0-255.
     * @param {number} b - The blue value in the range of 0-255.
     *
     */
    setColorByRGB(r: number, g: number, b: number) {
        this.#validateRGB(r, g, b)
        this.#setRGB(r, g, b)
    }

    /**
     * Sets the color of the object using a hexadecimal color code.
     *
     * @param {string | number} hexColor - The hexadecimal color code to set the color with.

     */
    setColorByHEX(hexColor: string | number) {
        const {r, g, b} = convertHexToRgb(hexColor) //TODO 0x000000 되는지 확인해야함
        this.#setRGB(r, g, b)
    }

    /**
     * Sets the color of an object by parsing a string representing an RGB color value.
     *
     * @param {string} rgbString - The string representing the RGB color value in the format "rgb(r, g, b)".
     *
     * @throws {Error} Throws an error if the given rgbString is not a valid RGB color value.
     *
     */
    setColorByRGBString(rgbString: string) {
        const rgbMatch = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(rgbString);
        if (!rgbMatch) consoleAndThrowError(`Invalid rgb color value: ${rgbString}`);
        const [, r, g, b] = rgbMatch.map(Number);
        this.#validateRGB(r, g, b)
        this.#setRGB(r, g, b)
    }

    #setRGB(r: number, g: number, b: number) {
        this.#r = r
        this.#g = g
        this.#b = b
        this.#onChange?.()
    }

    /**
     * Validates the given RGB values.
     *
     * @param {number} r - The red value to validate (0 to 255).
     * @param {number} g - The green value to validate (0 to 255).
     * @param {number} b - The blue value to validate (0 to 255).
     *
     * @throws {Error} If any of the RGB values are not within the range of 0 to 255.
     */
    #validateRGB(r: number, g: number, b: number) {
        validateUintRange(r, 0, 255)
        validateUintRange(g, 0, 255)
        validateUintRange(b, 0, 255)
    }
}

export default ColorRGB

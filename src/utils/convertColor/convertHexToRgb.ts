import isHexColor from "../../runtimeChecker/isFunc/isHexColor";

/**
 * Converts a hex color value to RGB color format.
 *
 * @param {string | number} hex - The hex color value to convert. Could be a string or a number.
 * @param {boolean} returnArrayYn - Whether to return the RGB color as an array or an object. Default is false (returns object).
 * @returns {any} - The RGB color value. If returnArrayYn is true, returns an array [r, g, b]. Otherwise, returns an object {r, g, b}.
 * @throws {Error} - If the input value is not a valid hex color string.
 */
const convertHexToRgb = (hex: string | number, returnArrayYn: boolean = false): any => {
    if (typeof hex === "number") {
        hex = `#${hex.toString(16)}`;
    }
    if (isHexColor(hex)) {
        if (hex.charAt(0) === '#') {
            hex = hex.substring(1);
        }
        if (hex.length === 3) {
            hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
        }
        const hexNumber = parseInt('0x' + hex);
        const r = (hexNumber >> 16) & 255;
        const g = (hexNumber >> 8) & 255;
        const b = hexNumber & 255;
        return returnArrayYn ? [r, g, b] : {r, g, b};
    } else {
        throw Error(`from ${convertHexToRgb.constructor.name}: input value - ${hex} / Only hex string allowed`);
    }
};
export default convertHexToRgb

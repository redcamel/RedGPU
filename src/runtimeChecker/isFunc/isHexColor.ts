/**
 * Checks if a given string represents a valid hex color.
 *
 * @param {string} hex - The string to be checked.
 * @returns {boolean} - A boolean indicating if the string is a valid hex color.
 */
const isHexColor = (hex: string): boolean => {
    const regex = /^([A-Fa-f0-9]{3}){1,2}$/;
    if (hex.startsWith('#')) {
        return regex.test(hex.substring(1));
    } else if (hex.startsWith('0x')) {
        return regex.test(hex.substring(2));
    }
    return false;
}
export default isHexColor

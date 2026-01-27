/**
 * [KO] 주어진 문자열이 유효한 16진수(Hex) 색상 형식인지 검사합니다.
 * [EN] Checks if the given string is a valid hexadecimal (Hex) color format.
 *
 * [KO] '#', '0x' 접두사가 붙은 3자리 또는 6자리 16진수 색상 문자열을 지원합니다.
 * [EN] Supports 3-digit or 6-digit hex color strings with '#' or '0x' prefixes.
 *
 * * ### Example
 * ```typescript
 * const isValid = RedGPU.RuntimeChecker.isHexColor('#FF0000');
 * ```
 *
 * @param hex - 
 * [KO] 검사할 문자열 
 * [EN] String to check
 * @returns 
 * [KO] 유효한 Hex 색상이면 true, 아니면 false 
 * [EN] True if it is a valid hex color, otherwise false
 * @category Checker
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
export default isHexColor;
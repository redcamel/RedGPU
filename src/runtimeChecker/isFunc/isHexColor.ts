/**
 * [KO] 주어진 값이 유효한 16진수(Hex) 색상 형식인지 검사합니다.
 * [EN] Checks if the given value is a valid hexadecimal (Hex) color format.
 *
 * [KO] '#' 접두사가 붙은 3자리 또는 6자리 16진수 색상 문자열 또는 0에서 0xFFFFFF 사이의 정수를 지원합니다.
 * [EN] Supports 3-digit or 6-digit hex color strings with '#' prefix or integers between 0 and 0xFFFFFF.
 *
 * * ### Example
 * ```typescript
 * const isValidStr = RedGPU.RuntimeChecker.isHexColor('#FF0000');
 * const isValidNum = RedGPU.RuntimeChecker.isHexColor(0xFF0000);
 * ```
 *
 * @param hex -
 * [KO] 검사할 값 (문자열 또는 숫자)
 * [EN] Value to check (string or number)
 * @returns
 * [KO] 유효한 Hex 색상이면 true, 아니면 false
 * [EN] True if it is a valid hex color, otherwise false
 * @category Checker
 */
const isHexColor = (hex: any): boolean => {
    if (typeof hex === 'number') {
        return !Number.isNaN(hex) && Number.isInteger(hex) && hex >= 0 && hex <= 0xFFFFFF;
    }
    if (typeof hex !== 'string') return false;
    const regex = /^([A-Fa-f0-9]{3}){1,2}$/;
    if (hex.startsWith('#')) {
        return regex.test(hex.substring(1));
    }
    return false;
}
export default isHexColor;
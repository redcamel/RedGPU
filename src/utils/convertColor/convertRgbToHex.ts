import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";

/**
 * [KO] RGB 값을 16진수(hex) 색상 코드로 변환합니다.
 * [EN] Converts RGB values to a hexadecimal (hex) color code.
 *
 * [KO] 각 채널(r, g, b)이 0~255 범위에 있는지 검증 후, 2자리 16진수 대문자로 변환하여 '#RRGGBB' 형식의 문자열을 반환합니다.
 * [EN] Validates that each channel (r, g, b) is within the 0~255 range, then converts them to 2-digit uppercase hexadecimal values and returns a string in '#RRGGBB' format.
 *
 * @category ConvertColor
 * @param r
 * [KO] 변환할 빨간색(Red) 값 (0~255)
 * [EN] Red value to convert (0~255)
 * @param g
 * [KO] 변환할 초록색(Green) 값 (0~255)
 * [EN] Green value to convert (0~255)
 * @param b
 * [KO] 변환할 파란색(Blue) 값 (0~255)
 * [EN] Blue value to convert (0~255)
 * @returns
 * [KO] 변환된 16진수 색상 코드 (예: '#FF0000')
 * [EN] Converted hexadecimal color code (e.g., '#FF0000')
 * @throws
 * [KO] r, g, b 값이 0~255 범위를 벗어나면 예외 발생
 * [EN] Throws an exception if r, g, b values are out of the 0~255 range
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
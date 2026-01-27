/**
 * [KO] RGB 값을 16진수(Hex) 색상 코드로 변환합니다.
 * [EN] Converts RGB values to a hexadecimal (Hex) color code.
 *
 * [KO] 각 채널(R, G, B)을 2자리 16진수 대문자 문자열('#RRGGBB')로 변환합니다.
 * [EN] Converts each channel (R, G, B) into a 2-digit uppercase hexadecimal string ('#RRGGBB').
 *
 * * ### Example
 * ```typescript
 * const hex = RedGPU.Util.convertRgbToHex(255, 0, 0); // '#FF0000'
 * ```
 *
 * @param r -
 * [KO] 빨간색 성분 (0~255)
 * [EN] Red component (0~255)
 * @param g -
 * [KO] 초록색 성분 (0~255)
 * [EN] Green component (0~255)
 * @param b -
 * [KO] 파란색 성분 (0~255)
 * [EN] Blue component (0~255)
 * @returns
 * [KO] 변환된 16진수 색상 코드 문자열
 * [EN] Converted hexadecimal color code string
 * @throws
 * [KO] 각 색상 성분이 0~255 범위를 벗어날 경우 Error 발생
 * [EN] Throws Error if any color component is out of the 0~255 range
 * @category Color
 */
declare const convertRgbToHex: (r: number, g: number, b: number) => string;
export default convertRgbToHex;

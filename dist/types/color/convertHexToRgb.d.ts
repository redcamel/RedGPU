/**
 * [KO] 16진수(Hex) 색상 값을 RGB 색상으로 변환합니다.
 * [EN] Converts a hexadecimal (Hex) color value to an RGB color.
 *
 * [KO] 문자열 또는 숫자 형태의 16진수 데이터를 받아 각 색상 채널(R, G, B)을 추출합니다.
 * [EN] Receives hexadecimal data in string or number format and extracts each color channel (R, G, B).
 *
 * * ### Example
 * ```typescript
 * const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
 * const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
 * ```
 *
 * @param hex -
 * [KO] 변환할 16진수 색상 데이터 (예: '#ff0000', 'ff0', 0xff0000)
 * [EN] Hexadecimal color data to convert (e.g., '#ff0000', 'ff0', 0xff0000)
 * @param returnArrayYn -
 * [KO] RGB 값을 배열 형태로 반환할지 여부 (기본값: false)
 * [EN] Whether to return RGB values in an array format (Default: false)
 * @returns
 * [KO] 변환된 RGB 색상 데이터
 * [EN] Converted RGB color data
 * @throws
 * [KO] 입력값이 유효한 16진수 색상 형식이 아닐 경우 Error 발생
 * [EN] Throws Error if the input value is not a valid hexadecimal color format
 * @category Color
 */
declare const convertHexToRgb: (hex: string | number, returnArrayYn?: boolean) => any;
export default convertHexToRgb;

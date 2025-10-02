/**
 * RGB 값을 16진수(hex) 색상 코드로 변환합니다.
 *
 * 각 채널(r, g, b)이 0~255 범위에 있는지 검증 후, 2자리 16진수 대문자로 변환하여 '#RRGGBB' 형식의 문자열을 반환합니다.
 *
 * @category ConvertColor
 * @param {number} r 변환할 빨간색(Red) 값 (0~255)
 * @param {number} g 변환할 초록색(Green) 값 (0~255)
 * @param {number} b 변환할 파란색(Blue) 값 (0~255)
 * @returns {string} 변환된 16진수 색상 코드 (예: '#FF0000')
 * @throws {Error} r, g, b 값이 0~255 범위를 벗어나면 예외 발생
 */
declare const convertRgbToHex: (r: number, g: number, b: number) => string;
export default convertRgbToHex;

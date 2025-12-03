import isHexColor from "../../runtimeChecker/isFunc/isHexColor";

/**
 * 16진수(hex) 색상 값을 RGB 색상으로 변환합니다.
 *
 * 문자열 또는 숫자 형태의 hex 값을 받아 RGB 객체 또는 배열로 변환합니다.
 *
 * 3자리(hex)도 6자리로 변환하여 처리하며, 유효하지 않은 hex 입력 시 예외를 발생시킵니다.
 *
 * @category ConvertColor
 * @param {string | number} hex 변환할 16진수 색상 값 (예: '#ff0000', 'ff0', 0xff0000)
 * @param {boolean} [returnArrayYn=false] RGB를 배열([r, g, b])로 반환할지 여부 (기본값: false, 객체 반환)
 * @returns {any} RGB 색상 값. returnArrayYn이 true면 [r, g, b] 배열, 아니면 {r, g, b} 객체 반환
 * @throws {Error} 입력값이 유효한 hex 색상 문자열이 아니면 예외 발생
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

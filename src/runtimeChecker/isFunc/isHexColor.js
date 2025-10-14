/**
 * 주어진 문자열이 유효한 16진수(hex) 색상인지 검사합니다.
 *
 * '#', '0x' 접두사가 붙은 3자리 또는 6자리 16진수 색상 문자열을 허용합니다.
 *
 * @param {string} hex 검사할 문자열
 * @returns {boolean} 유효한 hex 색상 문자열이면 true, 아니면 false
 */
const isHexColor = (hex) => {
    const regex = /^([A-Fa-f0-9]{3}){1,2}$/;
    if (hex.startsWith('#')) {
        return regex.test(hex.substring(1));
    }
    else if (hex.startsWith('0x')) {
        return regex.test(hex.substring(2));
    }
    return false;
};
export default isHexColor;

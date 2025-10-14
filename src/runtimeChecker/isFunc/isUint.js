/**
 * 주어진 값이 부호 없는 정수(unsigned integer)인지 검사합니다.
 *
 * 0 이상의 정수이면 true를 반환하고, 아니면 false를 반환합니다.
 *
 * @param {number} value 검사할 값
 * @returns {boolean} 부호 없는 정수이면 true, 아니면 false
 */
const isUint = (value) => {
    const passInteger = Number.isInteger(value);
    const passNaturalNumber = value >= 0;
    return passInteger && passNaturalNumber;
};
export default isUint;

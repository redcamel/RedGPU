import consoleAndThrowError from "../../utils/consoleAndThrowError";
/**
 * 주어진 값이 숫자인지 검증합니다.
 *
 * 값이 number 타입이 아니면 예외를 발생시키고 false를 반환합니다.
 *
 * number 타입이면 true를 반환합니다.
 *
 * @param {number} value 검증할 값
 * @returns {boolean} 값이 숫자이면 true, 아니면 false
 */
const validateNumber = (value) => {
    if (typeof value !== 'number') {
        consoleAndThrowError('Only numbers allowed.');
        return false;
    }
    return true;
};
export default validateNumber;

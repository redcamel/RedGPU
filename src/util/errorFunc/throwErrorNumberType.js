/**
 * 에러 생성
 */
import getConstructorName from "../getConstructorName";

const throwErrorNumberType = function (target, key) {
	console.log('------ throwErrorNumberType! ------')
	throw Error(`from ${getConstructorName(target)} : ${key} - Only number type allowed`)
}
export default throwErrorNumberType
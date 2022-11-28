/**
 * 에러 생성
 */
import getConstructorName from "../getConstructorName";

const throwErrorInstanceOf = function (target, key, wantClassName) {
	console.log('------ throwErrorInstanceOf! ------')
	throw Error(`from ${getConstructorName(target)} : ${key}는 ${wantClassName}의 instance 만 허용`)
}
export default throwErrorInstanceOf
/**
 * 다양한 런타임 타입/값 체크 함수(isHexColor, isUint 등)와 값 검증 함수(validateNumber, validateNumberRange, validateRedGPUContext 등)를 제공합니다.
 *
 * 각 함수는 값의 타입, 범위, 유효성 등을 런타임에 검증하여 안전한 코드 실행을 지원합니다.
 *
 * @packageDocumentation
 */
import isHexColor from "./isFunc/isHexColor";
import isUint from "./isFunc/isUint";
import validateNumber from "./validateFunc/validateNumber";
import validateNumberRange from "./validateFunc/validateNumberRange";
import validatePositiveNumberRange from "./validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "./validateFunc/validateRedGPUContext";
import validateUintRange from "./validateFunc/validateUintRange";

export {
	isHexColor,
	isUint
}
export {
	validateRedGPUContext,
	validateNumber,
	validateNumberRange,
	validatePositiveNumberRange,
	validateUintRange
}

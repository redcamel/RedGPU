/**
 * [KO] 런타임 환경에서 데이터의 타입, 범위 및 유효성을 검증하는 다양한 유틸리티 함수들을 제공합니다.
 * [EN] Provides various utility functions for validating data types, ranges, and validity in the runtime environment.
 *
 * [KO] 색상 형식 체크, 정수 여부 판별, 숫자 범위 검증 등 안전한 코드 실행을 지원하는 도구들을 포함합니다.
 * [EN] Includes tools that support safe code execution, such as hex color format checks, uint identification, and number range validation.
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
export { isHexColor, isUint };
export { validateRedGPUContext, validateNumber, validateNumberRange, validatePositiveNumberRange, validateUintRange };

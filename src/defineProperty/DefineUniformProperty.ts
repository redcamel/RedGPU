import defineBoolean, {IDefineBoolean} from "./funcs/defineBoolean";
import defineColorRGB, {IColorRGB} from "./funcs/defineColorRGB";
import defineColorRGBA, {IColorRGBA} from "./funcs/defineColorRGBA";
import defineNumber, {IDefineNumber} from "./funcs/defineNumber";
import definePositiveNumber, {IDefinePositiveNumber} from "./funcs/definePositiveNumber";
import defineSampler from "./funcs/defineSampler";
import defineUint, {IUintRange} from "./funcs/defineUint";
import defineVector2, {IDefineVector2} from "./funcs/defineVector2";
import defineVector3, {IDefineVector3} from "./funcs/defineVector3";
import defineVector4, {IDefineVector4} from "./funcs/defineVector4";

export {
    IDefineBoolean,
    IColorRGB,
    IColorRGBA,
    IDefineVector2,
    IDefineVector3,
    IDefineVector4,
    IDefineNumber,
    IDefinePositiveNumber,
    IUintRange
};

/**
 * [KO] RedGPU의 통합 속성 정의 시스템입니다.
 * [EN] Integrated property definition system for RedGPU.
 *
 * [KO] 기존의 DefineForFragment, DefineForVertex를 대체하며, 셰이더 단계에 의존하지 않는 범용적인 속성 정의 기능을 제공합니다.
 * [EN] Replaces the existing DefineForFragment and DefineForVertex, providing general-purpose property definition features independent of shader stages.
 *
 * @namespace DefineUniformProperty
 */
const DefineUniformProperty = {
    defineBoolean,
    defineColorRGB,
    defineColorRGBA,
    defineNumber,
    defineSampler,
    definePositiveNumber,
    defineUint,
    defineVector2,
    defineVector3,
    defineVector4,
}


Object.freeze(DefineUniformProperty)
export default DefineUniformProperty

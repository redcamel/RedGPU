import defineBoolean, {IDefineBoolean} from "./funcs/defineBoolean";
import defineColorRGB, {IColorRGB} from "./funcs/color/defineColorRGB";
import defineColorRGBA, {IColorRGBA} from "./funcs/color/defineColorRGBA";
import defineCubeTexture, {IDefineCubeTexture} from "./funcs/texture/defineCubeTexture";
import defineNumber, {IDefineNumber} from "./funcs/number/defineNumber";
import definePositiveNumber, {IDefinePositiveNumber} from "./funcs/number/definePositiveNumber";
import defineSampler from "./funcs/texture/defineSampler";
import defineTexture, {IDefineTexture} from "./funcs/texture/defineTexture";
import defineUint, {IDefineUint} from "./funcs/number/defineUint";
import defineVector2, {IDefineVector2} from "./funcs/vector/defineVector2";
import defineVector3, {IDefineVector3} from "./funcs/vector/defineVector3";
import defineVector4, {IDefineVector4} from "./funcs/vector/defineVector4";

export type {
    IDefineBoolean,
    IColorRGB,
    IColorRGBA,
    IDefineVector2,
    IDefineVector3,
    IDefineVector4,
    IDefineNumber,
    IDefinePositiveNumber,
    IDefineUint,
    IDefineCubeTexture,
    IDefineTexture
};

/**
 * [KO] RedGPU의 통합 속성 정의 시스템입니다.
 * [EN] Integrated property definition system for RedGPU.
 *
 * [KO] 기존의 DefineForFragment, DefineForVertex를 대체하며, 셰이더 단계에 의존하지 않는 범용적인 속성 정의 기능을 제공합니다.
 * [EN] Replaces the existing DefineForFragment and DefineForVertex, providing general-purpose property definition features independent of shader stages.
 *
 * @namespace DefineGPUProperty
 */
const DefineGPUProperty = {
    defineBoolean,
    defineColorRGB,
    defineColorRGBA,
    defineCubeTexture,
    defineNumber,
    defineSampler,
    definePositiveNumber,
    defineTexture,
    defineUint,
    defineVector2,
    defineVector3,
    defineVector4,
}


Object.freeze(DefineGPUProperty)
export default DefineGPUProperty

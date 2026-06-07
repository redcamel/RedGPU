import defineBoolean from "./funcs/defineBoolean";
import defineColorRGB from "./funcs/color/defineColorRGB";
import defineColorRGBA from "./funcs/color/defineColorRGBA";
import defineCubeTexture from "./funcs/texture/defineCubeTexture";
import defineNumber from "./funcs/number/defineNumber";
import definePositiveNumber from "./funcs/number/definePositiveNumber";
import defineSampler from "./funcs/texture/defineSampler";
import defineTexture from "./funcs/texture/defineTexture";
import defineUint from "./funcs/number/defineUint";
import defineVector2 from "./funcs/vector/defineVector2";
import defineVector3 from "./funcs/vector/defineVector3";
import defineVector4 from "./funcs/vector/defineVector4";


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

import defineSampler from "./funcs/defineSampler";
import defineVector2, {IDefineVec2} from "./funcs/defineVector2";
import defineVector3, {IDefineVec3} from "./funcs/defineVector3";
import defineVector4, {IDefineVec4} from "./funcs/defineVector4";

export {IDefineVec2, IDefineVec3, IDefineVec4};

/**
 * [KO] RedGPU의 통합 속성 정의 시스템입니다.
 * [EN] Integrated property definition system for RedGPU.
 *
 * [KO] 기존의 DefineForFragment, DefineForVertex를 대체하며, 셰이더 단계에 의존하지 않는 범용적인 속성 정의 기능을 제공합니다.
 * [EN] Replaces the existing DefineForFragment and DefineForVertex, providing general-purpose property definition features independent of shader stages.
 *
 * @namespace DefineProperty
 */
const DefineProperty = {
    defineSampler,
    defineVector2,
    defineVector3,
    defineVector4,

}

Object.freeze(DefineProperty)
export default DefineProperty

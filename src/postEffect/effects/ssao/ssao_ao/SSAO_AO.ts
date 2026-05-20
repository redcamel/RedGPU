import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineUniformProperty} from "../../../../defineProperty";
interface SSAO_AO{
    useBlur:boolean
    contrast:number
    radius:number
    intensity:number
    bias:number
    biasDistanceScale:number
    fadeDistanceStart:number
    fadeDistanceRange:number
}
/**
 * [KO] SSAO AO 계산 이펙트입니다. (내부용)
 * [EN] SSAO AO calculation effect. (Internal use)
 * @category PostEffect
 */
class SSAO_AO extends ASinglePassPostEffect {

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }


}

DefineUniformProperty.defineBoolean(SSAO_AO, [
    {key: 'useBlur', value: true}
])
DefineUniformProperty.definePositiveNumber(SSAO_AO, [
    {key: 'contrast', value: 1.5, min: 0.5, max: 4.0},
    {key: 'radius', value: 0.253, min: 0.01, max: 5.0},
    {key: 'intensity', value: 1, min: 0, max: 10},
    {key: 'bias', value: 0.02, min: 0.0, max: 0.1},
    {key: 'biasDistanceScale', value: 0.02, min: 0.0, max: 0.5},
    {key: 'fadeDistanceStart', value: 30.0, min: 1.0, max: 200.0},
    {key: 'fadeDistanceRange', value: 20.0, min: 1.0, max: 100.0},
])
Object.freeze(SSAO_AO);
export default SSAO_AO;

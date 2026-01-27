import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] SSAO AO 계산 이펙트입니다. (내부용)
 * [EN] SSAO AO calculation effect. (Internal use)
 * @category PostEffect
 */
declare class SSAO_AO extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get useBlur(): boolean;
    set useBlur(value: boolean);
    get radius(): number;
    set radius(value: number);
    get intensity(): number;
    set intensity(value: number);
    get bias(): number;
    set bias(value: number);
    get biasDistanceScale(): number;
    set biasDistanceScale(value: number);
    get fadeDistanceStart(): number;
    set fadeDistanceStart(value: number);
    get fadeDistanceRange(): number;
    set fadeDistanceRange(value: number);
    get contrast(): number;
    set contrast(value: number);
}
export default SSAO_AO;

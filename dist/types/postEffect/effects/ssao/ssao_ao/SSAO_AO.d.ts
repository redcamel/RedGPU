import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * SSAO(Screen Space Ambient Occlusion) 후처리 이펙트입니다.
 */
declare class SSAO_A0 extends ASinglePassPostEffect {
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
export default SSAO_A0;

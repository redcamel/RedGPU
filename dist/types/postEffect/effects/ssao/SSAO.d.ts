import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
declare class SSAO extends AMultiPassPostEffect {
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
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default SSAO;

import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
declare class OldBloomBlend extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get bloomStrength(): number;
    set bloomStrength(value: number);
    get exposure(): number;
    set exposure(value: number);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, sourceTextureInfo1: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default OldBloomBlend;

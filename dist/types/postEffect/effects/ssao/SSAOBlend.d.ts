import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
declare class SSAOBlend extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, sourceTextureInfo1: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default SSAOBlend;

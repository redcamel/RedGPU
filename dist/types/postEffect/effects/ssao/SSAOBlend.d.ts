import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
/**
 * [KO] SSAO 블렌딩 이펙트입니다. (내부용)
 * [EN] SSAO blending effect. (Internal use)
 * @category PostEffect
 */
declare class SSAOBlend extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, sourceTextureInfo1: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default SSAOBlend;

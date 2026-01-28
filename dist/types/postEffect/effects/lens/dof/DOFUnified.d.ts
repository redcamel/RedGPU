import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../../core/ASinglePassPostEffect";
/**
 * [KO] DOF 통합 블러 및 합성 이펙트입니다.
 * [EN] DOF unified blur and compositing effect.
 * @category Lens
 */
declare class DOFUnified extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get nearBlurSize(): number;
    set nearBlurSize(value: number);
    get farBlurSize(): number;
    set farBlurSize(value: number);
    get nearStrength(): number;
    set nearStrength(value: number);
    get farStrength(): number;
    set farStrength(value: number);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, cocTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default DOFUnified;

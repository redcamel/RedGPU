import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
/**
 * [KO] 올드 블룸 블렌딩 이펙트입니다. (내부용)
 * [EN] Old Bloom blending effect. (Internal use)
 * @category Visual Effects
 */
declare class OldBloomBlend extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] OldBloomBlend 인스턴스를 생성합니다.
     * [EN] Creates an OldBloomBlend instance.
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     */
    constructor(redGPUContext: RedGPUContext);
    get bloomStrength(): number;
    set bloomStrength(value: number);
    get exposure(): number;
    set exposure(value: number);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, sourceTextureInfo1: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default OldBloomBlend;

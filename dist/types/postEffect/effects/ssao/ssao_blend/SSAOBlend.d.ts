import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] SSAO 블렌딩 이펙트입니다. (내부용)
 * [EN] SSAO blending effect. (Internal use)
 * @category PostEffect
 */
declare class SSAOBlend extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext);
}
export default SSAOBlend;

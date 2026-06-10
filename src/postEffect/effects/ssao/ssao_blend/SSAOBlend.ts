import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";

/**
 * [KO] SSAO 블렌딩 이펙트입니다. (내부용)
 * [EN] SSAO blending effect. (Internal use)
 * @category PostEffect
 */
class SSAOBlend extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO_BLEND',
            createBasicPostEffectCode(
                this,
                computeCode,
                '',
                [
                    {name: 'sourceTexture0'},
                    {name: 'sourceTexture1'}
                ]
            )
        )
    }

}

Object.freeze(SSAOBlend)
export default SSAOBlend


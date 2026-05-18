import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
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
            createBasicPostEffectCode(this, computeCode, '', ['sourceTexture0', 'sourceTexture1'])
        )
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult, sourceTextureInfo1: IPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo, sourceTextureInfo1)
    }
}

Object.freeze(SSAOBlend)
export default SSAOBlend


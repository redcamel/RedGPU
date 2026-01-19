import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"

/**
 * [KO] 색상 반전(Invert) 후처리 이펙트입니다.
 * [EN] Invert post-processing effect.
 *
 * [KO] 화면의 모든 색상을 반전시킵니다.
 * [EN] Inverts all colors on the screen.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Invert(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class Invert extends ASinglePassPostEffect {
    /**
     * [KO] Invert 인스턴스를 생성합니다.
     * [EN] Creates an Invert instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const uniformStructCode = ''
        this.init(
            redGPUContext,
            'POST_EFFECT_INVERT',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }
}

Object.freeze(Invert)
export default Invert
import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineGPUProperty} from "../../../../defineProperty";

interface Vibrance {
    vibrance: number
    saturation: number
}

/**
 * [KO] 바이브런스/채도(Vibrance/Saturation) 후처리 이펙트입니다.
 * [EN] Vibrance/Saturation post-processing effect.
 *
 * [KO] 채도와 바이브런스를 각각 조절할 수 있습니다.
 * [EN] Can adjust Saturation and Vibrance respectively.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;    // 바이브런스 증가
 * effect.saturation = 20;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/vibrance/"></iframe>
 * @category Adjustments
 */
class Vibrance extends ASinglePassPostEffect {

    /**
     * [KO] Vibrance 인스턴스를 생성합니다.
     * [EN] Creates a Vibrance instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_VIBRANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}

DefineGPUProperty.defineNumber(Vibrance, [
    {key: 'vibrance', value: 0, min: -100, max: 100},
    {key: 'saturation', value: 0, min: -100, max: 100}
])

Object.freeze(Vibrance)
export default Vibrance

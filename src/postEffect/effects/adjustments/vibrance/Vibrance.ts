import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface Vibrance {
    /**
     * [KO] 바이브런스 조절 값 (-100 ~ 100)
     * [EN] Vibrance adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    vibrance: number
    /**
     * [KO] 채도 조절 값 (-100 ~ 100)
     * [EN] Saturation adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    saturation: number
}

/**
 * [KO] 과포화를 방지하면서 채도가 낮은 영역의 색감을 자연스럽게 강조하는 바이브런스/채도 후처리 이펙트입니다.
 * [EN] Vibrance/Saturation post-processing effect that naturally enhances low-saturation areas while preventing over-saturation.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;
 * effect.saturation = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/vibrance/" style="width:100%; height:500px;"></iframe>
 * @category Adjustments
 */
class Vibrance extends ASinglePassPostEffect {

    /**
     * [KO] Vibrance 인스턴스를 생성합니다.
     * [EN] Creates a Vibrance instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_VIBRANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}

defineNumber(Vibrance, [
    {key: 'vibrance', value: 0, min: -100, max: 100},
    {key: 'saturation', value: 0, min: -100, max: 100}
])

Object.freeze(Vibrance)
export default Vibrance

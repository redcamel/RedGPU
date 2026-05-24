import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

interface Grayscale {
    amount: number
}

/**
 * [KO] 그레이스케일(Grayscale) 후처리 이펙트입니다.
 * [EN] Grayscale post-processing effect.
 *
 * [KO] 화면을 흑백으로 변환합니다.
 * [EN] Converts the screen to black and white.
 * * ### Example
 * ``` TypeScript
 * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/grayscale/"></iframe>
 * @category Adjustments
 */
class Grayscale extends ASinglePassPostEffect {
    /**
     * [KO] Grayscale 인스턴스를 생성합니다.
     * [EN] Creates a Grayscale instance.
     *
     * @param redGPUContext
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_GRAYSCALE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineGPUProperty.definePositiveNumber(Grayscale, [
    {key: 'amount', value: 1, min: 0, max: 1}
])
Object.freeze(Grayscale)
export default Grayscale

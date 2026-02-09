import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 그레이스케일(Grayscale) 후처리 이펙트입니다.
 * [EN] Grayscale post-processing effect.
 *
 * [KO] 화면을 흑백으로 변환합니다.
 * [EN] Converts the screen to black and white.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/grayscale/"></iframe>
 * @category Adjustments
 */
declare class Grayscale extends ASinglePassPostEffect {
    /**
     * [KO] Grayscale 인스턴스를 생성합니다.
     * [EN] Creates a Grayscale instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Grayscale;

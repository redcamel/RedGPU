import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface Vibrance {
    /**
     * [KO] 바이브런스 조절 값 (-100 ~ 100)
     * [EN] Vibrance adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    vibrance: number;
    /**
     * [KO] 채도 조절 값 (-100 ~ 100)
     * [EN] Saturation adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    saturation: number;
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
 *
 * @see [Vibrance example](/RedGPU/examples/postEffect/adjustments/vibrance/)
 * @category Adjustments
 */
declare class Vibrance extends ASinglePassPostEffect {
    /**
     * [KO] Vibrance 인스턴스를 생성합니다.
     * [EN] Creates a Vibrance instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Vibrance;

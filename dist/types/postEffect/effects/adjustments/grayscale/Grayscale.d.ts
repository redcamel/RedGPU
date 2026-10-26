import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface Grayscale {
    /**
     * [KO] 흑백 효과 적용 강도 (0 ~ 1)
     * [EN] Grayscale effect application intensity (0 ~ 1)
     * @defaultValue 1
     */
    amount: number;
}
/**
 * [KO] 표준 휘도 가중치(Rec. 709)를 사용하여 컬러 이미지를 흑백으로 변환하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that converts color images to grayscale using standard luminance weights (Rec. 709).
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
 * effect.amount = 0.5;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/grayscale/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Grayscale example](/RedGPU/examples/postEffect/adjustments/grayscale/)
 * @category Adjustments
 */
declare class Grayscale extends ASinglePassPostEffect {
    /**
     * [KO] Grayscale 인스턴스를 생성합니다.
     * [EN] Creates a Grayscale instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Grayscale;

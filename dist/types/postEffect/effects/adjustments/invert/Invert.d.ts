import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface Invert {
    /**
     * [KO] 반전 효과 적용 강도 (0 ~ 1)
     * [EN] Invert effect application intensity (0 ~ 1)
     * @defaultValue 1
     */
    amount: number;
}
/**
 * [KO] 화면의 색상을 보색으로 반전시키는 후처리 이펙트입니다.
 * [EN] Post-processing effect that inverts screen colors to their complementary colors.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Invert(redGPUContext);
 * effect.amount = 1.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/invert/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Invert example](/RedGPU/examples/postEffect/adjustments/invert/)
 * @category Adjustments
 */
declare class Invert extends ASinglePassPostEffect {
    /**
     * [KO] Invert 인스턴스를 생성합니다.
     * [EN] Creates an Invert instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Invert(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Invert;

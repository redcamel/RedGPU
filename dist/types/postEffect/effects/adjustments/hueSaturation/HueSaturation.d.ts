import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 색상/채도(Hue/Saturation) 후처리 이펙트입니다.
 * [EN] Hue/Saturation post-processing effect.
 *
 * [KO] 색상(Hue)과 채도(Saturation)를 조절할 수 있습니다.
 * [EN] Can adjust Hue and Saturation.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
 * effect.hue = 90;         // 색상 회전
 * effect.saturation = 50;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/hueSaturation/"></iframe>
 * @category Adjustments
 */
declare class HueSaturation extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] HueSaturation 인스턴스를 생성합니다.
     * [EN] Creates a HueSaturation instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 색상 값을 반환합니다.
     * [EN] Returns the hue value.
     */
    get hue(): number;
    /**
     * [KO] 색상 값을 설정합니다. (-180 ~ 180)
     * [EN] Sets the hue value. (-180 ~ 180)
     */
    set hue(value: number);
    /**
     * [KO] 채도 값을 반환합니다.
     * [EN] Returns the saturation value.
     */
    get saturation(): number;
    /**
     * [KO] 채도 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the saturation value. (-100 ~ 100)
     */
    set saturation(value: number);
}
export default HueSaturation;

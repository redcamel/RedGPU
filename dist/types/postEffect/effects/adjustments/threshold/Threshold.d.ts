import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 임계값(Threshold) 후처리 이펙트입니다.
 * [EN] Threshold post-processing effect.
 *
 * [KO] 지정한 임계값을 기준으로 픽셀을 흑백으로 변환합니다.
 * [EN] Converts pixels to black and white based on the specified threshold value.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
 * effect.threshold = 200; // 임계값 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/threshold/"></iframe>
 * @category Adjustments
 */
declare class Threshold extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] Threshold 인스턴스를 생성합니다.
     * [EN] Creates a Threshold instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 임계값을 반환합니다.
     * [EN] Returns the threshold value.
     */
    get threshold(): number;
    /**
     * [KO] 임계값을 설정합니다. (1 ~ 255)
     * [EN] Sets the threshold value. (1 ~ 255)
     */
    set threshold(value: number);
}
export default Threshold;

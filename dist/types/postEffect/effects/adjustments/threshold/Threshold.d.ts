import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface Threshold {
    /**
     * [KO] 흑백 전환 기준 임계값 (1 ~ 255)
     * [EN] Threshold value for binary conversion (1 ~ 255)
     * @defaultValue 128
     */
    threshold: number;
}
/**
 * [KO] 설정된 임계값을 기준으로 픽셀 휘도를 판별하여 순수 흑색 또는 백색으로 이진화하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that binarizes each pixel into pure black or white based on a luminance threshold value.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
 * effect.threshold = 128;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/threshold/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Threshold example](/RedGPU/examples/postEffect/adjustments/threshold/)
 * @category Adjustments
 */
declare class Threshold extends ASinglePassPostEffect {
    /**
     * [KO] Threshold 인스턴스를 생성합니다.
     * [EN] Creates a Threshold instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Threshold;

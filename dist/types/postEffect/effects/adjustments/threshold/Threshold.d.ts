import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface Threshold {
    /** [KO] 흑백 전환 기준 임계값 (1 ~ 255) [EN] Threshold value for binary conversion (1 ~ 255) */
    threshold: number;
}
/**
 * [KO] 임계값(Threshold) 후처리 이펙트입니다.
 * [EN] Threshold post-processing effect.
 *
 * [KO] 설정된 임계값을 기준으로 이미지의 각 픽셀을 순수 흑색(0.0) 또는 순수 백색(1.0)으로 변환합니다.
 * [EN] Converts each pixel of the image to pure black (0.0) or pure white (1.0) based on the set threshold value.
 *
 * [KO] 입력 픽셀의 휘도(Luminance)가 임계값보다 크면 백색, 작으면 흑색으로 분류되어 강렬한 이진화 효과를 제공합니다.
 * [EN] If the luminance of the input pixel is greater than the threshold, it is classified as white; otherwise, it is black, providing a strong binarization effect.
 *
 * [KO] 이 효과는 LDR 공간에서 0~1 사이의 표준 휘도를 기반으로 동작할 때 가장 정확한 결과를 얻을 수 있습니다.
 * [EN] This effect provides the most accurate results when operating based on standard luminance between 0-1 in LDR space.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
 * effect.threshold = 128; // 중간 밝기를 기준으로 흑백 분리
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/threshold/"></iframe>
 * @category Adjustments
 */
declare class Threshold extends ASinglePassPostEffect {
    /**
     * [KO] Threshold 인스턴스를 생성합니다.
     * [EN] Creates a Threshold instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Threshold;

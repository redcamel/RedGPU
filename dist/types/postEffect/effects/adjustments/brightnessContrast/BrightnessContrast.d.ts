import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface BrightnessContrast {
    /** [KO] 밝기 조절 값 (-150 ~ 150) [EN] Brightness adjustment value (-150 ~ 150) */
    brightness: number;
    /** [KO] 대비 조절 값 (-50 ~ 100) [EN] Contrast adjustment value (-50 ~ 100) */
    contrast: number;
}
/**
 * [KO] 밝기/대비 조절 후처리 이펙트입니다.
 * [EN] Brightness/Contrast adjustment post-processing effect.
 *
 * [KO] 이미지의 전체적인 명도(Brightness)와 색상 간의 차이인 대비(Contrast)를 세밀하게 조절합니다.
 * [EN] Finely adjusts the overall brightness and the difference between colors (Contrast) of the image.
 *
 * [KO] 이 효과는 LDR 공간에서 동작하여 0~1 사이의 표준 색상 범위를 기반으로 가장 정확한 보정 결과를 제공합니다.
 * [EN] This effect operates in LDR space, providing the most accurate correction results based on the standard 0-1 color range.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * effect.brightness = 50;  // 밝기 증가
 * effect.contrast = 20;    // 대비 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/brightnessContrast/"></iframe>
 * @category Adjustments
 */
declare class BrightnessContrast extends ASinglePassPostEffect {
    /**
     * [KO] BrightnessContrast 인스턴스를 생성합니다.
     * [EN] Creates a BrightnessContrast instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default BrightnessContrast;

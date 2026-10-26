import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface BrightnessContrast {
    /**
     * [KO] 밝기 조절 값 (-150 ~ 150)
     * [EN] Brightness adjustment value (-150 ~ 150)
     * @defaultValue 0
     */
    brightness: number;
    /**
     * [KO] 대비 조절 값 (-50 ~ 100)
     * [EN] Contrast adjustment value (-50 ~ 100)
     * @defaultValue 0
     */
    contrast: number;
}
/**
 * [KO] 이미지의 명도(Brightness)와 대비(Contrast)를 조절하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that adjusts the brightness and contrast of an image.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * effect.brightness = 50;
 * effect.contrast = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/brightnessContrast/" style="width:100%; height:500px;"></iframe>
 *
 * @see [BrightnessContrast example](/RedGPU/examples/postEffect/adjustments/brightnessContrast/)
 * @category Adjustments
 */
declare class BrightnessContrast extends ASinglePassPostEffect {
    /**
     * [KO] BrightnessContrast 인스턴스를 생성합니다.
     * [EN] Creates a BrightnessContrast instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default BrightnessContrast;

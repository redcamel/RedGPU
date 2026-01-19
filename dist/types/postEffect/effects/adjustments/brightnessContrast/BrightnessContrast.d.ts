import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 밝기/대비 조절 후처리 이펙트입니다.
 * [EN] Brightness/Contrast adjustment post-processing effect.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * effect.brightness = 50;
 * effect.contrast = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/brightnessContrast/"></iframe>
 * @category Adjustments
 */
declare class BrightnessContrast extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] BrightnessContrast 인스턴스를 생성합니다.
     * [EN] Creates a BrightnessContrast instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 밝기 값을 반환합니다.
     * [EN] Returns the brightness value.
     */
    get brightness(): number;
    /**
     * [KO] 밝기 값을 설정합니다. (-150 ~ 150)
     * [EN] Sets the brightness value. (-150 ~ 150)
     */
    set brightness(value: number);
    /**
     * [KO] 대비 값을 반환합니다.
     * [EN] Returns the contrast value.
     */
    get contrast(): number;
    /**
     * [KO] 대비 값을 설정합니다. (-50 ~ 100)
     * [EN] Sets the contrast value. (-50 ~ 100)
     */
    set contrast(value: number);
}
export default BrightnessContrast;

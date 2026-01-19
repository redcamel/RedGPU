import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

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
class BrightnessContrast extends ASinglePassPostEffect {
    /**
     * [KO] 밝기 (-150 ~ 150)
     * [EN] Brightness (-150 ~ 150)
     * @defaultValue 0
     */
    #brightness: number = 0
    /**
     * [KO] 대비 (-50 ~ 100)
     * [EN] Contrast (-50 ~ 100)
     * @defaultValue 0
     */
    #contrast: number = 0

    /**
     * [KO] BrightnessContrast 인스턴스를 생성합니다.
     * [EN] Creates a BrightnessContrast instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BRIGHTNESS_CONTRAST',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

    /**
     * [KO] 밝기 값을 반환합니다.
     * [EN] Returns the brightness value.
     */
    get brightness(): number {
        return this.#brightness;
    }

    /**
     * [KO] 밝기 값을 설정합니다. (-150 ~ 150)
     * [EN] Sets the brightness value. (-150 ~ 150)
     */
    set brightness(value: number) {
        validateNumberRange(value, -150, 150)
        this.#brightness = value;
        this.updateUniform('brightness', value)
    }

    /**
     * [KO] 대비 값을 반환합니다.
     * [EN] Returns the contrast value.
     */
    get contrast(): number {
        return this.#contrast;
    }

    /**
     * [KO] 대비 값을 설정합니다. (-50 ~ 100)
     * [EN] Sets the contrast value. (-50 ~ 100)
     */
    set contrast(value: number) {
        validateNumberRange(value, -50, 100)
        this.#contrast = value;
        this.updateUniform('contrast', value)
    }
}

Object.freeze(BrightnessContrast)
export default BrightnessContrast

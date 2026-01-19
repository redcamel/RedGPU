import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 밝기/대비(Brightness/Contrast) 조절 후처리 이펙트입니다.
 * [EN] Brightness/Contrast adjustment post-processing effect.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * effect.brightness = 50;
 * effect.contrast = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class BrightnessContrast extends ASinglePassPostEffect {
    /** 
     * [KO] 밝기. 기본값 0
     * [EN] Brightness. Default 0
     */
    #brightness: number = 0
    /** 
     * [KO] 대비. 기본값 0
     * [EN] Contrast. Default 0
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
     * [KO] 밝기
     * [EN] Brightness
     */
    get brightness(): number {
        return this.#brightness;
    }

    /**
     * [KO] 밝기를 설정합니다.
     * [EN] Sets the brightness.
     * 
     * [KO] 범위: -150~150
     * [EN] Range: -150~150
     */
    set brightness(value: number) {
        validateNumberRange(value, -150, 150)
        this.#brightness = value;
        this.updateUniform('brightness', value)
    }

    /** 
     * [KO] 대비
     * [EN] Contrast
     */
    get contrast(): number {
        return this.#contrast;
    }

    /**
     * [KO] 대비를 설정합니다.
     * [EN] Sets the contrast.
     * 
     * [KO] 범위: -50~100
     * [EN] Range: -50~100
     */
    set contrast(value: number) {
        validateNumberRange(value, -50, 100)
        this.#contrast = value;
        this.updateUniform('contrast', value)
    }
}

Object.freeze(BrightnessContrast)
export default BrightnessContrast
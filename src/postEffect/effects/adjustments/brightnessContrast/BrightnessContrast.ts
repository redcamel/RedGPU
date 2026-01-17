import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 밝기/대비 조절 후처리 이펙트입니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * effect.brightness = 50;
 * effect.contrast = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/brightnessContrast/"></iframe>
 */
class BrightnessContrast extends ASinglePassPostEffect {
    /** 밝기. 기본값 0, 범위 -150~150 */
    #brightness: number = 0
    /** 대비. 기본값 0, 범위 -50~100 */
    #contrast: number = 0

    /**
     * BrightnessContrast 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BRIGHTNESS_CONTRAST',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

    /** 밝기 반환 */
    get brightness(): number {
        return this.#brightness;
    }

    /**
     * 밝기 설정
     * 범위: -150~150
     */
    set brightness(value: number) {
        validateNumberRange(value, -150, 150)
        this.#brightness = value;
        this.updateUniform('brightness', value)
    }

    /** 대비 반환 */
    get contrast(): number {
        return this.#contrast;
    }

    /**
     * 대비 설정
     * 범위: -50~100
     */
    set contrast(value: number) {
        validateNumberRange(value, -50, 100)
        this.#contrast = value;
        this.updateUniform('contrast', value)
    }
}

Object.freeze(BrightnessContrast)
export default BrightnessContrast

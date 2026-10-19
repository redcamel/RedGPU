import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface BrightnessContrast {
    /**
     * [KO] 밝기 조절 값 (범위: `-150` ~ `150`, 기본값: `0`)
     * [EN] Brightness adjustment value (range: `-150` to `150`, default: `0`)
     */
    brightness: number,
    /**
     * [KO] 대비 조절 값 (범위: `-50` ~ `100`, 기본값: `0`)
     * [EN] Contrast adjustment value (range: `-50` to `100`, default: `0`)
     */
    contrast: number
}

/**
 * [KO] 이미지의 명도(Brightness)와 대비(Contrast)를 조절하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that adjusts the brightness and contrast of an image.
 *
 * [KO] LDR 공간(0 ~ 1 표준 색상 범위)에서 동작합니다.
 * [EN] Operates in LDR space (standard 0 to 1 color range).
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * // [KO] 밝기 및 대비 증가
 * // [EN] Increase brightness and contrast
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
class BrightnessContrast extends ASinglePassPostEffect {
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
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_BRIGHTNESS_CONTRAST',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

defineNumber(BrightnessContrast,
    [
        {key: 'brightness', value: 0, min: -150, max: 150},
        {key: 'contrast', value: 0, min: -50, max: 100}
    ]
)

Object.freeze(BrightnessContrast)
export default BrightnessContrast

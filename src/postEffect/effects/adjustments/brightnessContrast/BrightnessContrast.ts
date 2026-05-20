import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineUniformProperty from "../../../../defineProperty/DefineUniformProperty";

interface BrightnessContrast{
    brightness:number,
    contrast:number
}
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
        );
    }
}

DefineUniformProperty.defineNumber(BrightnessContrast,
    [
        {key: 'brightness', value: 0, min: -150, max: 150},
        {key: 'contrast', value: 0, min: -50, max: 100}
    ]
)

Object.freeze(BrightnessContrast)
export default BrightnessContrast

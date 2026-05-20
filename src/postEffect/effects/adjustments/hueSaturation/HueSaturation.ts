import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineUniformProperty from "../../../../defineProperty/DefineUniformProperty";

interface HueSaturation{
    hue: number
    saturation: number
}
/**
 * [KO] 색상/채도(Hue/Saturation) 후처리 이펙트입니다.
 * [EN] Hue/Saturation post-processing effect.
 *
 * [KO] 색상(Hue)과 채도(Saturation)를 조절할 수 있습니다.
 * [EN] Can adjust Hue and Saturation.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
 * effect.hue = 90;         // 색상 회전
 * effect.saturation = 50;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/hueSaturation/"></iframe>
 * @category Adjustments
 */
class HueSaturation extends ASinglePassPostEffect {

    /**
     * [KO] HueSaturation 인스턴스를 생성합니다.
     * [EN] Creates a HueSaturation instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_HUE_SATURATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}
DefineUniformProperty.defineNumber(HueSaturation, [
    {key: 'hue', value: 0, min: -180, max: 180},
    {key: 'saturation', value: 0, min: -100, max: 100}
])
Object.freeze(HueSaturation)
export default HueSaturation

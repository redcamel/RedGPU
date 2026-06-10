import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface HueSaturation {
    /** [KO] 색상 회전 값 (-180 ~ 180 도) [EN] Hue rotation value (-180 ~ 180 degrees) */
    hue: number
    /** [KO] 채도 조절 값 (-100 ~ 100) [EN] Saturation adjustment value (-100 ~ 100) */
    saturation: number
}

/**
 * [KO] 색상/채도(Hue/Saturation) 후처리 이펙트입니다.
 * [EN] Hue/Saturation post-processing effect.
 *
 * [KO] 이미지의 색상 톤(Hue)을 회전시키거나 전체적인 색의 강도(Saturation)를 조절합니다.
 * [EN] Rotates the color tone (Hue) of the image or adjusts the overall color intensity (Saturation).
 *
 * [KO] 색상 회전은 RGB 큐브 공간에서의 회전을 시뮬레이션하며, 채도 조절은 휘도 정보를 기반으로 색상의 순도를 조절합니다.
 * [EN] Hue rotation simulates rotation in RGB cube space, and saturation adjustment controls color purity based on luminance information.
 *
 * [KO] 이 효과는 LDR 공간에서 동작할 때 가장 정확한 색상 변환 결과를 제공합니다.
 * [EN] This effect provides the most accurate color transformation results when operating in LDR space.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
 * effect.hue = 90;         // 색상을 90도 회전
 * effect.saturation = 50;  // 채도를 50% 증가
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
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_HUE_SATURATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}

defineNumber(HueSaturation, [
    {key: 'hue', value: 0, min: -180, max: 180},
    {key: 'saturation', value: 0, min: -100, max: 100}
])
Object.freeze(HueSaturation)
export default HueSaturation

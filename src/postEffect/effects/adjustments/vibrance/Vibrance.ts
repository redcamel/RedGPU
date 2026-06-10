import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface Vibrance {
    /** [KO] 바이브런스 조절 값 (-100 ~ 100). 채도가 낮은 영역 위주로 지능적 강화를 수행합니다. [EN] Vibrance adjustment value (-100 to 100). Performs intelligent enhancement primarily on low-saturation areas. */
    vibrance: number
    /** [KO] 채도 조절 값 (-100 ~ 100). 전체 이미지의 색상 강도를 조절합니다. [EN] Saturation adjustment value (-100 to 100). Adjusts the overall color intensity of the image. */
    saturation: number
}

/**
 * [KO] 바이브런스/채도(Vibrance/Saturation) 후처리 이펙트입니다.
 * [EN] Vibrance/Saturation post-processing effect.
 *
 * [KO] 채도(Saturation)가 이미지 전체의 색 강도를 균일하게 조절하는 반면, 바이브런스(Vibrance)는 이미 채도가 높은 영역의 과포화를 방지하고 인물의 피부톤을 보호하면서 자연스럽게 색감을 강조합니다.
 * [EN] While Saturation adjusts the color intensity of the entire image uniformly, Vibrance prevents over-saturation of already saturated areas and protects skin tones while naturally enhancing colors.
 *
 * [KO] 이 효과는 LDR 공간에서 동작하여 피부톤 및 채도 보호 로직이 가장 정확하게 작동하도록 설계되었습니다.
 * [EN] This effect operates in LDR space, ensuring that skin tone and saturation protection logic work most accurately.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;    // 자연스러운 색감 강조
 * effect.saturation = 20;  // 전체적인 채도 보강
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/vibrance/"></iframe>
 * @category Adjustments
 */
class Vibrance extends ASinglePassPostEffect {

    /**
     * [KO] Vibrance 인스턴스를 생성합니다.
     * [EN] Creates a Vibrance instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_VIBRANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}

defineNumber(Vibrance, [
    {key: 'vibrance', value: 0, min: -100, max: 100},
    {key: 'saturation', value: 0, min: -100, max: 100}
])

Object.freeze(Vibrance)
export default Vibrance

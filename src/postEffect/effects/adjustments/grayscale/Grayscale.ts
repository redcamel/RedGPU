import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

interface Grayscale {
    amount: number
}

/**
 * [KO] 그레이스케일(Grayscale) 후처리 이펙트입니다.
 * [EN] Grayscale post-processing effect.
 *
 * [KO] 컬러 이미지를 흑백으로 변환합니다. 표준적인 휘도 가중치(Rec. 709)를 사용하여 인간의 눈에 자연스러운 흑백 이미지를 생성합니다.
 * [EN] Converts color images to black and white. Uses standard luminance weights (Rec. 709) to create a grayscale image that looks natural to the human eye.
 *
 * [KO] `amount` 속성을 통해 원본 컬러와 흑백 이미지 사이의 혼합 강도를 조절할 수 있습니다.
 * [EN] The mix intensity between the original color and the grayscale image can be adjusted via the `amount` property.
 *
 * * ### Example
 * ``` TypeScript
 * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
 * effect.amount = 0.5; // 반투명한 흑백 효과
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/grayscale/"></iframe>
 * @category Adjustments
 */
class Grayscale extends ASinglePassPostEffect {
    /**
     * [KO] Grayscale 인스턴스를 생성합니다.
     * [EN] Creates a Grayscale instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_GRAYSCALE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineGPUProperty.definePositiveNumber(Grayscale, [
    {key: 'amount', value: 1, min: 0, max: 1}
])
Object.freeze(Grayscale)
export default Grayscale

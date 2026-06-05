import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";

interface Invert {
    amount: number
}

/**
 * [KO] 색상 반전(Invert) 후처리 이펙트입니다.
 * [EN] Invert post-processing effect.
 *
 * [KO] 화면의 모든 색상을 보색으로 반전시킵니다. (예: 빨강 -> 시안, 파랑 -> 노랑)
 * [EN] Inverts all colors on the screen to their complementary colors (e.g., Red -> Cyan, Blue -> Yellow).
 *
 * [KO] `amount` 속성을 통해 원본과 반전된 이미지 사이의 혼합 비율을 조절할 수 있습니다.
 * [EN] The mix ratio between the original and inverted image can be adjusted via the `amount` property.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Invert(redGPUContext);
 * effect.amount = 1.0; // 전체 반전
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/invert/"></iframe>
 * @category Adjustments
 */
class Invert extends ASinglePassPostEffect {
    /**
     * [KO] Invert 인스턴스를 생성합니다.
     * [EN] Creates an Invert instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_INVERT',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineGPUProperty.definePositiveNumber(Invert, [
    {key: 'amount', value: 1, min: 0, max: 1}
])
Object.freeze(Invert)
export default Invert

import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";


interface Invert {
    /**
     * [KO] 반전 효과 적용 강도 (0 ~ 1)
     * [EN] Invert effect application intensity (0 ~ 1)
     * @defaultValue 1
     */
    amount: number
}

/**
 * [KO] 화면의 색상을 보색으로 반전시키는 후처리 이펙트입니다.
 * [EN] Post-processing effect that inverts screen colors to their complementary colors.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Invert(redGPUContext);
 * effect.amount = 1.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/invert/" style="width:100%; height:500px;"></iframe>
 * @category Adjustments
 */
class Invert extends ASinglePassPostEffect {
    /**
     * [KO] Invert 인스턴스를 생성합니다.
     * [EN] Creates an Invert instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_INVERT',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

definePositiveNumber(Invert, [
    {key: 'amount', value: 1, min: 0, max: 1}
])
Object.freeze(Invert)
export default Invert

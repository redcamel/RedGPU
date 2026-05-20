import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineUniformProperty from "../../../../defineProperty/DefineUniformProperty";

interface RadialBlur {
    amount: number
    centerX: number
    centerY: number
    sampleCount: number
}

/**
 * [KO] 방사형 블러(Radial Blur) 후처리 이펙트입니다.
 * [EN] Radial Blur post-processing effect.
 *
 * [KO] 중심점, 강도, 샘플 수를 조절해 원형으로 퍼지는 블러 효과를 만듭니다.
 * [EN] Creates a circular spreading blur effect by adjusting the center point, strength, and sample count.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * effect.sampleCount = 32; // 샘플 수
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/radialBlur/"></iframe>
 * @category Blur
 */
class RadialBlur extends ASinglePassPostEffect {

    /**
     * [KO] RadialBlur 인스턴스를 생성합니다.
     * [EN] Creates a RadialBlur instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_RADIAL_BLUR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }


}

DefineUniformProperty.definePositiveNumber(RadialBlur, [
    {key: 'amount', value: 50}
])
DefineUniformProperty.defineNumber(RadialBlur, [
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
])
DefineUniformProperty.defineUint(RadialBlur, [
    {key: 'sampleCount', value: 16, min: 4},
])
Object.freeze(RadialBlur)
export default RadialBlur

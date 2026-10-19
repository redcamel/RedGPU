import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";


interface RadialBlur {
    /**
     * [KO] 블러 강도 (기본값: 50)
     * [EN] Blur strength (default: 50)
     */
    amount: number
    /**
     * [KO] 블러 중심점 X 오프셋 (단위: 픽셀, 0 = 화면 중앙, 기본값: 0)
     * [EN] Blur center X offset (unit: pixels, 0 = screen center, default: 0)
     */
    centerX: number
    /**
     * [KO] 블러 중심점 Y 오프셋 (단위: 픽셀, 0 = 화면 중앙, 기본값: 0)
     * [EN] Blur center Y offset (unit: pixels, 0 = screen center, default: 0)
     */
    centerY: number
    /**
     * [KO] 샘플링 횟수 (범위: 2 ~ 100, 기본값: 16)
     * [EN] Number of samples (range: 2 to 100, default: 16)
     */
    sampleCount: number
}

/**
 * [KO] 화면의 특정 지점을 기준으로 회전 번짐을 적용하는 방사형 회전 블러 후처리 이펙트입니다.
 * [EN] Radial Blur post-processing effect that applies rotational blur around a specific screen point.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 50;
 * effect.sampleCount = 16;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/radialBlur/" style="width:100%; height:500px;"></iframe>
 * @see [RadialBlur example](/RedGPU/examples/postEffect/blur/radialBlur/)
 * @category Blur
 */
class RadialBlur extends ASinglePassPostEffect {

    /**
     * [KO] RadialBlur 인스턴스를 생성합니다.
     * [EN] Creates a RadialBlur instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
     * ```
     *
     * @param redGPUContext -
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

definePositiveNumber(RadialBlur, [
    {key: 'amount', value: 50}
])
defineNumber(RadialBlur, [
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
])
defineUint(RadialBlur, [
    {key: 'sampleCount', value: 16, min: 2, max: 100},
])
Object.freeze(RadialBlur)
export default RadialBlur

import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";


interface RadialBlur {
    /** [KO] 블러 강도. 값이 클수록 회전 번짐이 강해집니다. [EN] Blur strength. Higher values increase rotational bleeding. */
    amount: number
    /** [KO] 블러의 중심점 X 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Blur center X offset (in pixels, 0 is screen center). */
    centerX: number
    /** [KO] 블러의 중심점 Y 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Blur center Y offset (in pixels, 0 is screen center). */
    centerY: number
    /** [KO] 샘플링 횟수 (2 ~ 100). 값이 클수록 부드럽지만 성능 소모가 늘어납니다. [EN] Number of samples (2 to 100). Higher values are smoother but increase performance cost. */
    sampleCount: number
}

/**
 * [KO] 방사형 회전 블러(Radial Blur) 후처리 이펙트입니다.
 * [EN] Radial Blur post-processing effect.
 *
 * [KO] 화면의 특정 지점을 기준으로 이미지를 회전시키며 블러 처리를 하여, 역동적인 회전감이나 집중 효과를 만듭니다. (0,0)은 화면의 정중앙을 의미합니다.
 * [EN] Applies blur by rotating the image around a specific point, creating a dynamic sense of rotation or focus. (0,0) refers to the exact center of the screen.
 *
 * [KO] 하드웨어 선형 샘플러를 사용하여 회전 궤적의 계단 현상을 최소화하고 매끄러운 결과물을 제공합니다.
 * [EN] Minimizes aliasing in the rotation trajectory and provides smooth results using a hardware linear sampler.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 50;
 * effect.sampleCount = 16;
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

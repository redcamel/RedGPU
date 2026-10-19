import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";

interface BlurY {
    /**
     * [KO] 블러 강도 (범위: 0 ~ 512, 기본값: 32)
     * [EN] Blur strength (range: 0 to 512, default: 32)
     */
    size: number
}

/**
 * [KO] Y축 방향의 가우시안 블러 후처리 이펙트입니다.
 * [EN] Gaussian Blur post-processing effect in the Y-axis direction.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BlurY(redGPUContext);
 * // [KO] 블러 강도 조절
 * // [EN] Adjust blur strength
 * effect.size = 64;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blurY/" style="width:100%; height:500px;"></iframe>
 * @see [BlurY example](/RedGPU/examples/postEffect/blur/blurY/)
 * @category Blur
 */
class BlurY extends ASinglePassPostEffect {

    /**
     * [KO] BlurY 인스턴스를 생성합니다.
     * [EN] Creates a BlurY instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.BlurY(redGPUContext);
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
            'POST_EFFECT_BLUR_Y',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

    }
}

definePositiveNumber(BlurY, [
    {key: 'size', value: 32, min: 0, max: 512}
])
Object.freeze(BlurY)
export default BlurY

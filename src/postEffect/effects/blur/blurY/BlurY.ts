import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineUniformProperty} from "../../../../defineProperty";
interface BlurY {
    size: number
}
/**
 * [KO] Y축 방향 블러 후처리 효과를 제공하는 클래스입니다.
 * [EN] Class that provides Y-axis blur post-processing effect.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BlurY(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blurY/"></iframe>
 * @category Blur
 */
class BlurY extends ASinglePassPostEffect {

    /**
     * [KO] BlurY 인스턴스를 생성합니다.
     * [EN] Creates a BlurY instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
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

DefineUniformProperty.definePositiveNumber(BlurY, [
    {key: 'size', value: 32, min: 0, max: 512}
])

Object.freeze(BlurY)
export default BlurY

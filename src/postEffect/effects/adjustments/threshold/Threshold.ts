import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineGPUProperty} from "../../../../defineProperty";

interface Threshold {
    threshold: number
}

/**
 * [KO] 임계값(Threshold) 후처리 이펙트입니다.
 * [EN] Threshold post-processing effect.
 *
 * [KO] 지정한 임계값을 기준으로 픽셀을 흑백으로 변환합니다.
 * [EN] Converts pixels to black and white based on the specified threshold value.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
 * effect.threshold = 200; // 임계값 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/threshold/"></iframe>
 * @category Adjustments
 */
class Threshold extends ASinglePassPostEffect {

    /**
     * [KO] Threshold 인스턴스를 생성합니다.
     * [EN] Creates a Threshold instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_THRESHOLD',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}

DefineGPUProperty.definePositiveNumber(Threshold, [
    {key: 'threshold', value: 128, min: 1, max: 255}
])

Object.freeze(Threshold)
export default Threshold

import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";


interface Threshold {
    /**
     * [KO] 흑백 전환 기준 임계값 (1 ~ 255)
     * [EN] Threshold value for binary conversion (1 ~ 255)
     * @defaultValue 128
     */
    threshold: number
}

/**
 * [KO] 설정된 임계값을 기준으로 픽셀 휘도를 판별하여 순수 흑색 또는 백색으로 이진화하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that binarizes each pixel into pure black or white based on a luminance threshold value.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
 * effect.threshold = 128;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/threshold/" style="width:100%; height:500px;"></iframe>
 * @category Adjustments
 */
class Threshold extends ASinglePassPostEffect {

    /**
     * [KO] Threshold 인스턴스를 생성합니다.
     * [EN] Creates a Threshold instance.
     *
     * @param redGPUContext -
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

definePositiveNumber(Threshold, [
    {key: 'threshold', value: 128, min: 1, max: 255}
])

Object.freeze(Threshold)
export default Threshold

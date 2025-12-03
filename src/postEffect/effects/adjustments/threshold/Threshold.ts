import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 임계값(Threshold) 후처리 이펙트입니다.
 * 지정한 임계값을 기준으로 픽셀을 흑백으로 변환합니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
 * effect.threshold = 200; // 임계값 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/threshold/"></iframe>
 */
class Threshold extends ASinglePassPostEffect {
    /** 임계값. 기본값 128, 범위 1~255 */
    #threshold: number = 128

    /**
     * Threshold 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_THRESHOLD',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        this.threshold = this.#threshold
    }

    /** 임계값 반환 */
    get threshold(): number {
        return this.#threshold;
    }

    /**
     * 임계값 설정
     * 범위 1~255
     */
    set threshold(value: number) {
        validateNumberRange(value, 1, 255)
        this.#threshold = value;
        this.updateUniform('threshold', value)
    }
}

Object.freeze(Threshold)
export default Threshold

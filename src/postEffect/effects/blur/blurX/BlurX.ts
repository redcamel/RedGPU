import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] X축 방향 블러 후처리 효과를 제공하는 클래스입니다.
 * [EN] Class that provides X-axis blur post-processing effect.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BlurX(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class BlurX extends ASinglePassPostEffect {
    /**
     * [KO] 블러 강도입니다. 기본값은 32입니다.
     * [EN] Blur strength. Default is 32.
     * @private
     */
    #size: number = 32

    /**
     * [KO] BlurX 인스턴스를 생성합니다.
     * [EN] Creates a BlurX instance.
     *
     * @param redGPUContext 
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BLUR_X',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        this.size = this.#size
    }

    /**
     * [KO] 블러 강도를 반환합니다.
     * [EN] Returns the blur strength.
     */
    get size(): number {
        return this.#size;
    }

    /**
     * [KO] 블러 강도를 설정합니다.
     * [EN] Sets the blur strength.
     * 
     * [KO] 최소값은 0입니다.
     * [EN] Minimum value is 0.
     * @param value 
     * [KO] 블러 강도
     * [EN] Blur strength
     */
    set size(value: number) {
        validateNumberRange(value, 0)
        this.#size = value;
        this.updateUniform('size', value)
    }
}

Object.freeze(BlurX)
export default BlurX
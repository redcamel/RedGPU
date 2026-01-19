import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] TAA 전용 샤프닝 후처리 이펙트입니다.
 * [EN] TAA-specific sharpening post-processing effect.
 *
 * [KO] TAA로 인해 발생하는 블러 현상을 복구합니다.
 * [EN] Restores blur caused by TAA.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.TAASharpen(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * @category PostEffect
 */
class TAASharpen extends ASinglePassPostEffect {
    /**
     * [KO] 샤프닝 강도 (0 ~ 1)
     * [EN] Sharpening strength (0 ~ 1)
     * @defaultValue 0.5
     */
    #sharpness: number = 0.5

    /**
     * [KO] TAASharpen 인스턴스를 생성합니다.
     * [EN] Creates a TAASharpen instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TAA_SHARPEN',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        // 기본값 적용
        this.sharpness = 0.5;
    }

    /**
     * [KO] 샤프닝 강도를 반환합니다.
     * [EN] Returns the sharpening strength.
     */
    get sharpness(): number {
        return this.#sharpness;
    }

    /**
     * [KO] 샤프닝 강도를 설정합니다. (0 ~ 1)
     * [EN] Sets the sharpening strength. (0 ~ 1)
     */
    set sharpness(value: number) {
        validateNumberRange(value, 0, 1)
        this.#sharpness = value;
        this.updateUniform('sharpness', value)
    }
}

Object.freeze(TAASharpen)
export default TAASharpen
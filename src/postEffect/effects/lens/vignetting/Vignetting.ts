import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 비네팅(Vignetting) 후처리 이펙트입니다.
 * [EN] Vignetting post-processing effect.
 *
 * [KO] 화면 가장자리를 어둡게 하여 집중도를 높이는 효과를 만듭니다.
 * [EN] Creates an effect that darkens the edges of the screen to increase focus.
 * 
 * [KO] size(범위), smoothness(부드러움)를 조절할 수 있습니다.
 * [EN] Can adjust size (range) and smoothness.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
 * effect.size = 0.6;        // 비네팅 범위
 * effect.smoothness = 0.3;  // 경계 부드러움
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class Vignetting extends ASinglePassPostEffect {
    #smoothness: number = 0.2
    #size: number = 0.5

    /**
     * [KO] Vignetting 인스턴스를 생성합니다.
     * [EN] Creates a Vignetting instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_VIGNETTING',
            createBasicPostEffectCode(this, computeCode, uniformStructCode),
        )
        this.smoothness = this.#smoothness
        this.size = this.#size
    }

    /** 
     * [KO] 비네팅 범위
     * [EN] Vignetting size
     */
    get size(): number {
        return this.#size;
    }

    /**
     * [KO] 비네팅 범위를 설정합니다.
     * [EN] Sets the vignetting size.
     * 
     * [KO] 최소값: 0
     * [EN] Minimum value: 0
     */
    set size(value: number) {
        validateNumberRange(value, 0,)
        this.#size = value;
        this.updateUniform('size', value)
    }

    /** 
     * [KO] 비네팅 부드러움
     * [EN] Vignetting smoothness
     */
    get smoothness(): number {
        return this.#smoothness;
    }

    /**
     * [KO] 비네팅 부드러움을 설정합니다.
     * [EN] Sets the vignetting smoothness.
     * 
     * [KO] 범위: 0~1
     * [EN] Range: 0~1
     */
    set smoothness(value: number) {
        validateNumberRange(value, 0, 1)
        this.#smoothness = value;
        this.updateUniform('smoothness', value)
    }
}

Object.freeze(Vignetting)
export default Vignetting
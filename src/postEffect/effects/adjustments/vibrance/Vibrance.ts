import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 바이브런스/채도(Vibrance/Saturation) 후처리 이펙트입니다.
 * [EN] Vibrance/Saturation post-processing effect.
 *
 * [KO] 채도와 바이브런스를 각각 조절할 수 있습니다.
 * [EN] Can adjust Saturation and Vibrance respectively.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;    // 바이브런스 증가
 * effect.saturation = 20;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class Vibrance extends ASinglePassPostEffect {
    /** 
     * [KO] 바이브런스. 기본값 0
     * [EN] Vibrance. Default 0
     */
    #vibrance: number = 0
    /** 
     * [KO] 채도. 기본값 0
     * [EN] Saturation. Default 0
     */
    #saturation: number = 0

    /**
     * [KO] Vibrance 인스턴스를 생성합니다.
     * [EN] Creates a Vibrance instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_VIBRANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

    /** 
     * [KO] 바이브런스
     * [EN] Vibrance
     */
    get vibrance(): number {
        return this.#vibrance;
    }

    /**
     * [KO] 바이브런스를 설정합니다.
     * [EN] Sets the vibrance.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set vibrance(value: number) {
        validateNumberRange(value, -100, 100)
        this.#vibrance = value;
        this.updateUniform('vibrance', value)
    }

    /** 
     * [KO] 채도
     * [EN] Saturation
     */
    get saturation(): number {
        return this.#saturation;
    }

    /**
     * [KO] 채도를 설정합니다.
     * [EN] Sets the saturation.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set saturation(value: number) {
        validateNumberRange(value, -100, 100)
        this.#saturation = value;
        this.updateUniform('saturation', value)
    }
}

Object.freeze(Vibrance)
export default Vibrance
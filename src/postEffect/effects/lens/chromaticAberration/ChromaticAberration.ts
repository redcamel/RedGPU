import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 색수차(Chromatic Aberration) 후처리 이펙트입니다.
 * [EN] Chromatic Aberration post-processing effect.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
 * effect.strength = 0.02;
 * effect.centerX = 0.5;
 * effect.centerY = 0.5;
 * effect.falloff = 1.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class ChromaticAberration extends ASinglePassPostEffect {
    /** 
     * [KO] 강도. 기본값 0.015
     * [EN] Strength. Default 0.015
     */
    #strength: number = 0.015
    /** 
     * [KO] 중심 X. 기본값 0.5
     * [EN] Center X. Default 0.5
     */
    #centerX: number = 0.5
    /** 
     * [KO] 중심 Y. 기본값 0.5
     * [EN] Center Y. Default 0.5
     */
    #centerY: number = 0.5
    /** 
     * [KO] falloff. 기본값 1.0
     * [EN] falloff. Default 1.0
     */
    #falloff: number = 1.0

    /**
     * [KO] ChromaticAberration 인스턴스를 생성합니다.
     * [EN] Creates a ChromaticAberration instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_CHROMATIC_ABERRATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        this.strength = this.#strength
        this.centerX = this.#centerX
        this.centerY = this.#centerY
        this.falloff = this.#falloff
    }

    /** 
     * [KO] 강도
     * [EN] Strength
     */
    get strength(): number {
        return this.#strength;
    }

    /**
     * [KO] 강도를 설정합니다.
     * [EN] Sets the strength.
     * 
     * [KO] 최소값: 0
     * [EN] Minimum value: 0
     */
    set strength(value: number) {
        validateNumberRange(value, 0)
        this.#strength = value;
        this.updateUniform('strength', value)
    }

    /** 
     * [KO] 중심 X
     * [EN] Center X
     */
    get centerX(): number {
        return this.#centerX;
    }

    /**
     * [KO] 중심 X를 설정합니다.
     * [EN] Sets the Center X.
     * 
     * [KO] 범위: 0~1
     * [EN] Range: 0~1
     */
    set centerX(value: number) {
        validateNumberRange(value, 0, 1)
        this.#centerX = value;
        this.updateUniform('centerX', value)
    }

    /** 
     * [KO] 중심 Y
     * [EN] Center Y
     */
    get centerY(): number {
        return this.#centerY;
    }

    /**
     * [KO] 중심 Y를 설정합니다.
     * [EN] Sets the Center Y.
     * 
     * [KO] 범위: 0~1
     * [EN] Range: 0~1
     */
    set centerY(value: number) {
        validateNumberRange(value, 0, 1)
        this.#centerY = value;
        this.updateUniform('centerY', value)
    }

    /** 
     * [KO] falloff
     * [EN] falloff
     */
    get falloff(): number {
        return this.#falloff;
    }

    /**
     * [KO] falloff를 설정합니다.
     * [EN] Sets the falloff.
     * 
     * [KO] 범위: 0~5
     * [EN] Range: 0~5
     */
    set falloff(value: number) {
        validateNumberRange(value, 0, 5)
        this.#falloff = value;
        this.updateUniform('falloff', value)
    }
}

Object.freeze(ChromaticAberration)
export default ChromaticAberration
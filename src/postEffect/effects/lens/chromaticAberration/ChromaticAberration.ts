import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 색수차(Chromatic Aberration) 후처리 이펙트입니다.
 * [EN] Chromatic Aberration post-processing effect.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
 * effect.strength = 0.02;
 * effect.centerX = 0.5;
 * effect.centerY = 0.5;
 * effect.falloff = 1.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/chromaticAberration/"></iframe>
 * @category Lens
 */
class ChromaticAberration extends ASinglePassPostEffect {
    /**
     * [KO] 강도 (최소 0)
     * [EN] Strength (Minimum 0)
     * @defaultValue 0.015
     */
    #strength: number = 0.015
    /**
     * [KO] 중심 X (0 ~ 1)
     * [EN] Center X (0 ~ 1)
     * @defaultValue 0.5
     */
    #centerX: number = 0.5
    /**
     * [KO] 중심 Y (0 ~ 1)
     * [EN] Center Y (0 ~ 1)
     * @defaultValue 0.5
     */
    #centerY: number = 0.5
    /**
     * [KO] 감쇠율 (0 ~ 5)
     * [EN] Falloff (0 ~ 5)
     * @defaultValue 1.0
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
     * [KO] 강도 값을 반환합니다.
     * [EN] Returns the strength value.
     */
    get strength(): number {
        return this.#strength;
    }

    /**
     * [KO] 강도 값을 설정합니다. (최소 0)
     * [EN] Sets the strength value. (Minimum 0)
     */
    set strength(value: number) {
        validateNumberRange(value, 0)
        this.#strength = value;
        this.updateUniform('strength', value)
    }

    /**
     * [KO] 중심 X 좌표를 반환합니다.
     * [EN] Returns the center X coordinate.
     */
    get centerX(): number {
        return this.#centerX;
    }

    /**
     * [KO] 중심 X 좌표를 설정합니다. (0 ~ 1)
     * [EN] Sets the center X coordinate. (0 ~ 1)
     */
    set centerX(value: number) {
        validateNumberRange(value, 0, 1)
        this.#centerX = value;
        this.updateUniform('centerX', value)
    }

    /**
     * [KO] 중심 Y 좌표를 반환합니다.
     * [EN] Returns the center Y coordinate.
     */
    get centerY(): number {
        return this.#centerY;
    }

    /**
     * [KO] 중심 Y 좌표를 설정합니다. (0 ~ 1)
     * [EN] Sets the center Y coordinate. (0 ~ 1)
     */
    set centerY(value: number) {
        validateNumberRange(value, 0, 1)
        this.#centerY = value;
        this.updateUniform('centerY', value)
    }

    /**
     * [KO] 감쇠율을 반환합니다.
     * [EN] Returns the falloff.
     */
    get falloff(): number {
        return this.#falloff;
    }

    /**
     * [KO] 감쇠율을 설정합니다. (0 ~ 5)
     * [EN] Sets the falloff. (0 ~ 5)
     */
    set falloff(value: number) {
        validateNumberRange(value, 0, 5)
        this.#falloff = value;
        this.updateUniform('falloff', value)
    }
}

Object.freeze(ChromaticAberration)
export default ChromaticAberration

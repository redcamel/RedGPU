import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 방사형 블러(Radial Blur) 후처리 이펙트입니다.
 * [EN] Radial Blur post-processing effect.
 *
 * [KO] 중심점, 강도, 샘플 수를 조절해 원형으로 퍼지는 블러 효과를 만듭니다.
 * [EN] Creates a circular spreading blur effect by adjusting center point, strength, and sample count.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * effect.sampleCount = 32; // 샘플 수
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class RadialBlur extends ASinglePassPostEffect {
    /** 
     * [KO] 블러 강도. 기본값 50
     * [EN] Blur strength. Default 50
     */
    #amount: number = 50
    /** 
     * [KO] 중심 X. 기본값 0
     * [EN] Center X. Default 0
     */
    #centerX: number = 0
    /** 
     * [KO] 중심 Y. 기본값 0
     * [EN] Center Y. Default 0
     */
    #centerY: number = 0
    /** 
     * [KO] 샘플 수. 기본값 16
     * [EN] Sample count. Default 16
     */
    #sampleCount: number = 16

    /**
     * [KO] RadialBlur 인스턴스를 생성합니다.
     * [EN] Creates a RadialBlur instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_RADIAL_BLUR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        this.amount = this.#amount
        this.sampleCount = this.#sampleCount
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
     */
    set centerX(value: number) {
        validateNumber(value)
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
     */
    set centerY(value: number) {
        validateNumber(value)
        this.#centerY = value;
        this.updateUniform('centerY', value)
    }

    /** 
     * [KO] 블러 강도
     * [EN] Blur strength
     */
    get amount(): number {
        return this.#amount;
    }

    /**
     * [KO] 블러 강도를 설정합니다.
     * [EN] Sets the blur strength.
     * 
     * [KO] 최소값: 0
     * [EN] Minimum value: 0
     */
    set amount(value: number) {
        validateNumberRange(value, 0)
        this.#amount = value;
        this.updateUniform('amount', value)
    }

    /** 
     * [KO] 샘플 수
     * [EN] Sample count
     */
    get sampleCount(): number {
        return this.#sampleCount;
    }

    /**
     * [KO] 샘플 수를 설정합니다.
     * [EN] Sets the sample count.
     * 
     * [KO] 최소값: 4
     * [EN] Minimum value: 4
     */
    set sampleCount(value: number) {
        validateNumberRange(value, 4)
        this.#sampleCount = value;
        this.updateUniform('sampleCount', value)
    }
}

Object.freeze(RadialBlur)
export default RadialBlur
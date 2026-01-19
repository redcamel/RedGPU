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
 * [EN] Creates a circular spreading blur effect by adjusting the center point, strength, and sample count.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * effect.sampleCount = 32; // 샘플 수
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/radialBlur/"></iframe>
 * @category Blur
 */
class RadialBlur extends ASinglePassPostEffect {
    /**
     * [KO] 블러 강도 (최소 0)
     * [EN] Blur strength (Minimum 0)
     * @defaultValue 50
     */
    #amount: number = 50
    /**
     * [KO] 중심 X (0~1)
     * [EN] Center X (0~1)
     * @defaultValue 0
     */
    #centerX: number = 0
    /**
     * [KO] 중심 Y (0~1)
     * [EN] Center Y (0~1)
     * @defaultValue 0
     */
    #centerY: number = 0
    /**
     * [KO] 샘플 수 (최소 4)
     * [EN] Sample count (Minimum 4)
     * @defaultValue 16
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
     * [KO] 중심 X 좌표를 반환합니다.
     * [EN] Returns the center X coordinate.
     */
    get centerX(): number {
        return this.#centerX;
    }

    /**
     * [KO] 중심 X 좌표를 설정합니다.
     * [EN] Sets the center X coordinate.
     */
    set centerX(value: number) {
        validateNumber(value)
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
     * [KO] 중심 Y 좌표를 설정합니다.
     * [EN] Sets the center Y coordinate.
     */
    set centerY(value: number) {
        validateNumber(value)
        this.#centerY = value;
        this.updateUniform('centerY', value)
    }

    /**
     * [KO] 블러 강도를 반환합니다.
     * [EN] Returns the blur strength.
     */
    get amount(): number {
        return this.#amount;
    }

    /**
     * [KO] 블러 강도를 설정합니다. (최소 0)
     * [EN] Sets the blur strength. (Minimum 0)
     */
    set amount(value: number) {
        validateNumberRange(value, 0)
        this.#amount = value;
        this.updateUniform('amount', value)
    }

    /**
     * [KO] 샘플 수를 반환합니다.
     * [EN] Returns the sample count.
     */
    get sampleCount(): number {
        return this.#sampleCount;
    }

    /**
     * [KO] 샘플 수를 설정합니다. (최소 4)
     * [EN] Sets the sample count. (Minimum 4)
     */
    set sampleCount(value: number) {
        validateNumberRange(value, 4)
        this.#sampleCount = value;
        this.updateUniform('sampleCount', value)
    }
}

Object.freeze(RadialBlur)
export default RadialBlur

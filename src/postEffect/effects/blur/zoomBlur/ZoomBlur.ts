import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 줌 블러(Zoom Blur) 후처리 이펙트입니다.
 * [EN] Zoom Blur post-processing effect.
 *
 * [KO] 중심점에서 방사형으로 퍼지는 블러 효과를 만듭니다.
 * [EN] Creates a blur effect spreading radially from the center point.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class ZoomBlur extends ASinglePassPostEffect {
    /** 
     * [KO] 블러 강도. 기본값 64
     * [EN] Blur strength. Default 64
     */
    #amount: number = 64
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
     * [KO] ZoomBlur 인스턴스를 생성합니다.
     * [EN] Creates a ZoomBlur instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_ZOOM_BLUR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        this.amount = this.#amount
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
}

Object.freeze(ZoomBlur)
export default ZoomBlur
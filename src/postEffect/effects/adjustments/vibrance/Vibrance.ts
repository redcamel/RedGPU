import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 바이브런스/채도(Vibrance/Saturation) 후처리 이펙트입니다.
 * 채도와 바이브런스를 각각 조절할 수 있습니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;    // 바이브런스 증가
 * effect.saturation = 20;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/vibrance/"></iframe>
 */
class Vibrance extends ASinglePassPostEffect {
    /** 바이브런스. 기본값 0, 범위 -100~100 */
    #vibrance: number = 0
    /** 채도. 기본값 0, 범위 -100~100 */
    #saturation: number = 0

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_VIBRANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

    /** 바이브런스 반환 */
    get vibrance(): number {
        return this.#vibrance;
    }

    /**
     * 바이브런스 설정
     * 범위 -100~100
     */
    set vibrance(value: number) {
        validateNumberRange(value, -100, 100)
        this.#vibrance = value;
        this.updateUniform('vibrance', value)
    }

    /** 채도 반환 */
    get saturation(): number {
        return this.#saturation;
    }

    /**
     * 채도 설정
     * 범위 -100~100
     */
    set saturation(value: number) {
        validateNumberRange(value, -100, 100)
        this.#saturation = value;
        this.updateUniform('saturation', value)
    }
}

Object.freeze(Vibrance)
export default Vibrance

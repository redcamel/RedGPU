import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 비네팅(Vignetting) 후처리 이펙트입니다.
 * 화면 가장자리를 어둡게 하여 집중도를 높이는 효과를 만듭니다.
 * size(범위), smoothness(부드러움)를 조절할 수 있습니다.
 *
 * @category Lens
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
 * effect.size = 0.6;        // 비네팅 범위
 * effect.smoothness = 0.3;  // 경계 부드러움
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/lens/vignetting/"></iframe>
 */
class Vignetting extends ASinglePassPostEffect {
    #smoothness: number = 0.2
    #size: number = 0.5

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

    /** 비네팅 범위 반환 */
    get size(): number {
        return this.#size;
    }

    /**
     * 비네팅 범위 설정
     * 최소값 0
     */
    set size(value: number) {
        validateNumberRange(value, 0,)
        this.#size = value;
        this.updateUniform('size', value)
    }

    /** 비네팅 부드러움 반환 */
    get smoothness(): number {
        return this.#smoothness;
    }

    /**
     * 비네팅 부드러움 설정
     * 범위 0~1
     */
    set smoothness(value: number) {
        validateNumberRange(value, 0, 1)
        this.#smoothness = value;
        this.updateUniform('smoothness', value)
    }
}

Object.freeze(Vignetting)
export default Vignetting

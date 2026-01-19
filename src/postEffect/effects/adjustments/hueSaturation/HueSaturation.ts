import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 색상/채도(Hue/Saturation) 후처리 이펙트입니다.
 * [EN] Hue/Saturation post-processing effect.
 *
 * [KO] 색상(Hue)과 채도(Saturation)를 조절할 수 있습니다.
 * [EN] Can adjust Hue and Saturation.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
 * effect.hue = 90;         // 색상 회전
 * effect.saturation = 50;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class HueSaturation extends ASinglePassPostEffect {
    /** 
     * [KO] 색상(Hue). 기본값 0
     * [EN] Hue. Default 0
     */
    #hue: number = 0
    /** 
     * [KO] 채도(Saturation). 기본값 0
     * [EN] Saturation. Default 0
     */
    #saturation: number = 0

    /**
     * [KO] HueSaturation 인스턴스를 생성합니다.
     * [EN] Creates a HueSaturation instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_HUE_SATURATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

    /** 
     * [KO] 색상
     * [EN] Hue
     */
    get hue(): number {
        return this.#hue;
    }

    /**
     * [KO] 색상을 설정합니다.
     * [EN] Sets the hue.
     * 
     * [KO] 범위: -180~180
     * [EN] Range: -180~180
     */
    set hue(value: number) {
        validateNumberRange(value, -180, 180)
        this.#hue = value;
        this.updateUniform('hue', value)
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

Object.freeze(HueSaturation)
export default HueSaturation
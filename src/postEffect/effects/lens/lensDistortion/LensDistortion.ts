import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 렌즈 왜곡(Lens Distortion) 후처리 이펙트입니다.
 * [EN] Lens Distortion post-processing effect.
 *
 * [KO] 배럴/핀쿠션 왜곡, 중심 위치를 조절할 수 있습니다.
 * [EN] Can adjust Barrel/Pincushion distortion and center position.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
 * effect.barrelStrength = 0.2;      // 배럴 왜곡 강도
 * effect.pincushionStrength = 0.1;  // 핀쿠션 왜곡 강도
 * effect.centerX = 0.5;             // 왜곡 중심 X
 * effect.centerY = 0.5;             // 왜곡 중심 Y
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class LensDistortion extends ASinglePassPostEffect {
    /** 
     * [KO] 배럴 왜곡 강도. 기본값 0.1
     * [EN] Barrel distortion strength. Default 0.1
     */
    #barrelStrength: number = 0.1
    /** 
     * [KO] 핀쿠션 왜곡 강도. 기본값 0.0
     * [EN] Pincushion distortion strength. Default 0.0
     */
    #pincushionStrength: number = 0.0
    /** 
     * [KO] 왜곡 중심 X. 기본값 0
     * [EN] Distortion center X. Default 0
     */
    #centerX: number = 0
    /** 
     * [KO] 왜곡 중심 Y. 기본값 0
     * [EN] Distortion center Y. Default 0
     */
    #centerY: number = 0

    /**
     * [KO] LensDistortion 인스턴스를 생성합니다.
     * [EN] Creates a LensDistortion instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_LENS_DISTORTION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode),
        )
        this.barrelStrength = this.#barrelStrength
        this.pincushionStrength = this.#pincushionStrength
        this.centerX = this.#centerX
        this.centerY = this.#centerY
    }

    /** 
     * [KO] 배럴 왜곡 강도
     * [EN] Barrel distortion strength
     */
    get barrelStrength(): number {
        return this.#barrelStrength;
    }

    /**
     * [KO] 배럴 왜곡 강도를 설정합니다.
     * [EN] Sets the barrel distortion strength.
     * 
     * [KO] 최소값: 0
     * [EN] Minimum value: 0
     */
    set barrelStrength(value: number) {
        validateNumberRange(value, 0)
        this.#barrelStrength = value;
        this.updateUniform('barrelStrength', value)
    }

    /** 
     * [KO] 핀쿠션 왜곡 강도
     * [EN] Pincushion distortion strength
     */
    get pincushionStrength(): number {
        return this.#pincushionStrength;
    }

    /**
     * [KO] 핀쿠션 왜곡 강도를 설정합니다.
     * [EN] Sets the pincushion distortion strength.
     * 
     * [KO] 최소값: 0
     * [EN] Minimum value: 0
     */
    set pincushionStrength(value: number) {
        validateNumberRange(value, 0)
        this.#pincushionStrength = value;
        this.updateUniform('pincushionStrength', value)
    }

    /** 
     * [KO] 왜곡 중심 X
     * [EN] Distortion center X
     */
    get centerX(): number {
        return this.#centerX;
    }

    /**
     * [KO] 왜곡 중심 X를 설정합니다.
     * [EN] Sets the distortion center X.
     */
    set centerX(value: number) {
        validateNumber(value)
        this.#centerX = value;
        this.updateUniform('centerX', value)
    }

    /** 
     * [KO] 왜곡 중심 Y
     * [EN] Distortion center Y
     */
    get centerY(): number {
        return this.#centerY;
    }

    /**
     * [KO] 왜곡 중심 Y를 설정합니다.
     * [EN] Sets the distortion center Y.
     */
    set centerY(value: number) {
        validateNumber(value)
        this.#centerY = value;
        this.updateUniform('centerY', value)
    }
}

Object.freeze(LensDistortion)
export default LensDistortion
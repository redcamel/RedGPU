import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 색온도/틴트(Color Temperature/Tint) 후처리 이펙트입니다.
 * [EN] Color Temperature/Tint post-processing effect.
 *
 * [KO] 색온도(Kelvin), 틴트(그린/마젠타), 강도 값을 조절할 수 있습니다.
 * [EN] Can adjust Color Temperature (Kelvin), Tint (Green/Magenta), and Strength.
 * 
 * [KO] 다양한 조명 환경 프리셋 메서드를 제공합니다.
 * [EN] Provides various lighting environment preset methods.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
 * effect.temperature = 3200; // 따뜻한 색감
 * effect.tint = -10;         // 마젠타 계열
 * effect.strength = 80;      // 효과 강도
 * effect.setDaylight();      // 프리셋 사용
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class ColorTemperatureTint extends ASinglePassPostEffect {
    /** 
     * [KO] 색온도(K). 기본값 6500
     * [EN] Color temperature (K). Default 6500
     */
    #temperature: number = 6500
    /** 
     * [KO] 틴트. 기본값 0
     * [EN] Tint. Default 0
     */
    #tint: number = 0
    /** 
     * [KO] 효과 강도. 기본값 100
     * [EN] Effect strength. Default 100
     */
    #strength: number = 100

    /**
     * [KO] ColorTemperatureTint 인스턴스를 생성합니다.
     * [EN] Creates a ColorTemperatureTint instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_COLOR_TEMPERATURE_TINT',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        this.strength = this.#strength
        this.tint = this.#tint
        this.temperature = this.#temperature
    }

    /** 
     * [KO] 색온도
     * [EN] Color temperature
     */
    get temperature(): number {
        return this.#temperature;
    }

    /**
     * [KO] 색온도를 설정합니다.
     * [EN] Sets the color temperature.
     * 
     * [KO] 범위: 1000~20000
     * [EN] Range: 1000~20000
     */
    set temperature(value: number) {
        validateNumberRange(value, 1000, 20000)
        this.#temperature = value;
        this.updateUniform('temperature', value)
    }

    /** 
     * [KO] 틴트
     * [EN] Tint
     */
    get tint(): number {
        return this.#tint;
    }

    /**
     * [KO] 틴트를 설정합니다.
     * [EN] Sets the tint.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set tint(value: number) {
        validateNumberRange(value, -100, 100)
        this.#tint = value;
        this.updateUniform('tint', value)
    }

    /** 
     * [KO] 효과 강도
     * [EN] Effect strength
     */
    get strength(): number {
        return this.#strength;
    }

    /**
     * [KO] 효과 강도를 설정합니다.
     * [EN] Sets the effect strength.
     * 
     * [KO] 범위: 0~100
     * [EN] Range: 0~100
     */
    set strength(value: number) {
        validateNumberRange(value, 0, 100)
        this.#strength = value;
        this.updateUniform('strength', value)
    }

    // 편의 메서드들
    /** 
     * [KO] 따뜻한 색감 프리셋을 적용합니다.
     * [EN] Applies warm tone preset.
     */
    setWarmTone() {
        this.temperature = 3200;
        this.tint = -10;
    }

    /** 
     * [KO] 차가운 색감 프리셋을 적용합니다.
     * [EN] Applies cool tone preset.
     */
    setCoolTone() {
        this.temperature = 8000;
        this.tint = 10;
    }

    /** 
     * [KO] 뉴트럴 프리셋을 적용합니다.
     * [EN] Applies neutral preset.
     */
    setNeutral() {
        this.temperature = 6500;
        this.tint = 0;
    }

    /** 
     * [KO] 촛불 조명 프리셋을 적용합니다.
     * [EN] Applies candle light preset.
     */
    setCandleLight() {
        this.temperature = 1900;
        this.tint = -5;
    }

    /** 
     * [KO] 주간광 프리셋을 적용합니다.
     * [EN] Applies daylight preset.
     */
    setDaylight() {
        this.temperature = 5600;
        this.tint = 0;
    }

    /** 
     * [KO] 흐린날 프리셋을 적용합니다.
     * [EN] Applies cloudy day preset.
     */
    setCloudyDay() {
        this.temperature = 7500;
        this.tint = 5;
    }

    /** 
     * [KO] 네온 조명 프리셋을 적용합니다.
     * [EN] Applies neon light preset.
     */
    setNeonLight() {
        this.temperature = 9000;
        this.tint = 15;
    }
}

Object.freeze(ColorTemperatureTint)
export default ColorTemperatureTint
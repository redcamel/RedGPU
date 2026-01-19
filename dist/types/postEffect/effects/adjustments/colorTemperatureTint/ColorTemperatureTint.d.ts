import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 색온도/틴트(Color Temperature/Tint) 후처리 이펙트입니다.
 * [EN] Color Temperature/Tint post-processing effect.
 *
 * [KO] 색온도(Kelvin), 틴트(그린/마젠타), 강도 값을 조절할 수 있습니다.
 * [EN] Can adjust Color Temperature (Kelvin), Tint (Green/Magenta), and Strength.
 *
 * [KO] 다양한 조명 환경 프리셋 메서드를 제공합니다.
 * [EN] Provides various lighting environment preset methods.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
 * effect.temperature = 3200; // 따뜻한 색감
 * effect.tint = -10;         // 마젠타 계열
 * effect.strength = 80;      // 효과 강도
 * effect.setDaylight();      // 프리셋 사용
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/"></iframe>
 * @category Adjustments
 */
declare class ColorTemperatureTint extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] ColorTemperatureTint 인스턴스를 생성합니다.
     * [EN] Creates a ColorTemperatureTint instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 색온도 값을 반환합니다.
     * [EN] Returns the color temperature value.
     */
    get temperature(): number;
    /**
     * [KO] 색온도 값을 설정합니다. (1000 ~ 20000)
     * [EN] Sets the color temperature value. (1000 ~ 20000)
     */
    set temperature(value: number);
    /**
     * [KO] 틴트 값을 반환합니다.
     * [EN] Returns the tint value.
     */
    get tint(): number;
    /**
     * [KO] 틴트 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the tint value. (-100 ~ 100)
     */
    set tint(value: number);
    /**
     * [KO] 효과 강도를 반환합니다.
     * [EN] Returns the effect strength.
     */
    get strength(): number;
    /**
     * [KO] 효과 강도를 설정합니다. (0 ~ 100)
     * [EN] Sets the effect strength. (0 ~ 100)
     */
    set strength(value: number);
    /**
     * [KO] 따뜻한 색감 프리셋을 적용합니다.
     * [EN] Applies the Warm Tone preset.
     */
    setWarmTone(): void;
    /**
     * [KO] 차가운 색감 프리셋을 적용합니다.
     * [EN] Applies the Cool Tone preset.
     */
    setCoolTone(): void;
    /**
     * [KO] 뉴트럴 프리셋을 적용합니다.
     * [EN] Applies the Neutral preset.
     */
    setNeutral(): void;
    /**
     * [KO] 촛불 조명 프리셋을 적용합니다.
     * [EN] Applies the Candle Light preset.
     */
    setCandleLight(): void;
    /**
     * [KO] 주간광 프리셋을 적용합니다.
     * [EN] Applies the Daylight preset.
     */
    setDaylight(): void;
    /**
     * [KO] 흐린날 프리셋을 적용합니다.
     * [EN] Applies the Cloudy Day preset.
     */
    setCloudyDay(): void;
    /**
     * [KO] 네온 조명 프리셋을 적용합니다.
     * [EN] Applies the Neon Light preset.
     */
    setNeonLight(): void;
}
export default ColorTemperatureTint;

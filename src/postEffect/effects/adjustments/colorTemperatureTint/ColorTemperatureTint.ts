import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";

interface ColorTemperatureTint {
    amount: number;
    temperature: number;
    tint: number;
}

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
 * effect.amount = 0.8;       // 효과 강도 (0 ~ 1)
 * effect.setDaylight();      // 프리셋 사용
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/"></iframe>
 * @category Adjustments
 */
class ColorTemperatureTint extends ASinglePassPostEffect {


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
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_COLOR_TEMPERATURE_TINT',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

        this.temperature = 6500;
        this.amount = 1;
        this.tint = 0;
    }


    // 편의 메서드들
    /**
     * [KO] 따뜻한 색감 프리셋을 적용합니다.
     * [EN] Applies the Warm Tone preset.
     */
    setWarmTone() {
        this.temperature = 3200;
        this.tint = -10;
    }

    /**
     * [KO] 차가운 색감 프리셋을 적용합니다.
     * [EN] Applies the Cool Tone preset.
     */
    setCoolTone() {
        this.temperature = 8000;
        this.tint = 10;
    }

    /**
     * [KO] 뉴트럴 프리셋을 적용합니다.
     * [EN] Applies the Neutral preset.
     */
    setNeutral() {
        this.temperature = 6500;
        this.tint = 0;
    }

    /**
     * [KO] 촛불 조명 프리셋을 적용합니다.
     * [EN] Applies the Candle Light preset.
     */
    setCandleLight() {
        this.temperature = 1900;
        this.tint = -5;
    }

    /**
     * [KO] 주간광 프리셋을 적용합니다.
     * [EN] Applies the Daylight preset.
     */
    setDaylight() {
        this.temperature = 5600;
        this.tint = 0;
    }

    /**
     * [KO] 흐린날 프리셋을 적용합니다.
     * [EN] Applies the Cloudy Day preset.
     */
    setCloudyDay() {
        this.temperature = 7500;
        this.tint = 5;
    }

    /**
     * [KO] 네온 조명 프리셋을 적용합니다.
     * [EN] Applies the Neon Light preset.
     */
    setNeonLight() {
        this.temperature = 9000;
        this.tint = 15;
    }
}

DefineGPUProperty.definePositiveNumber(ColorTemperatureTint, [
    /**
     * [KO] 색온도(K) (1000 ~ 20000)
     * [EN] Color Temperature (K) (1000 ~ 20000)
     * @defaultValue 6500
     */
    {key: 'temperature', value: 6500, min: 1000, max: 20000},
    /**
     * [KO] 효과 적용 강도 (0 ~ 1)
     * [EN] Effect amount (0 ~ 1)
     * @defaultValue 1
     */
    {key: 'amount', value: 1, min: 0, max: 1},
])
DefineGPUProperty.defineNumber(ColorTemperatureTint, [
    /**
     * [KO] 틴트 (-100 ~ 100)
     * [EN] Tint (-100 ~ 100)
     * @defaultValue 0
     */
    {key: 'tint', value: 0, min: -100, max: 100},
])
Object.freeze(ColorTemperatureTint)
export default ColorTemperatureTint

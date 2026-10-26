import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";


interface ColorTemperatureTint {
    /**
     * [KO] 효과 적용 강도 (0 ~ 1)
     * [EN] Effect application intensity (0 ~ 1)
     * @defaultValue 1
     */
    amount: number;
    /**
     * [KO] 색온도 값 (단위: 캘빈, 1000 ~ 20000)
     * [EN] Color temperature value (unit: Kelvin, 1000 ~ 20000)
     * @defaultValue 6500
     */
    temperature: number;
    /**
     * [KO] 틴트 조절 값 (-100 ~ 100)
     * [EN] Tint adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    tint: number;
}

/**
 * [KO] 캘빈(Kelvin) 색온도와 틴트를 기반으로 이미지의 화이트 밸런스 및 전체 색감을 조절하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that adjusts the white balance and overall color tone of an image based on Kelvin color temperature and tint.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
 * effect.temperature = 3200;
 * effect.tint = -10;
 * effect.amount = 0.8;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/" style="width:100%; height:500px;"></iframe>
 *
 * @see [ColorTemperatureTint example](/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/)
 * @category Adjustments
 */
class ColorTemperatureTint extends ASinglePassPostEffect {

    /**
     * [KO] ColorTemperatureTint 인스턴스를 생성합니다.
     * [EN] Creates a ColorTemperatureTint instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_COLOR_TEMPERATURE_TINT',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

        this.temperature = 6500;
        this.amount = 1;
        this.tint = 0;
    }

    /**
     * [KO] 따뜻한 색감 프리셋(3200K, 틴트 -10)을 적용합니다.
     * [EN] Applies the Warm Tone preset (3200K, tint -10).
     */
    setWarmTone() {
        this.temperature = 3200;
        this.tint = -10;
    }

    /**
     * [KO] 차가운 색감 프리셋(8000K, 틴트 10)을 적용합니다.
     * [EN] Applies the Cool Tone preset (8000K, tint 10).
     */
    setCoolTone() {
        this.temperature = 8000;
        this.tint = 10;
    }

    /**
     * [KO] 표준 주간광 프리셋(6500K, 틴트 0)을 적용합니다.
     * [EN] Applies the Neutral preset (6500K, tint 0).
     */
    setNeutral() {
        this.temperature = 6500;
        this.tint = 0;
    }

    /**
     * [KO] 촛불 조명 프리셋(1900K, 틴트 -5)을 적용합니다.
     * [EN] Applies the Candle Light preset (1900K, tint -5).
     */
    setCandleLight() {
        this.temperature = 1900;
        this.tint = -5;
    }

    /**
     * [KO] 맑은 날 주간광 프리셋(5600K, 틴트 0)을 적용합니다.
     * [EN] Applies the Daylight preset (5600K, tint 0).
     */
    setDaylight() {
        this.temperature = 5600;
        this.tint = 0;
    }

    /**
     * [KO] 흐린 날 프리셋(7500K, 틴트 5)을 적용합니다.
     * [EN] Applies the Cloudy Day preset (7500K, tint 5).
     */
    setCloudyDay() {
        this.temperature = 7500;
        this.tint = 5;
    }

    /**
     * [KO] 네온 조명 프리셋(9000K, 틴트 15)을 적용합니다.
     * [EN] Applies the Neon Light preset (9000K, tint 15).
     */
    setNeonLight() {
        this.temperature = 9000;
        this.tint = 15;
    }
}

definePositiveNumber(ColorTemperatureTint, [
    {key: 'temperature', value: 6500, min: 1000, max: 20000},
    {key: 'amount', value: 1, min: 0, max: 1},
])
defineNumber(ColorTemperatureTint, [
    {key: 'tint', value: 0, min: -100, max: 100},
])
Object.freeze(ColorTemperatureTint)
export default ColorTemperatureTint

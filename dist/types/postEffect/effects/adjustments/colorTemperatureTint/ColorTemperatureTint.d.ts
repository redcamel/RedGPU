import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface ColorTemperatureTint {
    /** [KO] 효과 적용 강도 (0 ~ 1) [EN] Effect application intensity (0 ~ 1) */
    amount: number;
    /** [KO] 색온도 값 (Kelvin, 1000 ~ 20000). 낮은 값은 따뜻한(붉은) 톤, 높은 값은 차가운(푸른) 톤을 만듭니다. [EN] Color temperature value (Kelvin, 1000 ~ 20000). Lower values create warm (reddish) tones, while higher values create cool (bluish) tones. */
    temperature: number;
    /** [KO] 틴트 조절 값 (-100 ~ 100). 마젠타 계열과 그린 계열 사이의 색조를 미세하게 보정합니다. [EN] Tint adjustment value (-100 ~ 100). Finely corrects the hue between Magenta and Green tones. */
    tint: number;
}
/**
 * [KO] 색온도/틴트(Color Temperature/Tint) 후처리 이펙트입니다.
 * [EN] Color Temperature/Tint post-processing effect.
 *
 * [KO] 이미지의 화이트 밸런스를 시뮬레이션하여 전체적인 색감을 조절합니다. 캘빈(Kelvin) 온도를 기반으로 광원의 특성을 재현하고, 틴트를 통해 녹색이나 보라색 색조를 보정할 수 있습니다.
 * [EN] Simulates the white balance of an image to adjust the overall color feel. It reproduces the characteristics of light sources based on Kelvin temperature and allows for green or purple hue correction via tint.
 *
 * [KO] 이 효과는 LDR 공간에서 동작하여 색온도 변환에 따른 발색이 가장 자연스럽게 나타나도록 설계되었습니다.
 * [EN] This effect operates in LDR space, ensuring the most natural color reproduction during temperature transformation.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
 * effect.temperature = 3200; // 따뜻한 실내 조명 느낌
 * effect.tint = -10;         // 미세한 마젠타 보정
 * effect.amount = 0.8;       // 효과 강도
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorTemperatureTint/"></iframe>
 * @category Adjustments
 */
declare class ColorTemperatureTint extends ASinglePassPostEffect {
    /**
     * [KO] ColorTemperatureTint 인스턴스를 생성합니다.
     * [EN] Creates a ColorTemperatureTint instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 따뜻한 색감 프리셋을 적용합니다. (약 3200K)
     * [EN] Applies the Warm Tone preset. (Approx. 3200K)
     */
    setWarmTone(): void;
    /**
     * [KO] 차가운 색감 프리셋을 적용합니다. (약 8000K)
     * [EN] Applies the Cool Tone preset. (Approx. 8000K)
     */
    setCoolTone(): void;
    /**
     * [KO] 표준 주간광 프리셋을 적용합니다. (6500K)
     * [EN] Applies the Neutral preset. (6500K)
     */
    setNeutral(): void;
    /**
     * [KO] 촛불 조명 프리셋을 적용합니다. (1900K)
     * [EN] Applies the Candle Light preset. (1900K)
     */
    setCandleLight(): void;
    /**
     * [KO] 맑은 날 주간광 프리셋을 적용합니다. (5600K)
     * [EN] Applies the Daylight preset. (5600K)
     */
    setDaylight(): void;
    /**
     * [KO] 흐린 날의 차분한 프리셋을 적용합니다. (7500K)
     * [EN] Applies the Cloudy Day preset. (7500K)
     */
    setCloudyDay(): void;
    /**
     * [KO] 강렬한 네온 조명 프리셋을 적용합니다. (9000K)
     * [EN] Applies the Neon Light preset. (9000K)
     */
    setNeonLight(): void;
}
export default ColorTemperatureTint;

import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 색온도/틴트(Color Temperature/Tint) 후처리 이펙트입니다.
 * 색온도(Kelvin), 틴트(그린/마젠타), 강도 값을 조절할 수 있습니다.
 * 다양한 조명 환경 프리셋 메서드를 제공합니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.ColorTemperatureTint(redGPUContext);
 * effect.temperature = 3200; // 따뜻한 색감
 * effect.tint = -10;         // 마젠타 계열
 * effect.strength = 80;      // 효과 강도
 * effect.setDaylight();      // 프리셋 사용
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/colorTemperatureTint/"></iframe>
 */
declare class ColorTemperatureTint extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 색온도 반환 */
    get temperature(): number;
    /** 색온도 설정. 범위 1000~20000 */
    set temperature(value: number);
    /** 틴트 반환 */
    get tint(): number;
    /** 틴트 설정. 범위 -100~100 */
    set tint(value: number);
    /** 효과 강도 반환 */
    get strength(): number;
    /** 효과 강도 설정. 범위 0~100 */
    set strength(value: number);
    /** 따뜻한 색감 프리셋 */
    setWarmTone(): void;
    /** 차가운 색감 프리셋 */
    setCoolTone(): void;
    /** 뉴트럴 프리셋 */
    setNeutral(): void;
    /** 촛불 조명 프리셋 */
    setCandleLight(): void;
    /** 주간광 프리셋 */
    setDaylight(): void;
    /** 흐린날 프리셋 */
    setCloudyDay(): void;
    /** 네온 조명 프리셋 */
    setNeonLight(): void;
}
export default ColorTemperatureTint;

import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
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
class ColorTemperatureTint extends ASinglePassPostEffect {
    /** 색온도(K). 기본값 6500, 범위 1000~20000 */
    #temperature = 6500;
    /** 틴트. 기본값 0, 범위 -100~100 */
    #tint = 0;
    /** 효과 강도. 기본값 100, 범위 0~100 */
    #strength = 100;
    constructor(redGPUContext) {
        super(redGPUContext);
        this.init(redGPUContext, 'POST_EFFECT_COLOR_TEMPERATURE_TINT', createBasicPostEffectCode(this, computeCode, uniformStructCode));
        this.strength = this.#strength;
        this.tint = this.#tint;
        this.temperature = this.#temperature;
    }
    /** 색온도 반환 */
    get temperature() {
        return this.#temperature;
    }
    /** 색온도 설정. 범위 1000~20000 */
    set temperature(value) {
        validateNumberRange(value, 1000, 20000);
        this.#temperature = value;
        this.updateUniform('temperature', value);
    }
    /** 틴트 반환 */
    get tint() {
        return this.#tint;
    }
    /** 틴트 설정. 범위 -100~100 */
    set tint(value) {
        validateNumberRange(value, -100, 100);
        this.#tint = value;
        this.updateUniform('tint', value);
    }
    /** 효과 강도 반환 */
    get strength() {
        return this.#strength;
    }
    /** 효과 강도 설정. 범위 0~100 */
    set strength(value) {
        validateNumberRange(value, 0, 100);
        this.#strength = value;
        this.updateUniform('strength', value);
    }
    // 편의 메서드들
    /** 따뜻한 색감 프리셋 */
    setWarmTone() {
        this.temperature = 3200;
        this.tint = -10;
    }
    /** 차가운 색감 프리셋 */
    setCoolTone() {
        this.temperature = 8000;
        this.tint = 10;
    }
    /** 뉴트럴 프리셋 */
    setNeutral() {
        this.temperature = 6500;
        this.tint = 0;
    }
    /** 촛불 조명 프리셋 */
    setCandleLight() {
        this.temperature = 1900;
        this.tint = -5;
    }
    /** 주간광 프리셋 */
    setDaylight() {
        this.temperature = 5600;
        this.tint = 0;
    }
    /** 흐린날 프리셋 */
    setCloudyDay() {
        this.temperature = 7500;
        this.tint = 5;
    }
    /** 네온 조명 프리셋 */
    setNeonLight() {
        this.temperature = 9000;
        this.tint = 15;
    }
}
Object.freeze(ColorTemperatureTint);
export default ColorTemperatureTint;

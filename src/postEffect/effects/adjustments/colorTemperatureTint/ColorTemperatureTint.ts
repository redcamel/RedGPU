import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class ColorTemperatureTint extends ASinglePassPostEffect {
	#temperature: number = 6500      // 1000 ~ 20000 (Kelvin)
	#tint: number = 0               // -100 ~ 100 (Green/Magenta)
	#strength: number = 100         // 0 ~ 100 (효과 강도)
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

	get temperature(): number {
		return this.#temperature;
	}

	set temperature(value: number) {
		validateNumberRange(value, 1000, 20000)
		this.#temperature = value;
		this.updateUniform('temperature', value)
	}

	get tint(): number {
		return this.#tint;
	}

	set tint(value: number) {
		validateNumberRange(value, -100, 100)
		this.#tint = value;
		this.updateUniform('tint', value)
	}

	get strength(): number {
		return this.#strength;
	}

	set strength(value: number) {
		validateNumberRange(value, 0, 100)
		this.#strength = value;
		this.updateUniform('strength', value)
	}

	// 편의 메서드들
	setWarmTone() {
		this.temperature = 3200;
		this.tint = -10;
	}

	setCoolTone() {
		this.temperature = 8000;
		this.tint = 10;
	}

	setNeutral() {
		this.temperature = 6500;
		this.tint = 0;
	}

	setCandleLight() {
		this.temperature = 1900;
		this.tint = -5;
	}

	setDaylight() {
		this.temperature = 5600;
		this.tint = 0;
	}

	setCloudyDay() {
		this.temperature = 7500;
		this.tint = 5;
	}

	setNeonLight() {
		this.temperature = 9000;
		this.tint = 15;
	}
}

Object.freeze(ColorTemperatureTint)
export default ColorTemperatureTint

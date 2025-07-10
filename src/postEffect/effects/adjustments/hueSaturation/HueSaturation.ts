import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class HueSaturation extends ASinglePassPostEffect {
	#hue: number = 0
	#saturation: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_HUE_SATURATION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	get hue(): number {
		return this.#hue;
	}

	set hue(value: number) {
		validateNumberRange(value, -180, 180)
		this.#hue = value;
		this.updateUniform('hue', value)
	}

	get saturation(): number {
		return this.#saturation;
	}

	set saturation(value: number) {
		validateNumberRange(value, -100, 100)
		this.#saturation = value;
		this.updateUniform('saturation', value)
	}
}

Object.freeze(HueSaturation)
export default HueSaturation

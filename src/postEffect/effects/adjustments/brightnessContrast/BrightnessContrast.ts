import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class BrightnessContrast extends ASinglePassPostEffect {
	#brightness: number = 0
	#contrast: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_BRIGHTNESS_CONTRAST',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	get brightness(): number {
		return this.#brightness;
	}

	set brightness(value: number) {
		validateNumberRange(value, -150, 150)
		this.#brightness = value;
		this.updateUniform('brightness', value)
	}

	get contrast(): number {
		return this.#contrast;
	}

	set contrast(value: number) {
		validateNumberRange(value, -50, 100)
		this.#contrast = value;
		this.updateUniform('contrast', value)
	}
}

Object.freeze(BrightnessContrast)
export default BrightnessContrast

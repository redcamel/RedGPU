import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class ZoomBlur extends ASinglePassPostEffect {
	#amount: number = 128
	#centerX: number = 0
	#centerY: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_ZOOM_BLUR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.amount = this.#amount
	}

	get centerX(): number {
		return this.#centerX;
	}

	set centerX(value: number) {
		validateNumber(value)
		this.#centerX = value;
		this.updateUniform('centerX', value)
	}

	get centerY(): number {
		return this.#centerY;
	}

	set centerY(value: number) {
		validateNumber(value)
		this.#centerY = value;
		this.updateUniform('centerY', value)
	}

	get amount(): number {
		return this.#amount;
	}

	set amount(value: number) {
		validateNumberRange(value, 0)
		this.#amount = value;
		this.updateUniform('amount', value)
	}
}

Object.freeze(ZoomBlur)
export default ZoomBlur

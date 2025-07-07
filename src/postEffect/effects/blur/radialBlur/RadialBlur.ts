import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class RadialBlur extends ASinglePassPostEffect {
	#amount: number = 50
	#centerX: number = 0
	#centerY: number = 0
	#sampleCount: number = 16

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_RADIAL_BLUR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.amount = this.#amount
		this.sampleCount = this.#sampleCount
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

	get sampleCount(): number {
		return this.#sampleCount;
	}

	set sampleCount(value: number) {
		validateNumberRange(value, 4)
		this.#sampleCount = value;
		this.updateUniform('sampleCount', value)
	}
}

Object.freeze(RadialBlur)
export default RadialBlur

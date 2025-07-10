import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class LensDistortion extends ASinglePassPostEffect {
	#barrelStrength: number = 0.1
	#pincushionStrength: number = 0.0
	#centerX: number = 0
	#centerY: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_LENS_DISTORTION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode),
		)
		this.barrelStrength = this.#barrelStrength
		this.pincushionStrength = this.#pincushionStrength
		this.centerX = this.#centerX
		this.centerY = this.#centerY
	}

	get barrelStrength(): number {
		return this.#barrelStrength;
	}

	set barrelStrength(value: number) {
		validateNumberRange(value, 0)
		this.#barrelStrength = value;
		this.updateUniform('barrelStrength', value)
	}

	get pincushionStrength(): number {
		return this.#pincushionStrength;
	}

	set pincushionStrength(value: number) {
		validateNumberRange(value, 0)
		this.#pincushionStrength = value;
		this.updateUniform('pincushionStrength', value)
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
}

Object.freeze(LensDistortion)
export default LensDistortion

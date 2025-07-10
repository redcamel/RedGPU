import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class Threshold extends ASinglePassPostEffect {
	#threshold: number = 128

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_THRESHOLD',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.threshold = this.#threshold
	}

	get threshold(): number {
		return this.#threshold;
	}

	set threshold(value: number) {
		validateNumberRange(value, 1, 255)
		this.#threshold = value;
		this.updateUniform('threshold', value)
	}
}

Object.freeze(Threshold)
export default Threshold

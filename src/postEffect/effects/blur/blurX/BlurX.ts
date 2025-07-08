import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class BlurX extends ASinglePassPostEffect {
	#size: number = 32

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_BLUR_X',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.size = this.#size
	}

	get size(): number {
		return this.#size;
	}

	set size(value: number) {
		validateNumberRange(value,0)
		this.#size = value;
		this.updateUniform('size', value)
	}
}

Object.freeze(BlurX)
export default BlurX

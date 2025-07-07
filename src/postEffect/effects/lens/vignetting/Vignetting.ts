import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class Vignetting extends ASinglePassPostEffect {
	#smoothness: number = 0.2
	#size: number = 0.5

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_VIGNETTING',
			createBasicPostEffectCode(this, computeCode, uniformStructCode),
		)
		this.smoothness = this.#smoothness
		this.size = this.#size
	}

	get size(): number {
		return this.#size;
	}

	set size(value: number) {
		validateNumberRange(value, 0,)
		this.#size = value;
		this.updateUniform('size', value)
	}

	get smoothness(): number {
		return this.#smoothness;
	}

	set smoothness(value: number) {
		validateNumberRange(value, 0, 1)
		this.#smoothness = value;
		this.updateUniform('smoothness', value)
	}
}

Object.freeze(Vignetting)
export default Vignetting

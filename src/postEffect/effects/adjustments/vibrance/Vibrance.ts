import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class Vibrance extends ASinglePassPostEffect {
	#vibrance: number = 0      // -100 ~ 100
	#saturation: number = 0    // -100 ~ 100
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_VIBRANCE',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	get vibrance(): number {
		return this.#vibrance;
	}

	set vibrance(value: number) {
		validateNumberRange(value, -100, 100)
		this.#vibrance = value;
		this.updateUniform('vibrance', value)
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

Object.freeze(Vibrance)
export default Vibrance

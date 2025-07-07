import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"

class Grayscale extends ASinglePassPostEffect {
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const uniformStructCode = ''
		this.init(
			redGPUContext,
			'POST_EFFECT_GRAYSCALE',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}
}

Object.freeze(Grayscale)
export default Grayscale

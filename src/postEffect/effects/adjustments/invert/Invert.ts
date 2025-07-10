import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"

class Invert extends ASinglePassPostEffect {
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const uniformStructCode = ''
		this.init(
			redGPUContext,
			'POST_EFFECT_INVERT',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}
}

Object.freeze(Invert)
export default Invert

import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import Convolution from "../convolution/Convolution";

class Blur extends AMultiPassPostEffect {
	#effect_convolution: Convolution

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			[
				new Convolution(redGPUContext),
			],
		);
		this.#effect_convolution = this.passList[0] as Convolution
		this.#effect_convolution.kernel = Convolution.BLUR
	}

	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
		return this.#effect_convolution.render(
			view, width, height, sourceTextureInfo
		)
	}
}

Object.freeze(Blur)
export default Blur

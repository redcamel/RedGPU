import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AMultiPassPostEffect from "../core/AMultiPassPostEffect";
import Convolution from "./Convolution";

class Sharpen extends AMultiPassPostEffect {
	#effect_convolution: Convolution

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			[
				new Convolution(redGPUContext),
			],
		);
		this.#effect_convolution = this.passList[0] as Convolution
		this.#effect_convolution.kernel = Convolution.SHARPEN
	}


	render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView) {
		return this.#effect_convolution.render(
			view, width, height, sourceTextureView
		)
	}
}

Object.freeze(Sharpen)
export default Sharpen

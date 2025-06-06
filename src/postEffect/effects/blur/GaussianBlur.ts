import RedGPUContext from "../../../context/RedGPUContext";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import BlurX from "./BlurX";
import BlurY from "./BlurY";

class GaussianBlur extends AMultiPassPostEffect {
	#size: number = 32

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			[
				new BlurX(redGPUContext),
				new BlurY(redGPUContext)
			],
		);
	}

	get size(): number {
		return this.#size;
	}

	set size(value: number) {
		this.#size = value;
		this.passList.forEach((v: BlurX | BlurY) => v.size = value)
	}
}

Object.freeze(GaussianBlur)
export default GaussianBlur

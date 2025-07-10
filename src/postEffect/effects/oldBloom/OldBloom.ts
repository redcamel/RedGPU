import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import Threshold from "../adjustments/threshold/Threshold";
import GaussianBlur from "../blur/GaussianBlur";
import OldBloomBlend from "./OldBloomBlend";

class OldBloom extends AMultiPassPostEffect {
	#effect_threshold: Threshold
	#effect_gaussianBlur: GaussianBlur
	#effect_oldBloomBlend: OldBloomBlend
	#threshold: number = 156
	#gaussianBlurSize: number = 32
	#exposure: number = 1
	#bloomStrength: number = 1.2

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			[
				new Threshold(redGPUContext),
				new GaussianBlur(redGPUContext),
				new OldBloomBlend(redGPUContext),
			],
		);
		this.#effect_threshold = this.passList[0] as Threshold
		this.#effect_gaussianBlur = this.passList[1] as GaussianBlur
		this.#effect_oldBloomBlend = this.passList[2] as OldBloomBlend
		this.#effect_threshold.threshold = this.#threshold
		this.#effect_gaussianBlur.size = this.#gaussianBlurSize
		this.#effect_oldBloomBlend.exposure = this.#exposure
		this.#effect_oldBloomBlend.bloomStrength = this.#bloomStrength
	}

	get threshold(): number {
		return this.#threshold;
	}

	set threshold(value: number) {
		this.#threshold = value;
		this.#effect_threshold.threshold = value
	}

	get gaussianBlurSize(): number {
		return this.#gaussianBlurSize;
	}

	set gaussianBlurSize(value: number) {
		this.#gaussianBlurSize = value;
		this.#effect_gaussianBlur.size = value
	}

	get exposure(): number {
		return this.#exposure;
	}

	set exposure(value: number) {
		this.#exposure = value;
		this.#effect_oldBloomBlend.exposure = value
	}

	get bloomStrength(): number {
		return this.#bloomStrength;
	}

	set bloomStrength(value: number) {
		this.#bloomStrength = value;
		this.#effect_oldBloomBlend.bloomStrength = value
	}

	render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView) {
		const thresholdResult = this.#effect_threshold.render(
			view, width, height, sourceTextureView
		)
		const blurResult = this.#effect_gaussianBlur.render(
			view, width, height, thresholdResult
		)
		return this.#effect_oldBloomBlend.render(
			view, width, height, sourceTextureView, blurResult
		)
	}
}

Object.freeze(OldBloom)
export default OldBloom

import RedGPUContext from "../../../../../context/RedGPUContext";
import validateNumberRange from "../../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class DOFCoC extends ASinglePassPostEffect {
	#focusDistance: number = 15.0;
	#aperture: number = 1.4;
	#maxCoC: number = 32.0;
	#nearPlane: number = 0.1;
	#farPlane: number = 1000.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.useDepthTexture = true
		this.init(
			redGPUContext,
			'POST_EFFECT_DOF_COC',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		);
		this.focusDistance = this.#focusDistance;
		this.aperture = this.#aperture;
		this.maxCoC = this.#maxCoC;
		this.nearPlane = this.#nearPlane;
		this.farPlane = this.#farPlane;
	}

	get focusDistance(): number {
		return this.#focusDistance;
	}

	set focusDistance(value: number) {
		validateNumberRange(value);
		this.#focusDistance = value;
		this.updateUniform('focusDistance', value)
	}

	get aperture(): number {
		return this.#aperture;
	}

	set aperture(value: number) {
		validateNumberRange(value);
		this.#aperture = value;
		this.updateUniform('aperture', value)
	}

	get maxCoC(): number {
		return this.#maxCoC;
	}

	set maxCoC(value: number) {
		validateNumberRange(value);
		this.#maxCoC = value;
		this.updateUniform('maxCoC', value)
	}

	get nearPlane(): number {
		return this.#nearPlane;
	}

	set nearPlane(value: number) {
		validateNumberRange(value);
		this.#nearPlane = value;
		this.updateUniform('nearPlane', value)
	}

	get farPlane(): number {
		return this.#farPlane;
	}

	set farPlane(value: number) {
		validateNumberRange(value);
		this.#farPlane = value;
		this.updateUniform('farPlane', value)
	}
}

Object.freeze(DOFCoC);
export default DOFCoC;

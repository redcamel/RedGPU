import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class ChromaticAberration extends ASinglePassPostEffect {
	#strength: number = 0.015
	#centerX: number = 0.5
	#centerY: number = 0.5
	#falloff: number = 1.0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_CHROMATIC_ABERRATION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.strength = this.#strength
		this.centerX = this.#centerX
		this.centerY = this.#centerY
		this.falloff = this.#falloff
	}

	get strength(): number {
		return this.#strength;
	}

	set strength(value: number) {
		validateNumberRange(value, 0)
		this.#strength = value;
		this.updateUniform('strength', value)
	}

	get centerX(): number {
		return this.#centerX;
	}

	set centerX(value: number) {
		validateNumberRange(value, 0, 1)
		this.#centerX = value;
		this.updateUniform('centerX', value)
	}

	get centerY(): number {
		return this.#centerY;
	}

	set centerY(value: number) {
		validateNumberRange(value, 0, 1)
		this.#centerY = value;
		this.updateUniform('centerY', value)
	}

	get falloff(): number {
		return this.#falloff;
	}

	set falloff(value: number) {
		validateNumberRange(value, 0, 5)
		this.#falloff = value;
		this.updateUniform('falloff', value)
	}
}

Object.freeze(ChromaticAberration)
export default ChromaticAberration

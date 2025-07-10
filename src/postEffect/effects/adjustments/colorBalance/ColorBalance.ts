import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class ColorBalance extends ASinglePassPostEffect {
	#shadowCyanRed: number = 0      // -100 ~ 100
	#shadowMagentaGreen: number = 0 // -100 ~ 100
	#shadowYellowBlue: number = 0   // -100 ~ 100
	#midtoneCyanRed: number = 0
	#midtoneMagentaGreen: number = 0
	#midtoneYellowBlue: number = 0
	#highlightCyanRed: number = 0
	#highlightMagentaGreen: number = 0
	#highlightYellowBlue: number = 0
	#preserveLuminosity: boolean = true // 밝기 보존 옵션
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_COLOR_BALANCE',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	get shadowCyanRed(): number {
		return this.#shadowCyanRed;
	}

	set shadowCyanRed(value: number) {
		validateNumberRange(value, -100, 100)
		this.#shadowCyanRed = value;
		this.updateUniform('shadowCyanRed', value)
	}

	get shadowMagentaGreen(): number {
		return this.#shadowMagentaGreen;
	}

	set shadowMagentaGreen(value: number) {
		validateNumberRange(value, -100, 100)
		this.#shadowMagentaGreen = value;
		this.updateUniform('shadowMagentaGreen', value)
	}

	get shadowYellowBlue(): number {
		return this.#shadowYellowBlue;
	}

	set shadowYellowBlue(value: number) {
		validateNumberRange(value, -100, 100)
		this.#shadowYellowBlue = value;
		this.updateUniform('shadowYellowBlue', value)
	}

	get midtoneCyanRed(): number {
		return this.#midtoneCyanRed;
	}

	set midtoneCyanRed(value: number) {
		validateNumberRange(value, -100, 100)
		this.#midtoneCyanRed = value;
		this.updateUniform('midtoneCyanRed', value)
	}

	get midtoneMagentaGreen(): number {
		return this.#midtoneMagentaGreen;
	}

	set midtoneMagentaGreen(value: number) {
		validateNumberRange(value, -100, 100)
		this.#midtoneMagentaGreen = value;
		this.updateUniform('midtoneMagentaGreen', value)
	}

	get midtoneYellowBlue(): number {
		return this.#midtoneYellowBlue;
	}

	set midtoneYellowBlue(value: number) {
		validateNumberRange(value, -100, 100)
		this.#midtoneYellowBlue = value;
		this.updateUniform('midtoneYellowBlue', value)
	}

	get highlightCyanRed(): number {
		return this.#highlightCyanRed;
	}

	set highlightCyanRed(value: number) {
		validateNumberRange(value, -100, 100)
		this.#highlightCyanRed = value;
		this.updateUniform('highlightCyanRed', value)
	}

	get highlightMagentaGreen(): number {
		return this.#highlightMagentaGreen;
	}

	set highlightMagentaGreen(value: number) {
		validateNumberRange(value, -100, 100)
		this.#highlightMagentaGreen = value;
		this.updateUniform('highlightMagentaGreen', value)
	}

	get highlightYellowBlue(): number {
		return this.#highlightYellowBlue;
	}

	set highlightYellowBlue(value: number) {
		validateNumberRange(value, -100, 100)
		this.#highlightYellowBlue = value;
		this.updateUniform('highlightYellowBlue', value)
	}

	get preserveLuminosity(): boolean {
		return this.#preserveLuminosity;
	}

	set preserveLuminosity(value: boolean) {
		this.#preserveLuminosity = value;
		this.updateUniform('preserveLuminosity', value)
	}
}

Object.freeze(ColorBalance)
export default ColorBalance

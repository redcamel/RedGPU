import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

const SUBTLE = {
	filmGrainIntensity: 0.02,
	filmGrainResponse: 0.9,
	filmGrainScale: 2.5,
	coloredGrain: 0.3,
	grainSaturation: 0.4
};
const MEDIUM = {
	filmGrainIntensity: 0.05,
	filmGrainResponse: 0.8,
	filmGrainScale: 3.0,
	coloredGrain: 0.5,
	grainSaturation: 0.6
};
const HEAVY = {
	filmGrainIntensity: 0.12,
	filmGrainResponse: 0.6,
	filmGrainScale: 4.0,
	coloredGrain: 0.7,
	grainSaturation: 0.8
};
const VINTAGE = {
	filmGrainIntensity: 0.08,
	filmGrainResponse: 0.7,
	filmGrainScale: 5.0,
	coloredGrain: 0.9,
	grainSaturation: 1.0
};

class FilmGrain extends ASinglePassPostEffect {
	static SUBTLE = SUBTLE;
	static MEDIUM = MEDIUM;
	static HEAVY = HEAVY;
	static VINTAGE = VINTAGE;
	#filmGrainIntensity: number = HEAVY.filmGrainIntensity;
	#filmGrainResponse: number = HEAVY.filmGrainResponse;
	#filmGrainScale: number = HEAVY.filmGrainScale;
	#coloredGrain: number = HEAVY.coloredGrain;
	#grainSaturation: number = HEAVY.grainSaturation;
	#time: number = 0.0;
	#devicePixelRatio: number = 1.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.#devicePixelRatio = window?.devicePixelRatio || 1.0;
		this.init(
			redGPUContext,
			'POST_EFFECT_FILM_GRAIN',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		);
		this.#updateUniforms();
	}

	get filmGrainIntensity(): number {
		return this.#filmGrainIntensity;
	}

	set filmGrainIntensity(value: number) {
		this.#filmGrainIntensity = Math.max(0.0, Math.min(1.0, value));
		this.updateUniform('filmGrainIntensity', this.#filmGrainIntensity);
	}

	get filmGrainResponse(): number {
		return this.#filmGrainResponse;
	}

	set filmGrainResponse(value: number) {
		this.#filmGrainResponse = Math.max(0.0, Math.min(2.0, value));
		this.updateUniform('filmGrainResponse', this.#filmGrainResponse);
	}

	get filmGrainScale(): number {
		return this.#filmGrainScale;
	}

	set filmGrainScale(value: number) {
		this.#filmGrainScale = Math.max(0.1, Math.min(20.0, value));
		this.updateUniform('filmGrainScale', this.#filmGrainScale);
	}

	get coloredGrain(): number {
		return this.#coloredGrain;
	}

	set coloredGrain(value: number) {
		this.#coloredGrain = Math.max(0.0, Math.min(1.0, value));
		this.updateUniform('coloredGrain', this.#coloredGrain);
	}

	get grainSaturation(): number {
		return this.#grainSaturation;
	}

	set grainSaturation(value: number) {
		this.#grainSaturation = Math.max(0.0, Math.min(2.0, value));
		this.updateUniform('grainSaturation', this.#grainSaturation);
	}

	applyPreset(preset: typeof SUBTLE | typeof MEDIUM | typeof HEAVY | typeof VINTAGE): void {
		this.#filmGrainIntensity = preset.filmGrainIntensity;
		this.#filmGrainResponse = preset.filmGrainResponse;
		this.#filmGrainScale = preset.filmGrainScale;
		this.#coloredGrain = preset.coloredGrain;
		this.#grainSaturation = preset.grainSaturation;
		this.#updateUniforms();
	}

	update(deltaTime: number): void {
		this.#time += deltaTime;
		this.updateUniform('time', this.#time);
	}

	#updateUniforms(): void {
		this.updateUniform('filmGrainIntensity', this.#filmGrainIntensity);
		this.updateUniform('filmGrainResponse', this.#filmGrainResponse);
		this.updateUniform('filmGrainScale', this.#filmGrainScale);
		this.updateUniform('coloredGrain', this.#coloredGrain);
		this.updateUniform('grainSaturation', this.#grainSaturation);
		this.updateUniform('time', this.#time);
		this.updateUniform('devicePixelRatio', this.#devicePixelRatio);
	}
}

Object.freeze(FilmGrain);
export default FilmGrain;

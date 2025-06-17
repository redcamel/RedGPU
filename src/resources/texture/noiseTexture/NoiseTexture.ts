import RedGPUContext from "../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import ANoiseTexture, {NoiseDefine} from "./core/ANoiseTexture";

const BASIC_OPEIONS = {
	frequency: 8.0,
	amplitude: 1.0,
	octaves: 1,
	persistence: 0.5,
	lacunarity: 2.0,
	seed: 0.0
}

class NoiseTexture extends ANoiseTexture {
	#frequency: number = BASIC_OPEIONS.frequency;      /* 노이즈 패턴의 밀도/크기 (값이 클수록 세밀함) */
	#amplitude: number = BASIC_OPEIONS.amplitude;      /* 노이즈의 강도/대비 (값이 클수록 명암 대비 강함) */
	#octaves: number = BASIC_OPEIONS.octaves;          /* 합성할 노이즈 레이어 개수 (값이 클수록 복잡한 디테일) */
	#persistence: number = BASIC_OPEIONS.persistence;    /* 각 옥타브마다 진폭 감소 비율 (값이 클수록 거친 디테일) */
	#lacunarity: number = BASIC_OPEIONS.lacunarity;     /* 각 옥타브마다 주파수 증가 비율 (값이 클수록 극명한 대비) */
	#seed: number = BASIC_OPEIONS.seed;           /* 노이즈 패턴의 시작점 (같은 시드 = 같은 패턴) */
	constructor(
		redGPUContext: RedGPUContext,
		width: number = 512,
		height: number = 512,
		define?: NoiseDefine
	) {
		const uniformStruct = define?.uniformStruct || ``;
		const mainLogic = define?.mainLogic || `
					 let noise = getNoise2D(
					  uv,uniforms
					);
            
            /* 최종 색상 (그레이스케일) */
            let color = vec4<f32>(noise, noise, noise, 1.0);
        `;
		const uniformDefaults =  {
			...BASIC_OPEIONS,
			...define?.uniformDefaults || {}
		};
		const helperFunctions = define?.helperFunctions || ''
		super(redGPUContext, width, height, {
			uniformStruct,
			mainLogic,
			uniformDefaults,
			helperFunctions
		});
	}

	/* Frequency (주파수/스케일) */
	get frequency(): number {
		return this.#frequency;
	}

	set frequency(value: number) {
		validatePositiveNumberRange(value);
		this.#frequency = value;
		this.updateUniform('frequency', value);
	}

	/* Amplitude (진폭) */
	get amplitude(): number {
		return this.#amplitude;
	}

	set amplitude(value: number) {
		validatePositiveNumberRange(value);
		this.#amplitude = value;
		this.updateUniform('amplitude', value);
	}

	/* Octaves (옥타브 수) */
	get octaves(): number {
		return this.#octaves;
	}

	set octaves(value: number) {
		validateUintRange(value, 1, 8)
		this.#octaves = value;
		this.updateUniform('octaves', value);
	}

	/* Persistence (지속성) */
	get persistence(): number {
		return this.#persistence;
	}

	set persistence(value: number) {
		validatePositiveNumberRange(value, 0, 1)
		this.#persistence = value;
		this.updateUniform('persistence', value);
	}

	/* Lacunarity (간극성) */
	get lacunarity(): number {
		return this.#lacunarity;
	}

	set lacunarity(value: number) {
		validatePositiveNumberRange(value);
		this.#lacunarity = value;
		this.updateUniform('lacunarity', value);
	}

	/* Seed (시드) */
	get seed(): number {
		return this.#seed;
	}

	set seed(value: number) {
		this.#seed = value;
		this.updateUniform('seed', value);
	}

	randomizeSeed(): void {
		this.seed = Math.random() * 1000.0;
	}

	// applyPreset(preset: 'clouds' | 'marble' | 'wood' | 'terrain' | 'fabric'): void {
	// 	switch (preset) {
	// 		case 'clouds':
	// 			this.frequency = 4.0;
	// 			this.octaves = 4;
	// 			this.persistence = 0.6;
	// 			this.lacunarity = 2.0;
	// 			break;
	// 		case 'marble':
	// 			this.frequency = 8.0;
	// 			this.octaves = 6;
	// 			this.persistence = 0.4;
	// 			this.lacunarity = 2.2;
	// 			break;
	// 		case 'wood':
	// 			this.frequency = 12.0;
	// 			this.octaves = 3;
	// 			this.persistence = 0.7;
	// 			this.lacunarity = 2.5;
	// 			break;
	// 		case 'terrain':
	// 			this.frequency = 6.0;
	// 			this.octaves = 8;
	// 			this.persistence = 0.5;
	// 			this.lacunarity = 2.0;
	// 			break;
	// 		case 'fabric':
	// 			this.frequency = 20.0;
	// 			this.octaves = 2;
	// 			this.persistence = 0.3;
	// 			this.lacunarity = 2.0;
	// 			break;
	// 	}
	// }

	getSettings(): {
		frequency: number;
		amplitude: number;
		octaves: number;
		persistence: number;
		lacunarity: number;
		seed: number;
	} {
		return {
			frequency: this.#frequency,
			amplitude: this.#amplitude,
			octaves: this.#octaves,
			persistence: this.#persistence,
			lacunarity: this.#lacunarity,
			seed: this.#seed
		};
	}

	applySettings(settings: Partial<{
		frequency: number;
		amplitude: number;
		octaves: number;
		persistence: number;
		lacunarity: number;
		seed: number;
	}>): void {
		if (settings.frequency !== undefined) this.frequency = settings.frequency;
		if (settings.amplitude !== undefined) this.amplitude = settings.amplitude;
		if (settings.octaves !== undefined) this.octaves = settings.octaves;
		if (settings.persistence !== undefined) this.persistence = settings.persistence;
		if (settings.lacunarity !== undefined) this.lacunarity = settings.lacunarity;
		if (settings.seed !== undefined) this.seed = settings.seed;
	}
}

export default NoiseTexture;

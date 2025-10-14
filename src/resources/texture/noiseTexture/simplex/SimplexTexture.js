import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import ANoiseTexture from "../core/ANoiseTexture";
import { mergerNoiseHelperFunctions, mergerNoiseUniformDefault, mergerNoiseUniformStruct } from "../core/noiseDefineMerges";
import NOISE_DIMENSION from "./NOISE_DIMENSION";
import simplexComputeFunctions from './simplexCompute.wgsl';
const validDimensions = Object.values(NOISE_DIMENSION);
const BASIC_OPTIONS = {
    frequency: 8.0,
    amplitude: 1.0,
    octaves: 1,
    persistence: 0.5,
    lacunarity: 2.0,
    seed: 0.0,
    noiseDimension: NOISE_DIMENSION.MODE_2D,
};
/**
 * @category NoiseTexture
 * @experimental
 */
class SimplexTexture extends ANoiseTexture {
    #frequency = BASIC_OPTIONS.frequency; /* 노이즈 패턴의 밀도/크기 (값이 클수록 세밀함) */
    #amplitude = BASIC_OPTIONS.amplitude; /* 노이즈의 강도/대비 (값이 클수록 명암 대비 강함) */
    #octaves = BASIC_OPTIONS.octaves; /* 합성할 노이즈 레이어 개수 (값이 클수록 복잡한 디테일) */
    #persistence = BASIC_OPTIONS.persistence; /* 각 옥타브마다 진폭 감소 비율 (값이 클수록 거친 디테일) */
    #lacunarity = BASIC_OPTIONS.lacunarity; /* 각 옥타브마다 주파수 증가 비율 (값이 클수록 극명한 대비) */
    #seed = BASIC_OPTIONS.seed; /* 노이즈 패턴의 시작점 (같은 시드 = 같은 패턴) */
    #noiseDimension = BASIC_OPTIONS.noiseDimension;
    constructor(redGPUContext, width = 1024, height = 1024, define) {
        super(redGPUContext, width, height, {
            ...define,
            mainLogic: define?.mainLogic || `
						let uv = vec2<f32>(
							(base_uv.x + uniforms.time * ( uniforms.animationX * uniforms.animationSpeed )) , 
							(base_uv.y + uniforms.time * ( uniforms.animationY * uniforms.animationSpeed )) 
						);
						let noise = getSimplexNoiseByDimension( uv,uniforms );
            
            /* 최종 색상 (그레이스케일) */
            let finalColor = vec4<f32>(noise, noise, noise, 1.0);
			`,
            uniformStruct: mergerNoiseUniformStruct(`
					noiseDimension : f32,
					frequency: f32,
					amplitude: f32,
					octaves: i32,
					persistence: f32,
					lacunarity: f32,
					seed: f32,
				`, define?.uniformStruct),
            uniformDefaults: mergerNoiseUniformDefault(BASIC_OPTIONS, define?.uniformDefaults),
            helperFunctions: mergerNoiseHelperFunctions(simplexComputeFunctions, define?.helperFunctions),
        });
    }
    get noiseDimension() {
        return this.#noiseDimension;
    }
    set noiseDimension(value) {
        if (validDimensions.includes(value)) {
            this.#noiseDimension = value;
            this.updateUniform('noiseDimension', value);
        }
        else {
            consoleAndThrowError(`Invalid value for noiseDimension. Received ${value}. Expected one of: ${validDimensions.join(", ")}`);
        }
    }
    /* Frequency (주파수/스케일) */
    get frequency() {
        return this.#frequency;
    }
    set frequency(value) {
        validatePositiveNumberRange(value);
        this.#frequency = value;
        this.updateUniform('frequency', value);
    }
    /* Amplitude (진폭) */
    get amplitude() {
        return this.#amplitude;
    }
    set amplitude(value) {
        validatePositiveNumberRange(value);
        this.#amplitude = value;
        this.updateUniform('amplitude', value);
    }
    /* Octaves (옥타브 수) */
    get octaves() {
        return this.#octaves;
    }
    set octaves(value) {
        validateUintRange(value, 1, 8);
        this.#octaves = value;
        this.updateUniform('octaves', value);
    }
    /* Persistence (지속성) */
    get persistence() {
        return this.#persistence;
    }
    set persistence(value) {
        validatePositiveNumberRange(value, 0, 1);
        this.#persistence = value;
        this.updateUniform('persistence', value);
    }
    /* Lacunarity (간극성) */
    get lacunarity() {
        return this.#lacunarity;
    }
    set lacunarity(value) {
        validatePositiveNumberRange(value);
        this.#lacunarity = value;
        this.updateUniform('lacunarity', value);
    }
    /* Seed (시드) */
    get seed() {
        return this.#seed;
    }
    set seed(value) {
        this.#seed = value;
        this.updateUniform('seed', value);
    }
    randomizeSeed() {
        this.seed = Math.random() * 1000.0;
    }
    getSettings() {
        return {
            frequency: this.#frequency,
            amplitude: this.#amplitude,
            octaves: this.#octaves,
            persistence: this.#persistence,
            lacunarity: this.#lacunarity,
            seed: this.#seed
        };
    }
    applySettings(settings) {
        if (settings.frequency !== undefined)
            this.frequency = settings.frequency;
        if (settings.amplitude !== undefined)
            this.amplitude = settings.amplitude;
        if (settings.octaves !== undefined)
            this.octaves = settings.octaves;
        if (settings.persistence !== undefined)
            this.persistence = settings.persistence;
        if (settings.lacunarity !== undefined)
            this.lacunarity = settings.lacunarity;
        if (settings.seed !== undefined)
            this.seed = settings.seed;
    }
}
export default SimplexTexture;

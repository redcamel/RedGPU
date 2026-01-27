import RedGPUContext from "../../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import ANoiseTexture, {NoiseDefine} from "../core/ANoiseTexture";
import {
    mergerNoiseHelperFunctions,
    mergerNoiseUniformDefault,
    mergerNoiseUniformStruct
} from "../core/noiseDefineMerges";
import NOISE_DIMENSION from "./NOISE_DIMENSION";
import simplexComputeFunctions from './simplexCompute.wgsl';

const validDimensions = Object.values(NOISE_DIMENSION) as number[];
const BASIC_OPTIONS = {
    frequency: 8.0,
    amplitude: 1.0,
    octaves: 1,
    persistence: 0.5,
    lacunarity: 2.0,
    seed: 0.0,
    noiseDimension: NOISE_DIMENSION.MODE_2D,
}

/**
 * [KO] Simplex 노이즈 패턴을 생성하는 텍스처 클래스입니다.
 * [EN] Texture class that generates Simplex noise patterns.
 *
 * [KO] 1D, 2D, 3D Simplex 노이즈를 지원하며, FBM(Fractal Brownian Motion)을 통해 복잡한 패턴을 만들 수 있습니다.
 * [EN] Supports 1D, 2D, and 3D Simplex noise, and can create complex patterns through FBM (Fractal Brownian Motion).
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.SimplexTexture(redGPUContext);
 * ```
 * @experimental
 * @category NoiseTexture
 */
class SimplexTexture extends ANoiseTexture {
    /** [KO] 노이즈 패턴의 밀도/크기 [EN] Density/scale of the noise pattern */
    #frequency: number = BASIC_OPTIONS.frequency;
    /** [KO] 노이즈 강도/대비 [EN] Strength/contrast of the noise */
    #amplitude: number = BASIC_OPTIONS.amplitude;
    /** [KO] 합성할 노이즈 레이어 개수 [EN] Number of noise layers to combine */
    #octaves: number = BASIC_OPTIONS.octaves;
    /** [KO] 각 옥타브마다 진폭 감소 비율 [EN] Rate of amplitude reduction for each octave */
    #persistence: number = BASIC_OPTIONS.persistence;
    /** [KO] 각 옥타브마다 주파수 증가 비율 [EN] Rate of frequency increase for each octave */
    #lacunarity: number = BASIC_OPTIONS.lacunarity;
    /** [KO] 노이즈 패턴의 시작점 [EN] Starting point of the noise pattern */
    #seed: number = BASIC_OPTIONS.seed;
    /** [KO] 노이즈 차원 (1, 2, 3) [EN] Noise dimension (1, 2, 3) */
    #noiseDimension: number = BASIC_OPTIONS.noiseDimension

    /**
     * [KO] SimplexTexture 인스턴스를 생성합니다.
     * [EN] Creates a SimplexTexture instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 텍스처 가로 크기 [EN] Texture width
     * @param height - [KO] 텍스처 세로 크기 [EN] Texture height
     * @param define - [KO] 노이즈 정의 객체 (선택) [EN] Noise definition object (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1024,
        height: number = 1024,
        define: NoiseDefine
    ) {
        super(redGPUContext, width, height, {
            ...define,
            mainLogic: define?.mainLogic || `
						let uv = vec2<f32>(
							(base_uv.x + uniforms.time * ( uniforms.animationX * uniforms.animationSpeed )) , 
							(base_uv.y + uniforms.time * ( uniforms.animationY * uniforms.animationSpeed )) 
						);
						let noise = getSimplexNoiseByDimension( uv,uniforms );
            
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
				`,
                define?.uniformStruct
            ),
            uniformDefaults: mergerNoiseUniformDefault(BASIC_OPTIONS, define?.uniformDefaults),
            helperFunctions: mergerNoiseHelperFunctions(simplexComputeFunctions, define?.helperFunctions),
        });
    }

    /** [KO] 노이즈 차원을 반환합니다. [EN] Returns the noise dimension. */
    get noiseDimension(): number {
        return this.#noiseDimension;
    }

    /** [KO] 노이즈 차원을 설정합니다. [EN] Sets the noise dimension. */
    set noiseDimension(value: number) {
        if (validDimensions.includes(value)) {
            this.#noiseDimension = value;
            this.updateUniform('noiseDimension', value);
        } else {
            consoleAndThrowError(`Invalid value for noiseDimension. Received ${value}. Expected one of: ${validDimensions.join(", ")}`);
        }
    }

    /** [KO] 주파수(Frequency)를 반환합니다. [EN] Returns the frequency. */
    get frequency(): number {
        return this.#frequency;
    }

    /** [KO] 주파수(Frequency)를 설정합니다. [EN] Sets the frequency. */
    set frequency(value: number) {
        validatePositiveNumberRange(value);
        this.#frequency = value;
        this.updateUniform('frequency', value);
    }

    /** [KO] 진폭(Amplitude)을 반환합니다. [EN] Returns the amplitude. */
    get amplitude(): number {
        return this.#amplitude;
    }

    /** [KO] 진폭(Amplitude)을 설정합니다. [EN] Sets the amplitude. */
    set amplitude(value: number) {
        validatePositiveNumberRange(value);
        this.#amplitude = value;
        this.updateUniform('amplitude', value);
    }

    /** [KO] 옥타브(Octaves) 수를 반환합니다. [EN] Returns the number of octaves. */
    get octaves(): number {
        return this.#octaves;
    }

    /** [KO] 옥타브(Octaves) 수를 설정합니다. [EN] Sets the number of octaves. */
    set octaves(value: number) {
        validateUintRange(value, 1, 8)
        this.#octaves = value;
        this.updateUniform('octaves', value);
    }

    /** [KO] 지속성(Persistence)을 반환합니다. [EN] Returns the persistence. */
    get persistence(): number {
        return this.#persistence;
    }

    /** [KO] 지속성(Persistence)을 설정합니다. [EN] Sets the persistence. */
    set persistence(value: number) {
        validatePositiveNumberRange(value, 0, 1)
        this.#persistence = value;
        this.updateUniform('persistence', value);
    }

    /** [KO] 간극성(Lacunarity)을 반환합니다. [EN] Returns the lacunarity. */
    get lacunarity(): number {
        return this.#lacunarity;
    }

    /** [KO] 간극성(Lacunarity)을 설정합니다. [EN] Sets the lacunarity. */
    set lacunarity(value: number) {
        validatePositiveNumberRange(value);
        this.#lacunarity = value;
        this.updateUniform('lacunarity', value);
    }

    /** [KO] 시드(Seed)를 반환합니다. [EN] Returns the seed. */
    get seed(): number {
        return this.#seed;
    }

    /** [KO] 시드(Seed)를 설정합니다. [EN] Sets the seed. */
    set seed(value: number) {
        this.#seed = value;
        this.updateUniform('seed', value);
    }

    /** [KO] 시드를 랜덤 값으로 설정합니다. [EN] Randomizes the seed value. */
    randomizeSeed(): void {
        this.seed = Math.random() * 1000.0;
    }

    /** [KO] 현재 모든 노이즈 설정을 반환합니다. [EN] Returns all current noise settings. */
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

    /** [KO] 노이즈 설정을 일괄 적용합니다. [EN] Applies noise settings at once. */
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

export default SimplexTexture;
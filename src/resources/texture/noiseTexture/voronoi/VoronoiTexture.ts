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
import VORONOI_DISTANCE_TYPE from "./VORONOI_DISTANCE_TYPE";
import VORONOI_OUTPUT_TYPE from "./VORONOI_OUTPUT_TYPE";
import voronoiComputeFunctions from './voronoiCompute.wgsl';

const validDistanceTypes = Object.values(VORONOI_DISTANCE_TYPE) as number[];
const validOutputTypes = Object.values(VORONOI_OUTPUT_TYPE) as number[];

/** [KO] Voronoi 설정을 위한 타입 인터페이스 [EN] Type interface for Voronoi settings */
interface VoronoiSettings {
    frequency: number;
    distanceScale: number;
    octaves: number;
    persistence: number;
    lacunarity: number;
    seed: number;
    distanceType: number;
    outputType: number;
    jitter: number;
    cellIdColorIntensity: number;
}

const BASIC_OPTIONS: VoronoiSettings = {
    frequency: 8.0,
    distanceScale: 1.0,
    octaves: 1,
    persistence: 0.5,
    lacunarity: 2.0,
    seed: 0.0,
    distanceType: VORONOI_DISTANCE_TYPE.EUCLIDEAN,
    outputType: VORONOI_OUTPUT_TYPE.F1,
    jitter: 1.0,
    cellIdColorIntensity: 1.0,
};

/**
 * [KO] Voronoi 노이즈 패턴을 생성하는 텍스처 클래스입니다.
 * [EN] Texture class that generates Voronoi noise patterns.
 *
 * [KO] 셀룰러 패턴, 돌 텍스처, 크랙 패턴, 셀 ID 출력 등을 생성할 수 있습니다.
 * [EN] Can generate cellular patterns, stone textures, crack patterns, cell ID outputs, etc.
 *
 * * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
 * ```
 * @category NoiseTexture
 * @experimental
 */
class VoronoiTexture extends ANoiseTexture {
    /** [KO] 노이즈 패턴의 밀도/크기 [EN] Density/scale of the noise pattern */
    #frequency: number = BASIC_OPTIONS.frequency;
    /** [KO] 거리값 스케일링 [EN] Scaling of the distance value */
    #distanceScale: number = BASIC_OPTIONS.distanceScale;
    /** [KO] 합성할 노이즈 레이어 개수 [EN] Number of noise layers to combine */
    #octaves: number = BASIC_OPTIONS.octaves;
    /** [KO] 각 옥타브마다 진폭 감소 비율 [EN] Rate of amplitude reduction for each octave */
    #persistence: number = BASIC_OPTIONS.persistence;
    /** [KO] 각 옥타브마다 주파수 증가 비율 [EN] Rate of frequency increase for each octave */
    #lacunarity: number = BASIC_OPTIONS.lacunarity;
    /** [KO] 노이즈 패턴의 시작점 [EN] Starting point of the noise pattern */
    #seed: number = BASIC_OPTIONS.seed;
    /** [KO] 거리 계산 방식 [EN] Distance calculation method */
    #distanceType: number = BASIC_OPTIONS.distanceType;
    /** [KO] 출력 타입 [EN] Output type */
    #outputType: number = BASIC_OPTIONS.outputType;
    /** [KO] 점들의 랜덤성 [EN] Randomness of the points */
    #jitter: number = BASIC_OPTIONS.jitter;
    /** [KO] 셀 ID 색상 강도 [EN] Intensity of the cell ID color */
    #cellIdColorIntensity: number = BASIC_OPTIONS.cellIdColorIntensity;

    /**
     * [KO] VoronoiTexture 인스턴스를 생성합니다.
     * [EN] Creates a VoronoiTexture instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 텍스처 가로 크기 [EN] Texture width
     * @param height - [KO] 텍스처 세로 크기 [EN] Texture height
     * @param define - [KO] 노이즈 정의 객체 (선택) [EN] Noise definition object (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1024,
        height: number = 1024,
        define?: NoiseDefine
    ) {
        super(redGPUContext, width, height, {
            ...define,
            mainLogic: define?.mainLogic || `
				let uv = vec2<f32>(
					(base_uv.x + uniforms.time * (uniforms.animationX * uniforms.animationSpeed)),
					(base_uv.y + uniforms.time * (uniforms.animationY * uniforms.animationSpeed))
				);
				var finalColor: vec4<f32>;
				if (uniforms.outputType == 5) {
					let colorNoise = getVoronoiColorNoise(uv, uniforms);
					finalColor = vec4<f32>(colorNoise, 1.0);
				} else {
					let noise = getVoronoiNoise(uv, uniforms);
					finalColor = vec4<f32>(noise, noise, noise, 1.0);
				}
			`,
            uniformStruct: mergerNoiseUniformStruct(`
				frequency: f32,
				distanceScale: f32,
				octaves: i32,
				persistence: f32,
				lacunarity: f32,
				seed: f32,
				distanceType: i32,
				outputType: i32,
				jitter: f32,
				cellIdColorIntensity: f32,
			`, define?.uniformStruct),
            uniformDefaults: mergerNoiseUniformDefault(BASIC_OPTIONS, define?.uniformDefaults),
            helperFunctions: mergerNoiseHelperFunctions(voronoiComputeFunctions, define?.helperFunctions),
        });
    }

    /** [KO] 주파수를 반환합니다. [EN] Returns the frequency. */
    get frequency(): number {
        return this.#frequency;
    }

    /** [KO] 주파수를 설정합니다. [EN] Sets the frequency. */
    set frequency(value: number) {
        validatePositiveNumberRange(value);
        this.#frequency = value;
        this.updateUniform('frequency', value);
    }

    /** [KO] 거리 스케일을 반환합니다. [EN] Returns the distance scale. */
    get distanceScale(): number {
        return this.#distanceScale;
    }

    /** [KO] 거리 스케일을 설정합니다. [EN] Sets the distance scale. */
    set distanceScale(value: number) {
        validatePositiveNumberRange(value);
        this.#distanceScale = value;
        this.updateUniform('distanceScale', value);
    }

    /** [KO] 옥타브 수를 반환합니다. [EN] Returns the number of octaves. */
    get octaves(): number {
        return this.#octaves;
    }

    /** [KO] 옥타브 수를 설정합니다. [EN] Sets the number of octaves. */
    set octaves(value: number) {
        validateUintRange(value, 1, 8);
        this.#octaves = value;
        this.updateUniform('octaves', value);
    }

    /** [KO] 지속성을 반환합니다. [EN] Returns the persistence. */
    get persistence(): number {
        return this.#persistence;
    }

    /** [KO] 지속성을 설정합니다. [EN] Sets the persistence. */
    set persistence(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#persistence = value;
        this.updateUniform('persistence', value);
    }

    /** [KO] 간극성을 반환합니다. [EN] Returns the lacunarity. */
    get lacunarity(): number {
        return this.#lacunarity;
    }

    /** [KO] 간극성을 설정합니다. [EN] Sets the lacunarity. */
    set lacunarity(value: number) {
        validatePositiveNumberRange(value);
        this.#lacunarity = value;
        this.updateUniform('lacunarity', value);
    }

    /** [KO] 시드를 반환합니다. [EN] Returns the seed. */
    get seed(): number {
        return this.#seed;
    }

    /** [KO] 시드를 설정합니다. [EN] Sets the seed. */
    set seed(value: number) {
        this.#seed = value;
        this.updateUniform('seed', value);
    }

    /** [KO] 거리 타입을 반환합니다. [EN] Returns the distance type. */
    get distanceType(): number {
        return this.#distanceType;
    }

    /** [KO] 거리 타입을 설정합니다. [EN] Sets the distance type. */
    set distanceType(value: number) {
        if (validDistanceTypes.includes(value)) {
            this.#distanceType = value;
            this.updateUniform('distanceType', value);
        } else {
            consoleAndThrowError(`Invalid value for distanceType. Received ${value}. Expected one of: ${validDistanceTypes.join(", ")}`);
        }
    }

    /** [KO] 출력 타입을 반환합니다. [EN] Returns the output type. */
    get outputType(): number {
        return this.#outputType;
    }

    /** [KO] 출력 타입을 설정합니다. [EN] Sets the output type. */
    set outputType(value: number) {
        if (validOutputTypes.includes(value)) {
            this.#outputType = value;
            this.updateUniform('outputType', value);
        } else {
            consoleAndThrowError(`Invalid value for outputType. Received ${value}. Expected one of: ${validOutputTypes.join(", ")}`);
        }
    }

    /** [KO] 지터(Jitter) 값을 반환합니다. [EN] Returns the jitter value. */
    get jitter(): number {
        return this.#jitter;
    }

    /** [KO] 지터(Jitter) 값을 설정합니다. [EN] Sets the jitter value. */
    set jitter(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#jitter = value;
        this.updateUniform('jitter', value);
    }

    /** [KO] 셀 ID 색상 강도를 반환합니다. [EN] Returns the cell ID color intensity. */
    get cellIdColorIntensity(): number {
        return this.#cellIdColorIntensity;
    }

    /** [KO] 셀 ID 색상 강도를 설정합니다. [EN] Sets the cell ID color intensity. */
    set cellIdColorIntensity(value: number) {
        validatePositiveNumberRange(value);
        this.#cellIdColorIntensity = value;
        this.updateUniform('cellIdColorIntensity', value);
    }

    /** [KO] 시드를 랜덤하게 변경합니다. [EN] Randomizes the seed. */
    randomizeSeed(): void {
        this.seed = Math.random() * 1000.0;
    }

    /** [KO] 유클리드 거리 방식을 설정합니다. [EN] Sets the Euclidean distance method. */
    setEuclideanDistance(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
    }

    /** [KO] 맨하탄 거리 방식을 설정합니다. [EN] Sets the Manhattan distance method. */
    setManhattanDistance(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
    }

    /** [KO] 체비셰프 거리 방식을 설정합니다. [EN] Sets the Chebyshev distance method. */
    setChebyshevDistance(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.CHEBYSHEV;
    }

    /** [KO] F1 출력 방식을 설정합니다. [EN] Sets the F1 output method. */
    setF1Output(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F1;
    }

    /** [KO] F2 출력 방식을 설정합니다. [EN] Sets the F2 output method. */
    setF2Output(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2;
    }

    /** [KO] 크랙 패턴 방식을 설정합니다. [EN] Sets the crack pattern method. */
    setCrackPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
    }

    /** [KO] 부드러운 블렌딩 방식을 설정합니다. [EN] Sets the smooth blend method. */
    setSmoothBlend(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F1_PLUS_F2;
    }

    /** [KO] 셀 ID 출력 방식을 설정합니다. [EN] Sets the cell ID output method. */
    setCellIdOutput(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID;
    }

    /** [KO] 셀 ID 색상 출력 방식을 설정합니다. [EN] Sets the cell ID color output method. */
    setCellIdColorOutput(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
    }

    /** [KO] 셀룰러 패턴 프리셋을 적용합니다. [EN] Applies the cellular pattern preset. */
    setCellularPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 1.0;
    }

    /** [KO] 돌 패턴 프리셋을 적용합니다. [EN] Applies the stone pattern preset. */
    setStonePattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.8;
    }

    /** [KO] 유기체 패턴 프리셋을 적용합니다. [EN] Applies the organic pattern preset. */
    setOrganicPattern(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
        this.jitter = 0.6;
    }

    /** [KO] 격자 패턴 프리셋을 적용합니다. [EN] Applies the grid pattern preset. */
    setGridPattern(): void {
        this.jitter = 0.0;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
    }

    /** [KO] 크리스탈 패턴 프리셋을 적용합니다. [EN] Applies the crystal pattern preset. */
    setCrystalPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.CHEBYSHEV;
        this.jitter = 0.9;
    }

    /** [KO] 스테인드글라스 패턴 프리셋을 적용합니다. [EN] Applies the stained glass pattern preset. */
    setStainedGlassPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.7;
        this.cellIdColorIntensity = 0.8;
    }

    /** [KO] 모자이크 패턴 프리셋을 적용합니다. [EN] Applies the mosaic pattern preset. */
    setMosaicPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
        this.jitter = 0.3;
        this.cellIdColorIntensity = 1.0;
    }

    /** [KO] 바이옴 맵 패턴 프리셋을 적용합니다. [EN] Applies the biome map pattern preset. */
    setBiomeMapPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.8;
        this.frequency = 4.0;
    }

    /** [KO] 현재 설정을 반환합니다. [EN] Returns current settings. */
    getSettings(): VoronoiSettings {
        return {
            frequency: this.#frequency,
            distanceScale: this.#distanceScale,
            octaves: this.#octaves,
            persistence: this.#persistence,
            lacunarity: this.#lacunarity,
            seed: this.#seed,
            distanceType: this.#distanceType,
            outputType: this.#outputType,
            jitter: this.#jitter,
            cellIdColorIntensity: this.#cellIdColorIntensity,
        };
    }

    /** [KO] 설정을 일괄 적용합니다. [EN] Applies settings at once. */
    applySettings(settings: Partial<VoronoiSettings>): void {
        if (settings.frequency !== undefined) this.frequency = settings.frequency;
        if (settings.distanceScale !== undefined) this.distanceScale = settings.distanceScale;
        if (settings.octaves !== undefined) this.octaves = settings.octaves;
        if (settings.persistence !== undefined) this.persistence = settings.persistence;
        if (settings.lacunarity !== undefined) this.lacunarity = settings.lacunarity;
        if (settings.seed !== undefined) this.seed = settings.seed;
        if (settings.distanceType !== undefined) this.distanceType = settings.distanceType;
        if (settings.outputType !== undefined) this.outputType = settings.outputType;
        if (settings.jitter !== undefined) this.jitter = settings.jitter;
        if (settings.cellIdColorIntensity !== undefined) this.cellIdColorIntensity = settings.cellIdColorIntensity;
    }

    /** [KO] 현재 거리 타입의 이름을 반환합니다. [EN] Returns the name of current distance type. */
    getDistanceTypeName(): string {
        const names: { [key: number]: string } = {
            [VORONOI_DISTANCE_TYPE.EUCLIDEAN]: 'Euclidean',
            [VORONOI_DISTANCE_TYPE.MANHATTAN]: 'Manhattan',
            [VORONOI_DISTANCE_TYPE.CHEBYSHEV]: 'Chebyshev'
        };
        return names[this.#distanceType] || 'Unknown';
    }

    /** [KO] 현재 출력 타입의 이름을 반환합니다. [EN] Returns the name of current output type. */
    getOutputTypeName(): string {
        const names: { [key: number]: string } = {
            [VORONOI_OUTPUT_TYPE.F1]: 'F1',
            [VORONOI_OUTPUT_TYPE.F2]: 'F2',
            [VORONOI_OUTPUT_TYPE.F2_MINUS_F1]: 'F2-F1 (Crack)',
            [VORONOI_OUTPUT_TYPE.F1_PLUS_F2]: 'F1+F2 (Blend)',
            [VORONOI_OUTPUT_TYPE.CELL_ID]: 'Cell ID',
            [VORONOI_OUTPUT_TYPE.CELL_ID_COLOR]: 'Cell ID Color'
        };
        return names[this.#outputType] || 'Unknown';
    }
}

export {VORONOI_DISTANCE_TYPE, VORONOI_OUTPUT_TYPE};
export type {VoronoiSettings};
export default VoronoiTexture;
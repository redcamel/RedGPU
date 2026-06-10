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
     * @param useMipmap - [KO] 밉맵 사용 여부 (기본값: true) [EN] Whether to use mipmaps (default: true)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 1024,
        height: number = 1024,
        define?: NoiseDefine,
        useMipmap: boolean = true
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
    `,
                define?.uniformStruct
            ),
            uniformDefaults: mergerNoiseUniformDefault(BASIC_OPTIONS, define?.uniformDefaults),
            helperFunctions: mergerNoiseHelperFunctions(voronoiComputeFunctions, define?.helperFunctions),
        }, useMipmap);
    }

    /**
     * [KO] 주파수(밀도/크기)를 반환합니다.
     * [EN] Returns the frequency (density/scale).
     * @returns - [KO] 주파수 값 [EN] Frequency value
     */
    get frequency(): number {
        return this.#frequency;
    }

    /**
     * [KO] 주파수(밀도/크기)를 설정합니다.
     * [EN] Sets the frequency (density/scale).
     * @param value - [KO] 설정할 주파수 값 (양수) [EN] Frequency value to set (positive number)
     */
    set frequency(value: number) {
        validatePositiveNumberRange(value);
        this.#frequency = value;
        this.updateUniform('frequency', value);
    }

    /**
     * [KO] 거리 값의 스케일을 반환합니다.
     * [EN] Returns the distance scale.
     * @returns - [KO] 거리 스케일 값 [EN] Distance scale value
     */
    get distanceScale(): number {
        return this.#distanceScale;
    }

    /**
     * [KO] 거리 값의 스케일을 설정합니다.
     * [EN] Sets the distance scale.
     * @param value - [KO] 설정할 거리 스케일 값 (양수) [EN] Distance scale value to set (positive number)
     */
    set distanceScale(value: number) {
        validatePositiveNumberRange(value);
        this.#distanceScale = value;
        this.updateUniform('distanceScale', value);
    }

    /**
     * [KO] 옥타브 수(합성할 노이즈 레이어 개수)를 반환합니다.
     * [EN] Returns the number of octaves (number of noise layers to combine).
     * @returns - [KO] 옥타브 수 [EN] Number of octaves
     */
    get octaves(): number {
        return this.#octaves;
    }

    /**
     * [KO] 옥타브 수(합성할 노이즈 레이어 개수)를 설정합니다.
     * [EN] Sets the number of octaves (number of noise layers to combine).
     * @param value - [KO] 설정할 옥타브 수 (1~8 범위의 정수) [EN] Number of octaves to set (integer between 1 and 8)
     */
    set octaves(value: number) {
        validateUintRange(value, 1, 8);
        this.#octaves = value;
        this.updateUniform('octaves', value);
    }

    /**
     * [KO] 지속성(각 옥타브마다의 진폭 감소 비율)을 반환합니다.
     * [EN] Returns the persistence (rate of amplitude reduction for each octave).
     * @returns - [KO] 지속성 값 [EN] Persistence value
     */
    get persistence(): number {
        return this.#persistence;
    }

    /**
     * [KO] 지속성(각 옥타브마다의 진폭 감소 비율)을 설정합니다.
     * [EN] Sets the persistence (rate of amplitude reduction for each octave).
     * @param value - [KO] 설정할 지속성 값 (0~1 범위의 양수) [EN] Persistence value to set (positive number between 0 and 1)
     */
    set persistence(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#persistence = value;
        this.updateUniform('persistence', value);
    }

    /**
     * [KO] 간극성(각 옥타브마다의 주파수 증가 비율)을 반환합니다.
     * [EN] Returns the lacunarity (rate of frequency increase for each octave).
     * @returns - [KO] 간극성 값 [EN] Lacunarity value
     */
    get lacunarity(): number {
        return this.#lacunarity;
    }

    /**
     * [KO] 간극성(각 옥타브마다의 주파수 증가 비율)을 설정합니다.
     * [EN] Sets the lacunarity (rate of frequency increase for each octave).
     * @param value - [KO] 설정할 간극성 값 (양수) [EN] Lacunarity value to set (positive number)
     */
    set lacunarity(value: number) {
        validatePositiveNumberRange(value);
        this.#lacunarity = value;
        this.updateUniform('lacunarity', value);
    }

    /**
     * [KO] 시드 값을 반환합니다.
     * [EN] Returns the seed value.
     * @returns - [KO] 시드 값 [EN] Seed value
     */
    get seed(): number {
        return this.#seed;
    }

    /**
     * [KO] 시드 값을 설정합니다.
     * [EN] Sets the seed value.
     * @param value - [KO] 설정할 시드 값 [EN] Seed value to set
     */
    set seed(value: number) {
        this.#seed = value;
        this.updateUniform('seed', value);
    }

    /**
     * [KO] 거리 계산 방식을 반환합니다.
     * [EN] Returns the distance calculation method.
     * @returns - [KO] 거리 계산 방식 [EN] Distance calculation method
     */
    get distanceType(): number {
        return this.#distanceType;
    }

    /**
     * [KO] 거리 계산 방식을 설정합니다.
     * [EN] Sets the distance calculation method.
     * @param value - [KO] 거리 계산 방식 (VORONOI_DISTANCE_TYPE 내의 값) [EN] Distance calculation method (one of VORONOI_DISTANCE_TYPE)
     */
    set distanceType(value: number) {
        if (validDistanceTypes.includes(value)) {
            this.#distanceType = value;
            this.updateUniform('distanceType', value);
        } else {
            consoleAndThrowError(`Invalid value for distanceType. Received ${value}. Expected one of: ${validDistanceTypes.join(", ")}`);
        }
    }

    /**
     * [KO] 출력 타입을 반환합니다.
     * [EN] Returns the output type.
     * @returns - [KO] 출력 타입 [EN] Output type
     */
    get outputType(): number {
        return this.#outputType;
    }

    /**
     * [KO] 출력 타입을 설정합니다.
     * [EN] Sets the output type.
     * @param value - [KO] 출력 타입 (VORONOI_OUTPUT_TYPE 내의 값) [EN] Output type (one of VORONOI_OUTPUT_TYPE)
     */
    set outputType(value: number) {
        if (validOutputTypes.includes(value)) {
            this.#outputType = value;
            this.updateUniform('outputType', value);
        } else {
            consoleAndThrowError(`Invalid value for outputType. Received ${value}. Expected one of: ${validOutputTypes.join(", ")}`);
        }
    }

    /**
     * [KO] 지터(Jitter) 값(점들의 랜덤성 분포)을 반환합니다.
     * [EN] Returns the jitter value (randomness of the points).
     * @returns - [KO] 지터 값 [EN] Jitter value
     */
    get jitter(): number {
        return this.#jitter;
    }

    /**
     * [KO] 지터(Jitter) 값(점들의 랜덤성 분포)을 설정합니다.
     * [EN] Sets the jitter value (randomness of the points).
     * @param value - [KO] 설정할 지터 값 (0~1 범위의 양수) [EN] Jitter value to set (positive number between 0 and 1)
     */
    set jitter(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#jitter = value;
        this.updateUniform('jitter', value);
    }

    /**
     * [KO] 셀 ID 색상 강도를 반환합니다.
     * [EN] Returns the cell ID color intensity.
     * @returns - [KO] 색상 강도 [EN] Color intensity
     */
    get cellIdColorIntensity(): number {
        return this.#cellIdColorIntensity;
    }

    /**
     * [KO] 셀 ID 색상 강도를 설정합니다.
     * [EN] Sets the cell ID color intensity.
     * @param value - [KO] 설정할 색상 강도 (양수) [EN] Color intensity to set (positive number)
     */
    set cellIdColorIntensity(value: number) {
        validatePositiveNumberRange(value);
        this.#cellIdColorIntensity = value;
        this.updateUniform('cellIdColorIntensity', value);
    }

    /**
     * [KO] 시드를 랜덤한 값으로 변경합니다.
     * [EN] Randomizes the seed value.
     */
    randomizeSeed(): void {
        this.seed = Math.random() * 1000.0;
    }

    /**
     * [KO] 거리 계산 방식을 유클리드(Euclidean) 거리로 설정합니다.
     * [EN] Sets the distance calculation method to Euclidean.
     */
    setEuclideanDistance(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
    }

    /**
     * [KO] 거리 계산 방식을 맨하탄(Manhattan) 거리로 설정합니다.
     * [EN] Sets the distance calculation method to Manhattan.
     */
    setManhattanDistance(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
    }

    /**
     * [KO] 거리 계산 방식을 체비셰프(Chebyshev) 거리로 설정합니다.
     * [EN] Sets the distance calculation method to Chebyshev.
     */
    setChebyshevDistance(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.CHEBYSHEV;
    }

    /**
     * [KO] 출력 타입을 F1(가장 가까운 거리) 방식으로 설정합니다.
     * [EN] Sets the output type to F1 (closest distance).
     */
    setF1Output(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F1;
    }

    /**
     * [KO] 출력 타입을 F2(두 번째로 가까운 거리) 방식으로 설정합니다.
     * [EN] Sets the output type to F2 (second closest distance).
     */
    setF2Output(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2;
    }

    /**
     * [KO] 출력 타입을 F2 - F1(크랙 패턴) 방식으로 설정합니다.
     * [EN] Sets the output type to F2 - F1 (crack pattern).
     */
    setCrackPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
    }

    /**
     * [KO] 출력 타입을 F1 + F2(부드러운 블렌딩) 방식으로 설정합니다.
     * [EN] Sets the output type to F1 + F2 (smooth blend).
     */
    setSmoothBlend(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F1_PLUS_F2;
    }

    /**
     * [KO] 출력 타입을 셀 ID(각 셀의 고유 ID값 수치화) 방식으로 설정합니다.
     * [EN] Sets the output type to Cell ID (quantifying unique ID of each cell).
     */
    setCellIdOutput(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID;
    }

    /**
     * [KO] 출력 타입을 셀 ID 색상(각 셀마다 고유한 RGB 색상 할당) 방식으로 설정합니다.
     * [EN] Sets the output type to Cell ID Color (assigning unique RGB color for each cell).
     */
    setCellIdColorOutput(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
    }

    /**
     * [KO] 기본적인 셀룰러 패턴 프리셋을 적용합니다.
     * [EN] Applies the cellular pattern preset.
     */
    setCellularPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 1.0;
    }

    /**
     * [KO] 돌 질감 프리셋을 적용합니다.
     * [EN] Applies the stone pattern preset.
     */
    setStonePattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.8;
    }

    /**
     * [KO] 유기체(Organic) 무늬 프리셋을 적용합니다.
     * [EN] Applies the organic pattern preset.
     */
    setOrganicPattern(): void {
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
        this.jitter = 0.6;
    }

    /**
     * [KO] 완벽한 격자(Grid) 패턴 프리셋을 적용합니다.
     * [EN] Applies the grid pattern preset.
     */
    setGridPattern(): void {
        this.jitter = 0.0;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
    }

    /**
     * [KO] 크리스탈 결정 무늬 프리셋을 적용합니다.
     * [EN] Applies the crystal pattern preset.
     */
    setCrystalPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.CHEBYSHEV;
        this.jitter = 0.9;
    }

    /**
     * [KO] 스테인드글라스 무늬 프리셋을 적용합니다.
     * [EN] Applies the stained glass pattern preset.
     */
    setStainedGlassPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.7;
        this.cellIdColorIntensity = 0.8;
    }

    /**
     * [KO] 모자이크 타일 무늬 프리셋을 적용합니다.
     * [EN] Applies the mosaic pattern preset.
     */
    setMosaicPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
        this.jitter = 0.3;
        this.cellIdColorIntensity = 1.0;
    }

    /**
     * [KO] 바이옴 맵 형태의 경계선 패턴 프리셋을 적용합니다.
     * [EN] Applies the biome map pattern preset.
     */
    setBiomeMapPattern(): void {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.8;
        this.frequency = 4.0;
    }

    /**
     * [KO] 현재 적용된 모든 Voronoi 설정을 객체 형태로 반환합니다.
     * [EN] Returns all currently applied Voronoi settings in an object format.
     * @returns - [KO] 현재 설정 객체 [EN] Current settings object
     */
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

    /**
     * [KO] 설정을 일괄 적용합니다.
     * [EN] Applies settings at once.
     * @param settings - [KO] 적용할 설정의 일부 속성을 가진 객체 [EN] Object containing partial settings to apply
     */
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

    /**
     * [KO] 현재 설정된 거리 타입의 이름 문자열을 반환합니다.
     * [EN] Returns the name string of the current distance type.
     * @returns - [KO] 거리 타입 이름 [EN] Distance type name
     */
    getDistanceTypeName(): string {
        const names: { [key: number]: string } = {
            [VORONOI_DISTANCE_TYPE.EUCLIDEAN]: 'Euclidean',
            [VORONOI_DISTANCE_TYPE.MANHATTAN]: 'Manhattan',
            [VORONOI_DISTANCE_TYPE.CHEBYSHEV]: 'Chebyshev'
        };
        return names[this.#distanceType] || 'Unknown';
    }

    /**
     * [KO] 현재 설정된 출력 타입의 이름 문자열을 반환합니다.
     * [EN] Returns the name string of the current output type.
     * @returns - [KO] 출력 타입 이름 [EN] Output type name
     */
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
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import ANoiseTexture from "../core/ANoiseTexture";
import { mergerNoiseHelperFunctions, mergerNoiseUniformDefault, mergerNoiseUniformStruct } from "../core/noiseDefineMerges";
import VORONOI_DISTANCE_TYPE from "./VORONOI_DISTANCE_TYPE";
import VORONOI_OUTPUT_TYPE from "./VORONOI_OUTPUT_TYPE";
import voronoiComputeFunctions from './voronoiCompute.wgsl';
const validDistanceTypes = Object.values(VORONOI_DISTANCE_TYPE);
const validOutputTypes = Object.values(VORONOI_OUTPUT_TYPE);
const BASIC_OPTIONS = {
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
 * Voronoi 노이즈 텍스처 생성 클래스
 * 셀룰러 패턴, 돌 텍스처, 크랙 패턴, 셀 ID 출력 등을 생성할 수 있습니다.
 * @category NoiseTexture
 * @experimental
 */
class VoronoiTexture extends ANoiseTexture {
    /** 노이즈 패턴의 밀도/크기 (값이 클수록 세밀함) */
    #frequency = BASIC_OPTIONS.frequency;
    /** 거리값 스케일링 (패턴의 강도 조절) */
    #distanceScale = BASIC_OPTIONS.distanceScale;
    /** 합성할 노이즈 레이어 개수 (값이 클수록 복잡한 디테일) */
    #octaves = BASIC_OPTIONS.octaves;
    /** 각 옥타브마다 진폭 감소 비율 (값이 클수록 거친 디테일) */
    #persistence = BASIC_OPTIONS.persistence;
    /** 각 옥타브마다 주파수 증가 비율 (값이 클수록 극명한 대비) */
    #lacunarity = BASIC_OPTIONS.lacunarity;
    /** 노이즈 패턴의 시작점 (같은 시드 = 같은 패턴) */
    #seed = BASIC_OPTIONS.seed;
    /** 거리 계산 방식 (Euclidean, Manhattan, Chebyshev) */
    #distanceType = BASIC_OPTIONS.distanceType;
    /** 출력 타입 (F1, F2, F2-F1, F1+F2, CELL_ID, CELL_ID_COLOR) */
    #outputType = BASIC_OPTIONS.outputType;
    /** 점들의 랜덤성 (0=격자, 1=완전랜덤) */
    #jitter = BASIC_OPTIONS.jitter;
    /** 셀 ID 색상 강도 (셀 ID 출력 시 색상의 밝기/대비) */
    #cellIdColorIntensity = BASIC_OPTIONS.cellIdColorIntensity;
    constructor(redGPUContext, width = 1024, height = 1024, define) {
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
    get frequency() {
        return this.#frequency;
    }
    set frequency(value) {
        validatePositiveNumberRange(value);
        this.#frequency = value;
        this.updateUniform('frequency', value);
    }
    get distanceScale() {
        return this.#distanceScale;
    }
    set distanceScale(value) {
        validatePositiveNumberRange(value);
        this.#distanceScale = value;
        this.updateUniform('distanceScale', value);
    }
    get octaves() {
        return this.#octaves;
    }
    set octaves(value) {
        validateUintRange(value, 1, 8);
        this.#octaves = value;
        this.updateUniform('octaves', value);
    }
    get persistence() {
        return this.#persistence;
    }
    set persistence(value) {
        validatePositiveNumberRange(value, 0, 1);
        this.#persistence = value;
        this.updateUniform('persistence', value);
    }
    get lacunarity() {
        return this.#lacunarity;
    }
    set lacunarity(value) {
        validatePositiveNumberRange(value);
        this.#lacunarity = value;
        this.updateUniform('lacunarity', value);
    }
    get seed() {
        return this.#seed;
    }
    set seed(value) {
        this.#seed = value;
        this.updateUniform('seed', value);
    }
    get distanceType() {
        return this.#distanceType;
    }
    set distanceType(value) {
        if (validDistanceTypes.includes(value)) {
            this.#distanceType = value;
            this.updateUniform('distanceType', value);
        }
        else {
            consoleAndThrowError(`Invalid value for distanceType. Received ${value}. Expected one of: ${validDistanceTypes.join(", ")}`);
        }
    }
    get outputType() {
        return this.#outputType;
    }
    set outputType(value) {
        if (validOutputTypes.includes(value)) {
            this.#outputType = value;
            this.updateUniform('outputType', value);
        }
        else {
            consoleAndThrowError(`Invalid value for outputType. Received ${value}. Expected one of: ${validOutputTypes.join(", ")}`);
        }
    }
    get jitter() {
        return this.#jitter;
    }
    set jitter(value) {
        if (value < 0 || value > 1) {
            consoleAndThrowError(`Jitter must be between 0 and 1. Received: ${value}`);
        }
        validatePositiveNumberRange(value, 0, 1);
        this.#jitter = value;
        this.updateUniform('jitter', value);
    }
    get cellIdColorIntensity() {
        return this.#cellIdColorIntensity;
    }
    set cellIdColorIntensity(value) {
        validatePositiveNumberRange(value);
        this.#cellIdColorIntensity = value;
        this.updateUniform('cellIdColorIntensity', value);
    }
    /** 시드를 랜덤 값으로 변경 */
    randomizeSeed() {
        this.seed = Math.random() * 1000.0;
    }
    // ===========================================
    // 거리 계산 방식 편의 메서드들
    // ===========================================
    /** 유클리드 거리 (원형 패턴) */
    setEuclideanDistance() {
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
    }
    /** 맨하탄 거리 (다이아몬드 패턴) */
    setManhattanDistance() {
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
    }
    /** 체비셰프 거리 (사각형 패턴) */
    setChebyshevDistance() {
        this.distanceType = VORONOI_DISTANCE_TYPE.CHEBYSHEV;
    }
    // ===========================================
    // 출력 타입 편의 메서드들
    // ===========================================
    /** F1 출력 (가장 가까운 점까지의 거리) */
    setF1Output() {
        this.outputType = VORONOI_OUTPUT_TYPE.F1;
    }
    /** F2 출력 (두 번째 가까운 점까지의 거리) */
    setF2Output() {
        this.outputType = VORONOI_OUTPUT_TYPE.F2;
    }
    /** 크랙 패턴 (F2-F1) */
    setCrackPattern() {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
    }
    /** 부드러운 블렌드 (F1+F2) */
    setSmoothBlend() {
        this.outputType = VORONOI_OUTPUT_TYPE.F1_PLUS_F2;
    }
    /** 셀 ID 출력 (각 셀마다 고유한 회색조 값) */
    setCellIdOutput() {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID;
    }
    /** 셀 ID 컬러 출력 (각 셀마다 고유한 색상) */
    setCellIdColorOutput() {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
    }
    // ===========================================
    // 프리셋 패턴 메서드들
    // ===========================================
    /** 셀룰러 패턴 프리셋 */
    setCellularPattern() {
        this.outputType = VORONOI_OUTPUT_TYPE.F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 1.0;
    }
    /** 돌 패턴 프리셋 */
    setStonePattern() {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.8;
    }
    /** 유기체 패턴 프리셋 */
    setOrganicPattern() {
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
        this.jitter = 0.6;
    }
    /** 격자 패턴 프리셋 (정형화된 패턴) */
    setGridPattern() {
        this.jitter = 0.0;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
    }
    /** 크리스탈 패턴 프리셋 */
    setCrystalPattern() {
        this.outputType = VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
        this.distanceType = VORONOI_DISTANCE_TYPE.CHEBYSHEV;
        this.jitter = 0.9;
    }
    /** 스테인드글라스 패턴 프리셋 (컬러풀한 셀 ID) */
    setStainedGlassPattern() {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.7;
        this.cellIdColorIntensity = 0.8;
    }
    /** 모자이크 패턴 프리셋 */
    setMosaicPattern() {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID_COLOR;
        this.distanceType = VORONOI_DISTANCE_TYPE.MANHATTAN;
        this.jitter = 0.3;
        this.cellIdColorIntensity = 1.0;
    }
    /** 바이옴 맵 프리셋 (게임 지형용) */
    setBiomeMapPattern() {
        this.outputType = VORONOI_OUTPUT_TYPE.CELL_ID;
        this.distanceType = VORONOI_DISTANCE_TYPE.EUCLIDEAN;
        this.jitter = 0.8;
        this.frequency = 4.0;
    }
    // ===========================================
    // 설정 관리 메서드들
    // ===========================================
    /** 현재 설정을 반환 */
    getSettings() {
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
    /** 설정을 일괄 적용 */
    applySettings(settings) {
        if (settings.frequency !== undefined)
            this.frequency = settings.frequency;
        if (settings.distanceScale !== undefined)
            this.distanceScale = settings.distanceScale;
        if (settings.octaves !== undefined)
            this.octaves = settings.octaves;
        if (settings.persistence !== undefined)
            this.persistence = settings.persistence;
        if (settings.lacunarity !== undefined)
            this.lacunarity = settings.lacunarity;
        if (settings.seed !== undefined)
            this.seed = settings.seed;
        if (settings.distanceType !== undefined)
            this.distanceType = settings.distanceType;
        if (settings.outputType !== undefined)
            this.outputType = settings.outputType;
        if (settings.jitter !== undefined)
            this.jitter = settings.jitter;
        if (settings.cellIdColorIntensity !== undefined)
            this.cellIdColorIntensity = settings.cellIdColorIntensity;
    }
    // ===========================================
    // 정보 조회 메서드들
    // ===========================================
    /** 현재 거리 타입 이름을 반환 */
    getDistanceTypeName() {
        const names = {
            [VORONOI_DISTANCE_TYPE.EUCLIDEAN]: 'Euclidean',
            [VORONOI_DISTANCE_TYPE.MANHATTAN]: 'Manhattan',
            [VORONOI_DISTANCE_TYPE.CHEBYSHEV]: 'Chebyshev'
        };
        return names[this.#distanceType] || 'Unknown';
    }
    /** 현재 출력 타입 이름을 반환 */
    getOutputTypeName() {
        const names = {
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
export { VORONOI_DISTANCE_TYPE, VORONOI_OUTPUT_TYPE };
export default VoronoiTexture;

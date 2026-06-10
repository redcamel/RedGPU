import RedGPUContext from "../../../../context/RedGPUContext";
import ANoiseTexture, { NoiseDefine } from "../core/ANoiseTexture";
import VORONOI_DISTANCE_TYPE from "./VORONOI_DISTANCE_TYPE";
import VORONOI_OUTPUT_TYPE from "./VORONOI_OUTPUT_TYPE";
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
declare class VoronoiTexture extends ANoiseTexture {
    #private;
    /**
     * [KO] VoronoiTexture 인스턴스를 생성합니다.
     * [EN] Creates a VoronoiTexture instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 텍스처 가로 크기 [EN] Texture width
     * @param height - [KO] 텍스처 세로 크기 [EN] Texture height
     * @param define - [KO] 노이즈 정의 객체 (선택) [EN] Noise definition object (optional)
     * @param useMipmap - [KO] 밉맵 사용 여부 (기본값: true) [EN] Whether to use mipmaps (default: true)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, define?: NoiseDefine, useMipmap?: boolean);
    /**
     * [KO] 주파수(밀도/크기)를 반환합니다.
     * [EN] Returns the frequency (density/scale).
     * @returns - [KO] 주파수 값 [EN] Frequency value
     */
    get frequency(): number;
    /**
     * [KO] 주파수(밀도/크기)를 설정합니다.
     * [EN] Sets the frequency (density/scale).
     * @param value - [KO] 설정할 주파수 값 (양수) [EN] Frequency value to set (positive number)
     */
    set frequency(value: number);
    /**
     * [KO] 거리 값의 스케일을 반환합니다.
     * [EN] Returns the distance scale.
     * @returns - [KO] 거리 스케일 값 [EN] Distance scale value
     */
    get distanceScale(): number;
    /**
     * [KO] 거리 값의 스케일을 설정합니다.
     * [EN] Sets the distance scale.
     * @param value - [KO] 설정할 거리 스케일 값 (양수) [EN] Distance scale value to set (positive number)
     */
    set distanceScale(value: number);
    /**
     * [KO] 옥타브 수(합성할 노이즈 레이어 개수)를 반환합니다.
     * [EN] Returns the number of octaves (number of noise layers to combine).
     * @returns - [KO] 옥타브 수 [EN] Number of octaves
     */
    get octaves(): number;
    /**
     * [KO] 옥타브 수(합성할 노이즈 레이어 개수)를 설정합니다.
     * [EN] Sets the number of octaves (number of noise layers to combine).
     * @param value - [KO] 설정할 옥타브 수 (1~8 범위의 정수) [EN] Number of octaves to set (integer between 1 and 8)
     */
    set octaves(value: number);
    /**
     * [KO] 지속성(각 옥타브마다의 진폭 감소 비율)을 반환합니다.
     * [EN] Returns the persistence (rate of amplitude reduction for each octave).
     * @returns - [KO] 지속성 값 [EN] Persistence value
     */
    get persistence(): number;
    /**
     * [KO] 지속성(각 옥타브마다의 진폭 감소 비율)을 설정합니다.
     * [EN] Sets the persistence (rate of amplitude reduction for each octave).
     * @param value - [KO] 설정할 지속성 값 (0~1 범위의 양수) [EN] Persistence value to set (positive number between 0 and 1)
     */
    set persistence(value: number);
    /**
     * [KO] 간극성(각 옥타브마다의 주파수 증가 비율)을 반환합니다.
     * [EN] Returns the lacunarity (rate of frequency increase for each octave).
     * @returns - [KO] 간극성 값 [EN] Lacunarity value
     */
    get lacunarity(): number;
    /**
     * [KO] 간극성(각 옥타브마다의 주파수 증가 비율)을 설정합니다.
     * [EN] Sets the lacunarity (rate of frequency increase for each octave).
     * @param value - [KO] 설정할 간극성 값 (양수) [EN] Lacunarity value to set (positive number)
     */
    set lacunarity(value: number);
    /**
     * [KO] 시드 값을 반환합니다.
     * [EN] Returns the seed value.
     * @returns - [KO] 시드 값 [EN] Seed value
     */
    get seed(): number;
    /**
     * [KO] 시드 값을 설정합니다.
     * [EN] Sets the seed value.
     * @param value - [KO] 설정할 시드 값 [EN] Seed value to set
     */
    set seed(value: number);
    /**
     * [KO] 거리 계산 방식을 반환합니다.
     * [EN] Returns the distance calculation method.
     * @returns - [KO] 거리 계산 방식 [EN] Distance calculation method
     */
    get distanceType(): number;
    /**
     * [KO] 거리 계산 방식을 설정합니다.
     * [EN] Sets the distance calculation method.
     * @param value - [KO] 거리 계산 방식 (VORONOI_DISTANCE_TYPE 내의 값) [EN] Distance calculation method (one of VORONOI_DISTANCE_TYPE)
     */
    set distanceType(value: number);
    /**
     * [KO] 출력 타입을 반환합니다.
     * [EN] Returns the output type.
     * @returns - [KO] 출력 타입 [EN] Output type
     */
    get outputType(): number;
    /**
     * [KO] 출력 타입을 설정합니다.
     * [EN] Sets the output type.
     * @param value - [KO] 출력 타입 (VORONOI_OUTPUT_TYPE 내의 값) [EN] Output type (one of VORONOI_OUTPUT_TYPE)
     */
    set outputType(value: number);
    /**
     * [KO] 지터(Jitter) 값(점들의 랜덤성 분포)을 반환합니다.
     * [EN] Returns the jitter value (randomness of the points).
     * @returns - [KO] 지터 값 [EN] Jitter value
     */
    get jitter(): number;
    /**
     * [KO] 지터(Jitter) 값(점들의 랜덤성 분포)을 설정합니다.
     * [EN] Sets the jitter value (randomness of the points).
     * @param value - [KO] 설정할 지터 값 (0~1 범위의 양수) [EN] Jitter value to set (positive number between 0 and 1)
     */
    set jitter(value: number);
    /**
     * [KO] 셀 ID 색상 강도를 반환합니다.
     * [EN] Returns the cell ID color intensity.
     * @returns - [KO] 색상 강도 [EN] Color intensity
     */
    get cellIdColorIntensity(): number;
    /**
     * [KO] 셀 ID 색상 강도를 설정합니다.
     * [EN] Sets the cell ID color intensity.
     * @param value - [KO] 설정할 색상 강도 (양수) [EN] Color intensity to set (positive number)
     */
    set cellIdColorIntensity(value: number);
    /**
     * [KO] 시드를 랜덤한 값으로 변경합니다.
     * [EN] Randomizes the seed value.
     */
    randomizeSeed(): void;
    /**
     * [KO] 거리 계산 방식을 유클리드(Euclidean) 거리로 설정합니다.
     * [EN] Sets the distance calculation method to Euclidean.
     */
    setEuclideanDistance(): void;
    /**
     * [KO] 거리 계산 방식을 맨하탄(Manhattan) 거리로 설정합니다.
     * [EN] Sets the distance calculation method to Manhattan.
     */
    setManhattanDistance(): void;
    /**
     * [KO] 거리 계산 방식을 체비셰프(Chebyshev) 거리로 설정합니다.
     * [EN] Sets the distance calculation method to Chebyshev.
     */
    setChebyshevDistance(): void;
    /**
     * [KO] 출력 타입을 F1(가장 가까운 거리) 방식으로 설정합니다.
     * [EN] Sets the output type to F1 (closest distance).
     */
    setF1Output(): void;
    /**
     * [KO] 출력 타입을 F2(두 번째로 가까운 거리) 방식으로 설정합니다.
     * [EN] Sets the output type to F2 (second closest distance).
     */
    setF2Output(): void;
    /**
     * [KO] 출력 타입을 F2 - F1(크랙 패턴) 방식으로 설정합니다.
     * [EN] Sets the output type to F2 - F1 (crack pattern).
     */
    setCrackPattern(): void;
    /**
     * [KO] 출력 타입을 F1 + F2(부드러운 블렌딩) 방식으로 설정합니다.
     * [EN] Sets the output type to F1 + F2 (smooth blend).
     */
    setSmoothBlend(): void;
    /**
     * [KO] 출력 타입을 셀 ID(각 셀의 고유 ID값 수치화) 방식으로 설정합니다.
     * [EN] Sets the output type to Cell ID (quantifying unique ID of each cell).
     */
    setCellIdOutput(): void;
    /**
     * [KO] 출력 타입을 셀 ID 색상(각 셀마다 고유한 RGB 색상 할당) 방식으로 설정합니다.
     * [EN] Sets the output type to Cell ID Color (assigning unique RGB color for each cell).
     */
    setCellIdColorOutput(): void;
    /**
     * [KO] 기본적인 셀룰러 패턴 프리셋을 적용합니다.
     * [EN] Applies the cellular pattern preset.
     */
    setCellularPattern(): void;
    /**
     * [KO] 돌 질감 프리셋을 적용합니다.
     * [EN] Applies the stone pattern preset.
     */
    setStonePattern(): void;
    /**
     * [KO] 유기체(Organic) 무늬 프리셋을 적용합니다.
     * [EN] Applies the organic pattern preset.
     */
    setOrganicPattern(): void;
    /**
     * [KO] 완벽한 격자(Grid) 패턴 프리셋을 적용합니다.
     * [EN] Applies the grid pattern preset.
     */
    setGridPattern(): void;
    /**
     * [KO] 크리스탈 결정 무늬 프리셋을 적용합니다.
     * [EN] Applies the crystal pattern preset.
     */
    setCrystalPattern(): void;
    /**
     * [KO] 스테인드글라스 무늬 프리셋을 적용합니다.
     * [EN] Applies the stained glass pattern preset.
     */
    setStainedGlassPattern(): void;
    /**
     * [KO] 모자이크 타일 무늬 프리셋을 적용합니다.
     * [EN] Applies the mosaic pattern preset.
     */
    setMosaicPattern(): void;
    /**
     * [KO] 바이옴 맵 형태의 경계선 패턴 프리셋을 적용합니다.
     * [EN] Applies the biome map pattern preset.
     */
    setBiomeMapPattern(): void;
    /**
     * [KO] 현재 적용된 모든 Voronoi 설정을 객체 형태로 반환합니다.
     * [EN] Returns all currently applied Voronoi settings in an object format.
     * @returns - [KO] 현재 설정 객체 [EN] Current settings object
     */
    getSettings(): VoronoiSettings;
    /**
     * [KO] 설정을 일괄 적용합니다.
     * [EN] Applies settings at once.
     * @param settings - [KO] 적용할 설정의 일부 속성을 가진 객체 [EN] Object containing partial settings to apply
     */
    applySettings(settings: Partial<VoronoiSettings>): void;
    /**
     * [KO] 현재 설정된 거리 타입의 이름 문자열을 반환합니다.
     * [EN] Returns the name string of the current distance type.
     * @returns - [KO] 거리 타입 이름 [EN] Distance type name
     */
    getDistanceTypeName(): string;
    /**
     * [KO] 현재 설정된 출력 타입의 이름 문자열을 반환합니다.
     * [EN] Returns the name string of the current output type.
     * @returns - [KO] 출력 타입 이름 [EN] Output type name
     */
    getOutputTypeName(): string;
}
export { VORONOI_DISTANCE_TYPE, VORONOI_OUTPUT_TYPE };
export type { VoronoiSettings };
export default VoronoiTexture;

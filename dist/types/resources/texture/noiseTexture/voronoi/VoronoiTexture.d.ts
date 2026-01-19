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
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, define?: NoiseDefine);
    /** [KO] 주파수를 반환합니다. [EN] Returns the frequency. */
    get frequency(): number;
    /** [KO] 주파수를 설정합니다. [EN] Sets the frequency. */
    set frequency(value: number);
    /** [KO] 거리 스케일을 반환합니다. [EN] Returns the distance scale. */
    get distanceScale(): number;
    /** [KO] 거리 스케일을 설정합니다. [EN] Sets the distance scale. */
    set distanceScale(value: number);
    /** [KO] 옥타브 수를 반환합니다. [EN] Returns the number of octaves. */
    get octaves(): number;
    /** [KO] 옥타브 수를 설정합니다. [EN] Sets the number of octaves. */
    set octaves(value: number);
    /** [KO] 지속성을 반환합니다. [EN] Returns the persistence. */
    get persistence(): number;
    /** [KO] 지속성을 설정합니다. [EN] Sets the persistence. */
    set persistence(value: number);
    /** [KO] 간극성을 반환합니다. [EN] Returns the lacunarity. */
    get lacunarity(): number;
    /** [KO] 간극성을 설정합니다. [EN] Sets the lacunarity. */
    set lacunarity(value: number);
    /** [KO] 시드를 반환합니다. [EN] Returns the seed. */
    get seed(): number;
    /** [KO] 시드를 설정합니다. [EN] Sets the seed. */
    set seed(value: number);
    /** [KO] 거리 타입을 반환합니다. [EN] Returns the distance type. */
    get distanceType(): number;
    /** [KO] 거리 타입을 설정합니다. [EN] Sets the distance type. */
    set distanceType(value: number);
    /** [KO] 출력 타입을 반환합니다. [EN] Returns the output type. */
    get outputType(): number;
    /** [KO] 출력 타입을 설정합니다. [EN] Sets the output type. */
    set outputType(value: number);
    /** [KO] 지터(Jitter) 값을 반환합니다. [EN] Returns the jitter value. */
    get jitter(): number;
    /** [KO] 지터(Jitter) 값을 설정합니다. [EN] Sets the jitter value. */
    set jitter(value: number);
    /** [KO] 셀 ID 색상 강도를 반환합니다. [EN] Returns the cell ID color intensity. */
    get cellIdColorIntensity(): number;
    /** [KO] 셀 ID 색상 강도를 설정합니다. [EN] Sets the cell ID color intensity. */
    set cellIdColorIntensity(value: number);
    /** [KO] 시드를 랜덤하게 변경합니다. [EN] Randomizes the seed. */
    randomizeSeed(): void;
    /** [KO] 유클리드 거리 방식을 설정합니다. [EN] Sets the Euclidean distance method. */
    setEuclideanDistance(): void;
    /** [KO] 맨하탄 거리 방식을 설정합니다. [EN] Sets the Manhattan distance method. */
    setManhattanDistance(): void;
    /** [KO] 체비셰프 거리 방식을 설정합니다. [EN] Sets the Chebyshev distance method. */
    setChebyshevDistance(): void;
    /** [KO] F1 출력 방식을 설정합니다. [EN] Sets the F1 output method. */
    setF1Output(): void;
    /** [KO] F2 출력 방식을 설정합니다. [EN] Sets the F2 output method. */
    setF2Output(): void;
    /** [KO] 크랙 패턴 방식을 설정합니다. [EN] Sets the crack pattern method. */
    setCrackPattern(): void;
    /** [KO] 부드러운 블렌딩 방식을 설정합니다. [EN] Sets the smooth blend method. */
    setSmoothBlend(): void;
    /** [KO] 셀 ID 출력 방식을 설정합니다. [EN] Sets the cell ID output method. */
    setCellIdOutput(): void;
    /** [KO] 셀 ID 색상 출력 방식을 설정합니다. [EN] Sets the cell ID color output method. */
    setCellIdColorOutput(): void;
    /** [KO] 셀룰러 패턴 프리셋을 적용합니다. [EN] Applies the cellular pattern preset. */
    setCellularPattern(): void;
    /** [KO] 돌 패턴 프리셋을 적용합니다. [EN] Applies the stone pattern preset. */
    setStonePattern(): void;
    /** [KO] 유기체 패턴 프리셋을 적용합니다. [EN] Applies the organic pattern preset. */
    setOrganicPattern(): void;
    /** [KO] 격자 패턴 프리셋을 적용합니다. [EN] Applies the grid pattern preset. */
    setGridPattern(): void;
    /** [KO] 크리스탈 패턴 프리셋을 적용합니다. [EN] Applies the crystal pattern preset. */
    setCrystalPattern(): void;
    /** [KO] 스테인드글라스 패턴 프리셋을 적용합니다. [EN] Applies the stained glass pattern preset. */
    setStainedGlassPattern(): void;
    /** [KO] 모자이크 패턴 프리셋을 적용합니다. [EN] Applies the mosaic pattern preset. */
    setMosaicPattern(): void;
    /** [KO] 바이옴 맵 패턴 프리셋을 적용합니다. [EN] Applies the biome map pattern preset. */
    setBiomeMapPattern(): void;
    /** [KO] 현재 설정을 반환합니다. [EN] Returns current settings. */
    getSettings(): VoronoiSettings;
    /** [KO] 설정을 일괄 적용합니다. [EN] Applies settings at once. */
    applySettings(settings: Partial<VoronoiSettings>): void;
    /** [KO] 현재 거리 타입의 이름을 반환합니다. [EN] Returns the name of current distance type. */
    getDistanceTypeName(): string;
    /** [KO] 현재 출력 타입의 이름을 반환합니다. [EN] Returns the name of current output type. */
    getOutputTypeName(): string;
}
export { VORONOI_DISTANCE_TYPE, VORONOI_OUTPUT_TYPE };
export type { VoronoiSettings };
export default VoronoiTexture;

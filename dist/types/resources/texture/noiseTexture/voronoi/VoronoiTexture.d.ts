import RedGPUContext from "../../../../context/RedGPUContext";
import ANoiseTexture, { NoiseDefine } from "../core/ANoiseTexture";
import VORONOI_DISTANCE_TYPE from "./VORONOI_DISTANCE_TYPE";
import VORONOI_OUTPUT_TYPE from "./VORONOI_OUTPUT_TYPE";
/**
 * Voronoi 노이즈 설정을 위한 타입 인터페이스
 */
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
 * Voronoi 노이즈 텍스처 생성 클래스
 * 셀룰러 패턴, 돌 텍스처, 크랙 패턴, 셀 ID 출력 등을 생성할 수 있습니다.
 * @category NoiseTexture
 * @experimental
 */
declare class VoronoiTexture extends ANoiseTexture {
    #private;
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, define?: NoiseDefine);
    get frequency(): number;
    set frequency(value: number);
    get distanceScale(): number;
    set distanceScale(value: number);
    get octaves(): number;
    set octaves(value: number);
    get persistence(): number;
    set persistence(value: number);
    get lacunarity(): number;
    set lacunarity(value: number);
    get seed(): number;
    set seed(value: number);
    get distanceType(): number;
    set distanceType(value: number);
    get outputType(): number;
    set outputType(value: number);
    get jitter(): number;
    set jitter(value: number);
    get cellIdColorIntensity(): number;
    set cellIdColorIntensity(value: number);
    /** 시드를 랜덤 값으로 변경 */
    randomizeSeed(): void;
    /** 유클리드 거리 (원형 패턴) */
    setEuclideanDistance(): void;
    /** 맨하탄 거리 (다이아몬드 패턴) */
    setManhattanDistance(): void;
    /** 체비셰프 거리 (사각형 패턴) */
    setChebyshevDistance(): void;
    /** F1 출력 (가장 가까운 점까지의 거리) */
    setF1Output(): void;
    /** F2 출력 (두 번째 가까운 점까지의 거리) */
    setF2Output(): void;
    /** 크랙 패턴 (F2-F1) */
    setCrackPattern(): void;
    /** 부드러운 블렌드 (F1+F2) */
    setSmoothBlend(): void;
    /** 셀 ID 출력 (각 셀마다 고유한 회색조 값) */
    setCellIdOutput(): void;
    /** 셀 ID 컬러 출력 (각 셀마다 고유한 색상) */
    setCellIdColorOutput(): void;
    /** 셀룰러 패턴 프리셋 */
    setCellularPattern(): void;
    /** 돌 패턴 프리셋 */
    setStonePattern(): void;
    /** 유기체 패턴 프리셋 */
    setOrganicPattern(): void;
    /** 격자 패턴 프리셋 (정형화된 패턴) */
    setGridPattern(): void;
    /** 크리스탈 패턴 프리셋 */
    setCrystalPattern(): void;
    /** 스테인드글라스 패턴 프리셋 (컬러풀한 셀 ID) */
    setStainedGlassPattern(): void;
    /** 모자이크 패턴 프리셋 */
    setMosaicPattern(): void;
    /** 바이옴 맵 프리셋 (게임 지형용) */
    setBiomeMapPattern(): void;
    /** 현재 설정을 반환 */
    getSettings(): VoronoiSettings;
    /** 설정을 일괄 적용 */
    applySettings(settings: Partial<VoronoiSettings>): void;
    /** 현재 거리 타입 이름을 반환 */
    getDistanceTypeName(): string;
    /** 현재 출력 타입 이름을 반환 */
    getOutputTypeName(): string;
}
export { VORONOI_DISTANCE_TYPE, VORONOI_OUTPUT_TYPE };
export type { VoronoiSettings };
export default VoronoiTexture;

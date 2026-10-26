import RedGPUContext from "../../../../context/RedGPUContext";
import ANoiseTexture, { NoiseDefine } from "../core/ANoiseTexture";
import VORONOI_DISTANCE_TYPE from "./VORONOI_DISTANCE_TYPE";
import VORONOI_OUTPUT_TYPE from "./VORONOI_OUTPUT_TYPE";
/**
 * [KO] VoronoiTexture의 전체 설정 값을 담는 인터페이스입니다.
 * [EN] Interface holding all setting values of VoronoiTexture.
 *
 * @category NoiseTexture
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
 * [KO] 컴퓨트 셰이더로 Voronoi(셀룰러) 노이즈 패턴을 생성하는 텍스처입니다.
 * [EN] Texture that generates Voronoi (cellular) noise patterns using a compute shader.
 *
 * ### Example
 * ```typescript
 * const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext);
 * texture.setCrackPattern();
 * ```
 *
 * @see [Voronoi noise texture example](/RedGPU/examples/3d/noiseTexture/voronoi/basic/)
 * @experimental
 * @category NoiseTexture
 */
declare class VoronoiTexture extends ANoiseTexture {
    #private;
    /**
     * [KO] VoronoiTexture 인스턴스를 생성합니다.
     * [EN] Creates a VoronoiTexture instance.
     *
     * ### Example
     * ```typescript
     * const texture = new RedGPU.Resource.VoronoiTexture(redGPUContext, 512, 512);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 텍스처 너비 (기본값: 1024)
     * [EN] Texture width (default: 1024)
     * @param height -
     * [KO] 텍스처 높이 (기본값: 1024)
     * [EN] Texture height (default: 1024)
     * @param define -
     * [KO] 셰이더 로직을 확장하는 노이즈 정의 객체 (선택)
     * [EN] Noise definition object that extends the shader logic (optional)
     * @param useMipmap -
     * [KO] 밉맵 사용 여부 (기본값: true)
     * [EN] Whether to use mipmaps (default: true)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, define?: NoiseDefine, useMipmap?: boolean);
    /**
     * [KO] 셀 밀도를 결정하는 주파수입니다. (양수, 기본값: 8.0)
     * [EN] Frequency that determines cell density. (positive, default: 8.0)
     *
     * @returns
     * [KO] 주파수 값
     * [EN] Frequency value
     */
    get frequency(): number;
    set frequency(value: number);
    /**
     * [KO] 출력 거리 값에 곱해지는 스케일입니다. (양수, 기본값: 1.0)
     * [EN] Scale multiplied to the output distance value. (positive, default: 1.0)
     *
     * @returns
     * [KO] 거리 스케일 값
     * [EN] Distance scale value
     */
    get distanceScale(): number;
    set distanceScale(value: number);
    /**
     * [KO] 합성할 노이즈 레이어(옥타브) 수입니다. (정수 1~8, 기본값: 1)
     * [EN] Number of noise layers (octaves) to combine. (integer 1~8, default: 1)
     *
     * @returns
     * [KO] 옥타브 수
     * [EN] Number of octaves
     */
    get octaves(): number;
    set octaves(value: number);
    /**
     * [KO] 옥타브마다 적용되는 진폭 감소 비율입니다. (0~1, 기본값: 0.5)
     * [EN] Amplitude reduction ratio applied per octave. (0~1, default: 0.5)
     *
     * @returns
     * [KO] 지속성 값
     * [EN] Persistence value
     */
    get persistence(): number;
    set persistence(value: number);
    /**
     * [KO] 옥타브마다 적용되는 주파수 증가 비율입니다. (양수, 기본값: 2.0)
     * [EN] Frequency increase ratio applied per octave. (positive, default: 2.0)
     *
     * @returns
     * [KO] 간극성 값
     * [EN] Lacunarity value
     */
    get lacunarity(): number;
    set lacunarity(value: number);
    /**
     * [KO] 노이즈 패턴의 시드 값입니다.
     * [EN] Seed value of the noise pattern.
     *
     * @returns
     * [KO] 시드 값
     * [EN] Seed value
     */
    get seed(): number;
    set seed(value: number);
    /**
     * [KO] 거리 계산 방식입니다. `VORONOI_DISTANCE_TYPE` 값만 허용됩니다.
     * [EN] Distance calculation method. Only `VORONOI_DISTANCE_TYPE` values are allowed.
     *
     * @returns
     * [KO] 거리 계산 방식 값
     * [EN] Distance calculation method value
     * @throws
     * [KO] 허용되지 않은 값을 설정하면 에러가 발생합니다.
     * [EN] Throws an error if an invalid value is set.
     */
    get distanceType(): number;
    set distanceType(value: number);
    /**
     * [KO] 출력 타입입니다. `VORONOI_OUTPUT_TYPE` 값만 허용됩니다.
     * [EN] Output type. Only `VORONOI_OUTPUT_TYPE` values are allowed.
     *
     * @returns
     * [KO] 출력 타입 값
     * [EN] Output type value
     * @throws
     * [KO] 허용되지 않은 값을 설정하면 에러가 발생합니다.
     * [EN] Throws an error if an invalid value is set.
     */
    get outputType(): number;
    set outputType(value: number);
    /**
     * [KO] 셀 중심점의 무작위 분포 정도입니다. (0~1, 0이면 완전한 격자, 기본값: 1.0)
     * [EN] Degree of random distribution of cell centers. (0~1, 0 yields a perfect grid, default: 1.0)
     *
     * @returns
     * [KO] 지터 값
     * [EN] Jitter value
     */
    get jitter(): number;
    set jitter(value: number);
    /**
     * [KO] `CELL_ID_COLOR` 출력 시 적용되는 셀 색상 강도입니다. (양수, 기본값: 1.0)
     * [EN] Cell color intensity applied in `CELL_ID_COLOR` output. (positive, default: 1.0)
     *
     * @returns
     * [KO] 색상 강도
     * [EN] Color intensity
     */
    get cellIdColorIntensity(): number;
    set cellIdColorIntensity(value: number);
    /**
     * [KO] 시드를 0~1000 범위의 무작위 값으로 변경합니다.
     * [EN] Changes the seed to a random value in the range 0~1000.
     */
    randomizeSeed(): void;
    /**
     * [KO] 거리 계산 방식을 유클리드(Euclidean)로 설정합니다.
     * [EN] Sets the distance calculation method to Euclidean.
     */
    setEuclideanDistance(): void;
    /**
     * [KO] 거리 계산 방식을 맨해튼(Manhattan)으로 설정합니다.
     * [EN] Sets the distance calculation method to Manhattan.
     */
    setManhattanDistance(): void;
    /**
     * [KO] 거리 계산 방식을 체비셰프(Chebyshev)로 설정합니다.
     * [EN] Sets the distance calculation method to Chebyshev.
     */
    setChebyshevDistance(): void;
    /**
     * [KO] 출력 타입을 F1(가장 가까운 점까지의 거리)로 설정합니다.
     * [EN] Sets the output type to F1 (distance to the closest point).
     */
    setF1Output(): void;
    /**
     * [KO] 출력 타입을 F2(두 번째로 가까운 점까지의 거리)로 설정합니다.
     * [EN] Sets the output type to F2 (distance to the second closest point).
     */
    setF2Output(): void;
    /**
     * [KO] 출력 타입을 F2 - F1(셀 경계 강조, 크랙 패턴)으로 설정합니다.
     * [EN] Sets the output type to F2 - F1 (cell edge emphasis, crack pattern).
     */
    setCrackPattern(): void;
    /**
     * [KO] 출력 타입을 F1 + F2(부드러운 블렌딩)로 설정합니다.
     * [EN] Sets the output type to F1 + F2 (smooth blend).
     */
    setSmoothBlend(): void;
    /**
     * [KO] 출력 타입을 셀 ID(셀별 고유 그레이스케일 값)로 설정합니다.
     * [EN] Sets the output type to Cell ID (unique grayscale value per cell).
     */
    setCellIdOutput(): void;
    /**
     * [KO] 출력 타입을 셀 ID 색상(셀별 고유 RGB 색상)으로 설정합니다.
     * [EN] Sets the output type to Cell ID Color (unique RGB color per cell).
     */
    setCellIdColorOutput(): void;
    /**
     * [KO] 셀룰러 패턴 프리셋을 적용합니다. (F1, Euclidean, jitter 1.0)
     * [EN] Applies the cellular pattern preset. (F1, Euclidean, jitter 1.0)
     */
    setCellularPattern(): void;
    /**
     * [KO] 돌 질감 프리셋을 적용합니다. (F2 - F1, Euclidean, jitter 0.8)
     * [EN] Applies the stone pattern preset. (F2 - F1, Euclidean, jitter 0.8)
     */
    setStonePattern(): void;
    /**
     * [KO] 유기체 무늬 프리셋을 적용합니다. (Manhattan, jitter 0.6)
     * [EN] Applies the organic pattern preset. (Manhattan, jitter 0.6)
     */
    setOrganicPattern(): void;
    /**
     * [KO] 격자 패턴 프리셋을 적용합니다. (jitter 0.0, Euclidean)
     * [EN] Applies the grid pattern preset. (jitter 0.0, Euclidean)
     */
    setGridPattern(): void;
    /**
     * [KO] 크리스탈 무늬 프리셋을 적용합니다. (F2 - F1, Chebyshev, jitter 0.9)
     * [EN] Applies the crystal pattern preset. (F2 - F1, Chebyshev, jitter 0.9)
     */
    setCrystalPattern(): void;
    /**
     * [KO] 스테인드글라스 프리셋을 적용합니다. (Cell ID Color, Euclidean, jitter 0.7, 색상 강도 0.8)
     * [EN] Applies the stained glass preset. (Cell ID Color, Euclidean, jitter 0.7, color intensity 0.8)
     */
    setStainedGlassPattern(): void;
    /**
     * [KO] 모자이크 타일 프리셋을 적용합니다. (Cell ID Color, Manhattan, jitter 0.3, 색상 강도 1.0)
     * [EN] Applies the mosaic tile preset. (Cell ID Color, Manhattan, jitter 0.3, color intensity 1.0)
     */
    setMosaicPattern(): void;
    /**
     * [KO] 바이옴 맵 프리셋을 적용합니다. (Cell ID, Euclidean, jitter 0.8, frequency 4.0)
     * [EN] Applies the biome map preset. (Cell ID, Euclidean, jitter 0.8, frequency 4.0)
     */
    setBiomeMapPattern(): void;
    /**
     * [KO] 현재 설정 값을 새 객체로 반환합니다.
     * [EN] Returns the current settings as a new object.
     *
     * @returns
     * [KO] 현재 설정 객체
     * [EN] Current settings object
     */
    getSettings(): VoronoiSettings;
    /**
     * [KO] 전달된 속성만 골라 일괄 적용합니다. 각 값은 해당 setter의 유효성 검사를 거칩니다.
     * [EN] Applies only the provided properties at once. Each value passes through its setter's validation.
     *
     * ### Example
     * ```typescript
     * texture.applySettings({frequency: 4.0, jitter: 0.5});
     * ```
     *
     * @param settings -
     * [KO] 적용할 설정 (`Partial<VoronoiSettings>`)
     * [EN] Settings to apply (`Partial<VoronoiSettings>`)
     */
    applySettings(settings: Partial<VoronoiSettings>): void;
    /**
     * [KO] 현재 거리 계산 방식의 이름을 반환합니다.
     * [EN] Returns the name of the current distance calculation method.
     *
     * @returns
     * [KO] 거리 타입 이름 (알 수 없으면 'Unknown')
     * [EN] Distance type name ('Unknown' if not recognized)
     */
    getDistanceTypeName(): string;
    /**
     * [KO] 현재 출력 타입의 이름을 반환합니다.
     * [EN] Returns the name of the current output type.
     *
     * @returns
     * [KO] 출력 타입 이름 (알 수 없으면 'Unknown')
     * [EN] Output type name ('Unknown' if not recognized)
     */
    getOutputTypeName(): string;
}
export { VORONOI_DISTANCE_TYPE, VORONOI_OUTPUT_TYPE };
export type { VoronoiSettings };
export default VoronoiTexture;

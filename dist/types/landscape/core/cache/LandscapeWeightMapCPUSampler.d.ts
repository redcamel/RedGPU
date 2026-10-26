/**
 * [KO] CPU 측 가중치 맵 이미지의 픽셀 데이터 구조체입니다.
 * [EN] Pixel data structure for a CPU-side weight map image.
 *
 * @category Landscape
 */
export interface WeightMapPixelData {
    /**
     * [KO] 이미지 가로 픽셀 크기
     * [EN] Image width in pixels
     */
    width: number;
    /**
     * [KO] 이미지 세로 픽셀 크기
     * [EN] Image height in pixels
     */
    height: number;
    /**
     * [KO] RGBA 픽셀 바이트 배열 (`Uint8ClampedArray`)
     * [EN] RGBA pixel byte array (`Uint8ClampedArray`)
     */
    data: Uint8ClampedArray;
}
/**
 * [KO] 지형 레이어의 가중치 맵 이미지를 CPU 메모리로 로드하여 이중 선형 보간 샘플링을 수행하는 클래스입니다.
 * [EN] Class that loads terrain layer weight map images into CPU memory and performs bilinear interpolation sampling.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeWeightMapCPUSampler {
    #private;
    /**
     * [KO] 지정된 이미지 경로의 가중치 맵 픽셀 데이터를 비동기로 로드하고 캐싱합니다.
     * [EN] Asynchronously loads and caches weight map pixel data from the specified image path.
     *
     * @param src -
     * [KO] 가중치 맵 이미지 경로(URL)
     * [EN] Weight map image path (URL)
     * @returns
     * [KO] 로드된 픽셀 데이터 (`Promise<WeightMapPixelData | null>`)
     * [EN] Loaded pixel data (`Promise<WeightMapPixelData | null>`)
     */
    load(src: string): Promise<WeightMapPixelData | null>;
    /**
     * [KO] 정규화된 UV 좌표(`0.0` ~ `1.0`)와 채널 인덱스에 해당하는 가중치 값을 이중 선형 보간하여 반환합니다.
     * [EN] Returns the bilinearly interpolated weight value at the normalized UV coordinates (`0.0` to `1.0`) and channel index.
     *
     * @param src -
     * [KO] 가중치 맵 이미지 경로(URL)
     * [EN] Weight map image path (URL)
     * @param u -
     * [KO] 정규화된 U 좌표 (`0.0` ~ `1.0`)
     * [EN] Normalized U coordinate (`0.0` to `1.0`)
     * @param v -
     * [KO] 정규화된 V 좌표 (`0.0` ~ `1.0`)
     * [EN] Normalized V coordinate (`0.0` to `1.0`)
     * @param channelIndex -
     * [KO] 샘플링할 색상 채널 인덱스 (`0`: R, `1`: G, `2`: B, `3`: A, 기본값: `0`)
     * [EN] Color channel index to sample (`0`: R, `1`: G, `2`: B, `3`: A, default: `0`)
     * @returns
     * [KO] 샘플링된 가중치 값 (`0.0` ~ `1.0`)
     * [EN] Sampled weight value (`0.0` to `1.0`)
     */
    getWeight(src: string, u: number, v: number, channelIndex?: number): number;
    /**
     * [KO] 캐시된 모든 가중치 맵 데이터와 진행 중인 로딩 상태를 초기화합니다.
     * [EN] Clears all cached weight map data and ongoing loading states.
     */
    clear(): void;
    /**
     * [KO] 샘플러의 내부 캐시 리소스를 해제합니다.
     * [EN] Releases the internal cache resources of the sampler.
     */
    destroy(): void;
}
export default LandscapeWeightMapCPUSampler;

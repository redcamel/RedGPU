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
class LandscapeWeightMapCPUSampler {
    #cache: Map<string, WeightMapPixelData> = new Map();
    #loadingPromises: Map<string, Promise<WeightMapPixelData | null>> = new Map();

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
    async load(src: string): Promise<WeightMapPixelData | null> {
        if (!src) return null;
        const cached = this.#cache.get(src);
        if (cached) return cached;

        const ongoing = this.#loadingPromises.get(src);
        if (ongoing) return ongoing;

        const promise = new Promise<WeightMapPixelData | null>((resolve) => {
            if (typeof Image === 'undefined' || typeof document === 'undefined') {
                resolve(null);
                return;
            }
            const isCrossDomain = /^https?:\/\//i.test(src) && typeof window !== 'undefined' && !src.startsWith(window.location.origin);
            const tryLoad = (useCors: boolean) => {
                const img = new Image();
                if (useCors) {
                    img.crossOrigin = 'anonymous';
                }
                img.onload = () => {
                    try {
                        const {naturalWidth, naturalHeight, width, height} = img;
                        const canvas = document.createElement('canvas');
                        canvas.width = naturalWidth || width;
                        canvas.height = naturalHeight || height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            resolve(null);
                            return;
                        }
                        ctx.drawImage(img, 0, 0);
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const entry: WeightMapPixelData = {
                            width: canvas.width,
                            height: canvas.height,
                            data: imgData.data
                        };
                        this.#cache.set(src, entry);
                        resolve(entry);
                    } catch (e) {
                        if (useCors) {
                            tryLoad(false);
                        } else {
                            console.warn(`[LandscapeWeightMapCPUSampler] Failed to decode pixel data for ${src}:`, e);
                            resolve(null);
                        }
                    } finally {
                        this.#loadingPromises.delete(src);
                    }
                };
                img.onerror = (err) => {
                    if (useCors) {
                        tryLoad(false);
                    } else {
                        console.warn(`[LandscapeWeightMapCPUSampler] Failed to load image: ${src}`, err);
                        this.#loadingPromises.delete(src);
                        resolve(null);
                    }
                };
                img.src = src;
            };

            tryLoad(isCrossDomain);
        });

        this.#loadingPromises.set(src, promise);
        return promise;
    }

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
    getWeight(src: string, u: number, v: number, channelIndex: number = 0): number {
        const entry = this.#cache.get(src);
        if (!entry) return 0.0;

        const {width, height, data} = entry;

        const cu = u < 0.0 ? 0.0 : (u > 1.0 ? 1.0 : u);
        const cv = v < 0.0 ? 0.0 : (v > 1.0 ? 1.0 : v);

        const fx = cu * (width - 1);
        const fy = cv * (height - 1);

        const x0 = fx | 0;
        const y0 = fy | 0;
        const x1 = x0 + 1 < width ? x0 + 1 : x0;
        const y1 = y0 + 1 < height ? y0 + 1 : y0;

        const tx = fx - x0;
        const ty = fy - y0;

        const idx00 = (y0 * width + x0) << 2;
        const idx10 = (y0 * width + x1) << 2;
        const idx01 = (y1 * width + x0) << 2;
        const idx11 = (y1 * width + x1) << 2;

        const w00 = this.#sampleChannel(data, idx00, channelIndex);
        const w10 = this.#sampleChannel(data, idx10, channelIndex);
        const w01 = this.#sampleChannel(data, idx01, channelIndex);
        const w11 = this.#sampleChannel(data, idx11, channelIndex);

        const top = w00 + (w10 - w00) * tx;
        const bottom = w01 + (w11 - w01) * tx;
        return top + (bottom - top) * ty;
    }

    /**
     * [KO] 캐시된 모든 가중치 맵 데이터와 진행 중인 로딩 상태를 초기화합니다.
     * [EN] Clears all cached weight map data and ongoing loading states.
     */
    clear(): void {
        this.#cache.clear();
        this.#loadingPromises.clear();
    }

    /**
     * [KO] 샘플러의 내부 캐시 리소스를 해제합니다.
     * [EN] Releases the internal cache resources of the sampler.
     */
    destroy(): void {
        this.clear();
    }

    #sampleChannel(data: Uint8ClampedArray, idx: number, channelIndex: number): number {
        if (channelIndex === 0) return data[idx] * (1.0 / 255.0);
        if (channelIndex === 1) return data[idx + 1] * (1.0 / 255.0);
        if (channelIndex === 2) return data[idx + 2] * (1.0 / 255.0);

        const a = data[idx + 3] * (1.0 / 255.0);
        if (a >= 0.99) {
            const r = data[idx] * (1.0 / 255.0);
            const g = data[idx + 1] * (1.0 / 255.0);
            const b = data[idx + 2] * (1.0 / 255.0);
            const rem = 1.0 - (r + g + b);
            return rem < 0.0 ? 0.0 : (rem > 1.0 ? 1.0 : rem);
        }
        return a;
    }
}

Object.freeze(LandscapeWeightMapCPUSampler);
export default LandscapeWeightMapCPUSampler;

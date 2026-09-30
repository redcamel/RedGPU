/**
 * [KO] CPU 측 지형 스플랫 가중치 맵(WeightMap) 픽셀 캐시 및 이중 선형 보간 샘플러 모듈입니다.
 * [EN] CPU-side terrain splat weight map pixel cache and bilinear interpolation sampler module.
 * @packageDocumentation
 */
interface WeightMapPixelData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

/**
 * [KO] 스플랫 가중치 텍스처를 CPU 메모리에 디코딩/캐싱하고 임의 UV 좌표에서의 가중치 값을 이중선형 보간으로 샘플링하는 정적 유틸리티 클래스입니다.
 * [EN] Static utility class that decodes/caches splat weight textures in CPU memory and samples weight values at arbitrary UV coordinates using bilinear interpolation.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **CPU 측 픽셀 디코딩 및 캐싱**: 오프스크린 캔버스(`HTMLCanvasElement`)를 이용해 가중치 텍스처를 비동기 디코딩하고 `Uint8ClampedArray` 버퍼로 캐싱합니다. 중복 네트워크 요청은 `Promise` 맵으로 방지합니다.
 * - **이중 선형 보간 (Bilinear Interpolation)**: 연속적인 UV 좌표에 대해 인접한 4개의 픽셀 값을 보간 계산(`sampleBilinear`)함으로써 서브픽셀 단위의 부드럽고 왜곡 없는 가중치를 도출합니다.
 * - **식생 및 잔디 분산 배치(Scattering)의 핵심 원천**: 지형 표면에 Foliage나 Grass를 밀도 기반으로 배치할 때, CPU 측에서 특정 레이어(예: 잔디, 흙, 자갈)의 가중치를 고속 조회하여 생성 여부 및 밀도를 결정합니다.
 *
 * **[EN] Architecture & Role:**
 * - **CPU-side Pixel Decoding & Caching**: Asynchronously decodes weight map textures using offscreen canvases (`HTMLCanvasElement`) and caches them as `Uint8ClampedArray` buffers. Duplicate network requests are deduplicated via a `Promise` map.
 * - **Bilinear Interpolation**: Samples continuous UV coordinates using 4 neighboring pixels (`sampleBilinear`) to provide smooth subpixel-accurate weight values.
 * - **Core Foundation for Scattering**: Serves as the high-speed CPU query engine when scattering Foliage or Grass across the terrain based on specific layer distributions (e.g. grass, dirt, gravel).
 *
 * ::: warning
 * [KO] 이 클래스는 정적 유틸리티 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is a static utility class.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
class LandscapeWeightMapCache {
    static readonly #cache: Map<string, WeightMapPixelData> = new Map();
    static readonly #loadingPromises: Map<string, Promise<WeightMapPixelData | null>> = new Map();

    /**
     * [KO] 이미지 URL로부터 픽셀 데이터를 비동기 로드하여 캐시에 등록합니다.
     * [EN] Asynchronously loads and decodes pixel data from an image URL into cache.
     * @param src -
     * [KO] 이미지 URL 문자열
     * [EN] Image URL string
     * @returns
     * [KO] 디코딩된 픽셀 데이터 또는 실패 시 null
     * [EN] Decoded pixel data or null on failure
     */
    static async load(src: string): Promise<WeightMapPixelData | null> {
        if (!src) return null;
        const cached = LandscapeWeightMapCache.#cache.get(src);
        if (cached) return cached;

        const ongoing = LandscapeWeightMapCache.#loadingPromises.get(src);
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
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
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
                        LandscapeWeightMapCache.#cache.set(src, entry);
                        resolve(entry);
                    } catch (e) {
                        if (useCors) {
                            tryLoad(false);
                        } else {
                            console.warn(`[LandscapeWeightMapCache] Failed to decode pixel data for ${src}:`, e);
                            resolve(null);
                        }
                    } finally {
                        LandscapeWeightMapCache.#loadingPromises.delete(src);
                    }
                };
                img.onerror = (err) => {
                    if (useCors) {
                        tryLoad(false);
                    } else {
                        console.warn(`[LandscapeWeightMapCache] Failed to load image: ${src}`, err);
                        LandscapeWeightMapCache.#loadingPromises.delete(src);
                        resolve(null);
                    }
                };
                img.src = src;
            };

            tryLoad(isCrossDomain);
        });

        LandscapeWeightMapCache.#loadingPromises.set(src, promise);
        return promise;
    }

    static has(src: string): boolean {
        return LandscapeWeightMapCache.#cache.has(src);
    }

    static get(src: string): WeightMapPixelData | null {
        return LandscapeWeightMapCache.#cache.get(src) || null;
    }

    /**
     * [KO] 지정된 UV 좌표와 채널 인덱스에서 이중선형 보간을 적용하여 가중치(0.0 ~ 1.0)를 샘플링합니다.
     * [EN] Samples the weight value (0.0 to 1.0) at the specified UV coordinates and channel index using bilinear interpolation.
     * @param src -
     * [KO] 이미지 URL 문자열
     * [EN] Image URL string
     * @param u -
     * [KO] U 텍스처 좌표 (0.0 ~ 1.0)
     * [EN] U texture coordinate (0.0 to 1.0)
     * @param v -
     * [KO] V 텍스처 좌표 (0.0 ~ 1.0)
     * [EN] V texture coordinate (0.0 to 1.0)
     * @param channelIndex -
     * [KO] RGBA 채널 인덱스 (0: R, 1: G, 2: B, 3: A, 기본값: 0)
     * [EN] RGBA channel index (0: R, 1: G, 2: B, 3: A, default: 0)
     * @returns
     * [KO] 정규화된 가중치 값 (0.0 ~ 1.0)
     * [EN] Normalized weight value (0.0 to 1.0)
     */
    static getWeight(src: string, u: number, v: number, channelIndex: number = 0): number {
        const entry = LandscapeWeightMapCache.#cache.get(src);
        if (!entry) return 0.0;

        const width = entry.width;
        const height = entry.height;
        const data = entry.data;

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

        const w00 = LandscapeWeightMapCache.#sampleChannel(data, idx00, channelIndex);
        const w10 = LandscapeWeightMapCache.#sampleChannel(data, idx10, channelIndex);
        const w01 = LandscapeWeightMapCache.#sampleChannel(data, idx01, channelIndex);
        const w11 = LandscapeWeightMapCache.#sampleChannel(data, idx11, channelIndex);

        const top = w00 + (w10 - w00) * tx;
        const bottom = w01 + (w11 - w01) * tx;
        return top + (bottom - top) * ty;
    }

    static getAllWeights(src: string, u: number, v: number, outWeights: Float32Array): void {
        const entry = LandscapeWeightMapCache.#cache.get(src);
        if (!entry) {
            outWeights[0] = 0.0;
            outWeights[1] = 0.0;
            outWeights[2] = 0.0;
            outWeights[3] = 0.0;
            return;
        }

        const width = entry.width;
        const height = entry.height;
        const data = entry.data;

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

        for (let c = 0; c < 4; c++) {
            const w00 = LandscapeWeightMapCache.#sampleChannel(data, idx00, c);
            const w10 = LandscapeWeightMapCache.#sampleChannel(data, idx10, c);
            const w01 = LandscapeWeightMapCache.#sampleChannel(data, idx01, c);
            const w11 = LandscapeWeightMapCache.#sampleChannel(data, idx11, c);

            const top = w00 + (w10 - w00) * tx;
            const bottom = w01 + (w11 - w01) * tx;
            outWeights[c] = top + (bottom - top) * ty;
        }
    }

    static #sampleChannel(data: Uint8ClampedArray, idx: number, channelIndex: number): number {
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

    static clear(): void {
        LandscapeWeightMapCache.#cache.clear();
        LandscapeWeightMapCache.#loadingPromises.clear();
    }
}

Object.freeze(LandscapeWeightMapCache);
export default LandscapeWeightMapCache;

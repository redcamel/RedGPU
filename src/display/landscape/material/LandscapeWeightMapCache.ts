/**
 * [KO] 지형 스플랫맵(WeightMap)의 CPU 픽셀 데이터를 캐싱하여 식생 스폰 시 O(1) 가중치 조회를 제공하는 캐시 매니저
 * [EN] Cache manager providing O(1) weight queries from CPU pixel data of landscape weight maps during foliage generation
 */
export interface WeightMapPixelData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

class LandscapeWeightMapCache {
    static readonly #cache: Map<string, WeightMapPixelData> = new Map();
    static readonly #loadingPromises: Map<string, Promise<WeightMapPixelData | null>> = new Map();

    /**
     * [KO] 지정된 이미지 소스 경로의 스플랫맵 픽셀 데이터를 비동기로 로드하고 캐시에 보관합니다.
     * [EN] Asynchronously loads weight map pixel data from source URL and stores in cache.
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

            const img = new Image();
            img.crossOrigin = 'anonymous';
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
                    console.warn(`[LandscapeWeightMapCache] Failed to decode pixel data for ${src}:`, e);
                    resolve(null);
                } finally {
                    LandscapeWeightMapCache.#loadingPromises.delete(src);
                }
            };
            img.onerror = (err) => {
                console.warn(`[LandscapeWeightMapCache] Failed to load image: ${src}`, err);
                LandscapeWeightMapCache.#loadingPromises.delete(src);
                resolve(null);
            };
            img.src = src;
        });

        LandscapeWeightMapCache.#loadingPromises.set(src, promise);
        return promise;
    }

    /**
     * [KO] 캐시된 픽셀 데이터가 이미 존재하는지 확인합니다.
     * [EN] Checks if pixel data is already cached.
     */
    static has(src: string): boolean {
        return LandscapeWeightMapCache.#cache.has(src);
    }

    /**
     * [KO] 캐시된 픽셀 데이터를 동기적으로 반환합니다 (없으면 null).
     * [EN] Returns cached pixel data synchronously, or null if not loaded.
     */
    static get(src: string): WeightMapPixelData | null {
        return LandscapeWeightMapCache.#cache.get(src) || null;
    }

    /**
     * [KO] UV 좌표 (0.0 ~ 1.0)와 채널 인덱스(0:R, 1:G, 2:B, 3:A)로부터 가중치(0.0 ~ 1.0)를 O(1)로 조회합니다.
     * [EN] Queries weight (0.0 ~ 1.0) from UV coordinates and channel index in O(1).
     */
    static getWeight(src: string, u: number, v: number, channelIndex: number = 0): number {
        const entry = LandscapeWeightMapCache.#cache.get(src);
        if (!entry) return 1.0; // 캐시가 없으면 기본 1.0 (스폰 허용)

        const width = entry.width;
        const height = entry.height;
        const data = entry.data;

        const cu = u < 0.0 ? 0.0 : (u > 1.0 ? 1.0 : u);
        const cv = v < 0.0 ? 0.0 : (v > 1.0 ? 1.0 : v);

        const px = (cu * (width - 1) + 0.5) | 0;
        const py = (cv * (height - 1) + 0.5) | 0;

        const idx = (py * width + px) << 2;

        if (channelIndex === 0) return data[idx] * (1.0 / 255.0);
        if (channelIndex === 1) return data[idx + 1] * (1.0 / 255.0);
        if (channelIndex === 2) return data[idx + 2] * (1.0 / 255.0);

        // Alpha 채널 (4번째 레이어)
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

    /**
     * [KO] 캐시를 비웁니다.
     * [EN] Clears the cache.
     */
    static clear(): void {
        LandscapeWeightMapCache.#cache.clear();
        LandscapeWeightMapCache.#loadingPromises.clear();
    }
}

Object.freeze(LandscapeWeightMapCache);
export default LandscapeWeightMapCache;

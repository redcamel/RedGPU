export interface WeightMapPixelData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

class LandscapeWeightMapCache {
    static readonly #cache: Map<string, WeightMapPixelData> = new Map();
    static readonly #loadingPromises: Map<string, Promise<WeightMapPixelData | null>> = new Map();

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

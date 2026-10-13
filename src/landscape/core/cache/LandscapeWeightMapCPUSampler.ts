export interface WeightMapPixelData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

class LandscapeWeightMapCPUSampler {
    #cache: Map<string, WeightMapPixelData> = new Map();
    #loadingPromises: Map<string, Promise<WeightMapPixelData | null>> = new Map();

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

    has(src: string): boolean {
        return this.#cache.has(src);
    }

    get(src: string): WeightMapPixelData | null {
        return this.#cache.get(src) || null;
    }

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

    clear(): void {
        this.#cache.clear();
        this.#loadingPromises.clear();
    }

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


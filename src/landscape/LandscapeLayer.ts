import BitmapTexture from "../resources/texture/BitmapTexture";
import type RedGPUContext from "../context/RedGPUContext";
import LandscapeWeightMapCPUSampler from "./core/cache/LandscapeWeightMapCPUSampler";

export type LandscapeWeightMapChannel = 'R' | 'G' | 'B' | 'A' | 'r' | 'g' | 'b' | 'a' | 0 | 1 | 2 | 3;

export interface LandscapeLayerOptions {
    name: string;
    enabled?: boolean;
    baseColorTexture?: BitmapTexture | string;
    normalTexture?: BitmapTexture | string;
    ormTexture?: BitmapTexture | string;
    weightTexture?: BitmapTexture | string;

    uvScale?: [number, number];
    uvOffset?: [number, number];
    nearUVScaleMultiplier?: number;
    weightChannel?: LandscapeWeightMapChannel;

    roughness?: number;
    metallic?: number;
    normalIntensity?: number;
    aoIntensity?: number;
    heightBlendFactor?: number;
    stochasticTiling?: boolean;
    stochasticScale?: number;
}

class LandscapeLayer {
    #name: string;
    #enabled: boolean = true;

    #redGPUContext?: RedGPUContext;
    #baseColorTexture?: BitmapTexture;
    #normalTexture?: BitmapTexture;
    #ormTexture?: BitmapTexture;
    #weightTexture?: BitmapTexture;

    #pendingBaseColorSrc?: string;
    #pendingNormalSrc?: string;
    #pendingOrmSrc?: string;
    #pendingWeightSrc?: string;

    #uvScale: [number, number] = [20.0, 20.0];
    #uvOffset: [number, number] = [0.0, 0.0];
    #nearUVScaleMultiplier: number = 2.0;

    #weightChannel: LandscapeWeightMapChannel = 'R';
    #weightChannelIndex: number = 0;

    #roughness: number = 1.0;
    #metallic: number = 0.0;
    #normalIntensity: number = 1.0;
    #aoIntensity: number = 1.0;
    #heightBlendFactor: number = 1.0;
    #stochasticTiling: boolean = true;
    #stochasticScale: number = 1.0;

    #weightMapCPUSampler?: LandscapeWeightMapCPUSampler;
    onChange?: () => void;
    onUniformChange?: () => void;

    constructor(redGPUContextOrOptions: RedGPUContext | LandscapeLayerOptions, options?: LandscapeLayerOptions) {
        let actualOptions: LandscapeLayerOptions;
        if (options) {
            this.#redGPUContext = redGPUContextOrOptions as RedGPUContext;
            actualOptions = options;
        } else {
            actualOptions = redGPUContextOrOptions as LandscapeLayerOptions;
        }

        const {
            name,
            enabled,
            baseColorTexture,
            normalTexture,
            ormTexture,
            weightTexture,
            uvScale,
            uvOffset,
            nearUVScaleMultiplier,
            weightChannel,
            roughness,
            metallic,
            normalIntensity,
            aoIntensity,
            heightBlendFactor,
            stochasticTiling,
            stochasticScale
        } = actualOptions;

        this.#name = name;
        if (enabled !== undefined) this.#enabled = enabled;

        if (baseColorTexture !== undefined) {
            this.baseColorTexture = baseColorTexture;
        }
        if (normalTexture !== undefined) {
            this.normalTexture = normalTexture;
        }
        if (ormTexture !== undefined) {
            this.ormTexture = ormTexture;
        }
        if (weightTexture !== undefined) {
            this.weightTexture = weightTexture;
        }

        if (uvScale) {
            const [u, v] = uvScale;
            this.#uvScale[0] = u;
            this.#uvScale[1] = v;
        }

        if (uvOffset) {
            const [u, v] = uvOffset;
            this.#uvOffset[0] = u;
            this.#uvOffset[1] = v;
        }

        if (nearUVScaleMultiplier !== undefined) {
            this.#nearUVScaleMultiplier = nearUVScaleMultiplier;
        }

        if (weightChannel !== undefined) {
            this.#weightChannel = weightChannel;
        }
        this.#updateWeightChannelIndex();

        if (roughness !== undefined) {
            this.#roughness = roughness;
        }

        if (metallic !== undefined) {
            this.#metallic = metallic;
        }

        if (normalIntensity !== undefined) {
            this.#normalIntensity = normalIntensity;
        }

        if (aoIntensity !== undefined) {
            this.#aoIntensity = aoIntensity;
        }

        if (heightBlendFactor !== undefined) {
            this.#heightBlendFactor = Math.max(0.0, Math.min(5.0, heightBlendFactor));
        }

        if (stochasticTiling !== undefined) {
            this.#stochasticTiling = !!stochasticTiling;
        } else {
            this.#stochasticTiling = true;
        }

        if (stochasticScale !== undefined) {
            this.#stochasticScale = Math.max(0.01, stochasticScale);
        }
    }

    get name(): string {
        return this.#name;
    }

    get baseColorTexture(): BitmapTexture | undefined {
        return this.#baseColorTexture;
    }

    set baseColorTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#baseColorTexture = new BitmapTexture(this.#redGPUContext, val);
                this.#pendingBaseColorSrc = undefined;
            } else {
                this.#pendingBaseColorSrc = val;
                this.#baseColorTexture = undefined;
            }
        } else {
            this.#baseColorTexture = val;
            this.#pendingBaseColorSrc = undefined;
        }
        this.onChange?.();
    }

    get normalTexture(): BitmapTexture | undefined {
        return this.#normalTexture;
    }

    set normalTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#normalTexture = new BitmapTexture(this.#redGPUContext, val, true, undefined, undefined, this.#resolveLinearFormat());
                this.#pendingNormalSrc = undefined;
            } else {
                this.#pendingNormalSrc = val;
                this.#normalTexture = undefined;
            }
        } else {
            this.#normalTexture = val;
            this.#pendingNormalSrc = undefined;
        }
        this.onChange?.();
    }

    get ormTexture(): BitmapTexture | undefined {
        return this.#ormTexture;
    }

    set ormTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#ormTexture = new BitmapTexture(this.#redGPUContext, val, true, undefined, undefined, this.#resolveLinearFormat());
                this.#pendingOrmSrc = undefined;
            } else {
                this.#pendingOrmSrc = val;
                this.#ormTexture = undefined;
            }
        } else {
            this.#ormTexture = val;
            this.#pendingOrmSrc = undefined;
        }
        this.onChange?.();
    }

    get weightTexture(): BitmapTexture | undefined {
        return this.#weightTexture;
    }

    set weightTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#weightTexture = new BitmapTexture(this.#redGPUContext, val, true, undefined, undefined, this.#resolveLinearFormat());
                this.#pendingWeightSrc = undefined;
            } else {
                this.#pendingWeightSrc = val;
                this.#weightTexture = undefined;
            }
        } else {
            this.#weightTexture = val;
            this.#pendingWeightSrc = undefined;
        }
        const weightSrc = this.#weightTexture?.src || (typeof val === 'string' ? val : undefined);
        if (weightSrc && this.#weightMapCPUSampler) {
            this.#weightMapCPUSampler.load(weightSrc);
        }
        this.onChange?.();
    }

    get enabled(): boolean {
        return this.#enabled;
    }

    #resolveLinearFormat(): GPUTextureFormat {
        return 'rgba8unorm';
    }

    get uvScale(): [number, number] {
        return this.#uvScale;
    }

    set enabled(val: boolean) {
        if (this.#enabled === val) return;
        this.#enabled = val;
        this.onChange?.();
    }

    get uvOffset(): [number, number] {
        return this.#uvOffset;
    }

    set uvScale(val: [number, number]) {
        const [u, v] = val;
        if (this.#uvScale[0] === u && this.#uvScale[1] === v) return;
        this.#uvScale[0] = u;
        this.#uvScale[1] = v;
        this.onChange?.();
    }

    get nearUVScaleMultiplier(): number {
        return this.#nearUVScaleMultiplier;
    }

    set uvOffset(val: [number, number]) {
        const [u, v] = val;
        if (this.#uvOffset[0] === u && this.#uvOffset[1] === v) return;
        this.#uvOffset[0] = u;
        this.#uvOffset[1] = v;
        this.onChange?.();
    }

    get weightChannel(): LandscapeWeightMapChannel {
        return this.#weightChannel;
    }

    set nearUVScaleMultiplier(val: number) {
        const clamped = Math.max(0.1, val);
        if (this.#nearUVScaleMultiplier === clamped) return;
        this.#nearUVScaleMultiplier = clamped;
        this.onChange?.();
    }

    get weightChannelIndex(): number {
        return this.#weightChannelIndex;
    }

    set weightChannel(val: LandscapeWeightMapChannel) {
        if (this.#weightChannel === val) return;
        this.#weightChannel = val;
        this.#updateWeightChannelIndex();
        this.onChange?.();
    }

    get roughness(): number {
        return this.#roughness;
    }

    get metallic(): number {
        return this.#metallic;
    }

    set roughness(val: number) {
        if (this.#roughness === val) return;
        this.#roughness = val;
        this.onChange?.();
    }

    get normalIntensity(): number {
        return this.#normalIntensity;
    }

    set metallic(val: number) {
        if (this.#metallic === val) return;
        this.#metallic = val;
        this.onChange?.();
    }

    get aoIntensity(): number {
        return this.#aoIntensity;
    }

    set normalIntensity(val: number) {
        if (this.#normalIntensity === val) return;
        this.#normalIntensity = val;
        this.onChange?.();
    }

    set aoIntensity(val: number) {
        if (this.#aoIntensity === val) return;
        this.#aoIntensity = val;
        this.onChange?.();
    }
    #updateWeightChannelIndex(): void {
        const ch = String(this.#weightChannel).toUpperCase();
        if (ch === 'G' || ch === '1') this.#weightChannelIndex = 1;
        else if (ch === 'B' || ch === '2') this.#weightChannelIndex = 2;
        else if (ch === 'A' || ch === '3') this.#weightChannelIndex = 3;
        else this.#weightChannelIndex = 0;
    }

    resolvePendingTextures(context: RedGPUContext): void {
        this.#redGPUContext = context;
        if (this.#pendingBaseColorSrc) {
            this.#baseColorTexture = new BitmapTexture(context, this.#pendingBaseColorSrc);
            this.#pendingBaseColorSrc = undefined;
        }
        if (this.#pendingNormalSrc) {
            this.#normalTexture = new BitmapTexture(context, this.#pendingNormalSrc, true, undefined, undefined, this.#resolveLinearFormat());
            this.#pendingNormalSrc = undefined;
        }
        if (this.#pendingOrmSrc) {
            this.#ormTexture = new BitmapTexture(context, this.#pendingOrmSrc, true, undefined, undefined, this.#resolveLinearFormat());
            this.#pendingOrmSrc = undefined;
        }
        if (this.#pendingWeightSrc) {
            this.#weightTexture = new BitmapTexture(context, this.#pendingWeightSrc, true, undefined, undefined, this.#resolveLinearFormat());
            this.#pendingWeightSrc = undefined;
        }
    }

    get heightBlendFactor(): number {
        return this.#heightBlendFactor;
    }

    set heightBlendFactor(val: number) {
        const clamped = Math.max(0.0, Math.min(5.0, val));
        if (this.#heightBlendFactor !== clamped) {
            this.#heightBlendFactor = clamped;
            if (this.onUniformChange) {
                this.onUniformChange();
            } else {
                this.onChange?.();
            }
        }
    }

    get stochasticTiling(): boolean {
        return this.#stochasticTiling;
    }

    set stochasticTiling(val: boolean) {
        const boolVal = !!val;
        if (this.#stochasticTiling !== boolVal) {
            this.#stochasticTiling = boolVal;
            this.onChange?.();
        }
    }

    get stochasticScale(): number {
        return this.#stochasticScale;
    }

    set stochasticScale(val: number) {
        const clamped = Math.max(0.01, val);
        if (this.#stochasticScale !== clamped) {
            this.#stochasticScale = clamped;
            this.onChange?.();
        }
    }

    get weightMapCPUSampler(): LandscapeWeightMapCPUSampler | undefined {
        return this.#weightMapCPUSampler;
    }

    set weightMapCPUSampler(val: LandscapeWeightMapCPUSampler | undefined) {
        this.#weightMapCPUSampler = val;
        const src = this.#weightTexture?.src || this.#pendingWeightSrc;
        if (src && val) {
            val.load(src);
        }
    }

    getWeightAtUV(u: number, v: number): number {
        if (!this.#enabled) return 0.0;
        const src = this.#weightTexture?.src || this.#pendingWeightSrc;
        if (!src || !this.#weightMapCPUSampler) return 1.0;
        return this.#weightMapCPUSampler.getWeight(src, u, v, this.#weightChannelIndex);
    }

    static readonly UNIFORM_FLOAT_COUNT = 16;

    static writeZeroUniformData(targetBuffer: Float32Array, offset: number): void {
        targetBuffer.fill(0, offset, offset + 16);
    }

    writeUniformData(targetBuffer: Float32Array, offset: number): void {
        targetBuffer[offset + 0] = this.#uvOffset[0];
        targetBuffer[offset + 1] = this.#uvOffset[1];
        targetBuffer[offset + 2] = this.#uvScale[0];
        targetBuffer[offset + 3] = this.#uvScale[1];

        targetBuffer[offset + 4] = this.#roughness;
        targetBuffer[offset + 5] = this.#metallic;
        targetBuffer[offset + 6] = this.#normalIntensity;
        targetBuffer[offset + 7] = this.#enabled ? 1.0 : 0.0;

        targetBuffer[offset + 8] = this.#aoIntensity;
        targetBuffer[offset + 9] = this.#weightChannelIndex;
        targetBuffer[offset + 10] = this.#nearUVScaleMultiplier;
        targetBuffer[offset + 11] = this.#heightBlendFactor;

        targetBuffer[offset + 12] = this.#stochasticTiling ? 1.0 : 0.0;
        targetBuffer[offset + 13] = this.#stochasticScale;
        targetBuffer[offset + 14] = 0.0;
        targetBuffer[offset + 15] = 0.0;
    }
}

Object.freeze(LandscapeLayer);
export default LandscapeLayer;


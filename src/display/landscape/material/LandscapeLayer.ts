import ColorRGBA from "../../../color/ColorRGBA";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import RedGPUContext from "../../../context/RedGPUContext";

export type LandscapeWeightMapChannel = 'R' | 'G' | 'B' | 'A' | 'r' | 'g' | 'b' | 'a' | 0 | 1 | 2 | 3;

export interface LandscapeLayerOptions {
    name: string;
    enabled?: boolean;
    baseColorTexture?: BitmapTexture | string;
    normalTexture?: BitmapTexture | string;
    ormTexture?: BitmapTexture | string;

    weightTexture?: BitmapTexture | string;
    weightMapTexture?: BitmapTexture | string;
    splatTexture?: BitmapTexture | string;

    uvScale?: [number, number];
    textureScale?: [number, number];
    uvOffset?: [number, number];
    textureOffset?: [number, number];

    weightChannel?: LandscapeWeightMapChannel;
    weightMapChannel?: LandscapeWeightMapChannel;
    weightMapChannelIndex?: LandscapeWeightMapChannel;
    splatChannel?: LandscapeWeightMapChannel;

    roughness?: number;
    roughnessFactor?: number;
    metallic?: number;
    metallicFactor?: number;
    normalIntensity?: number;
    normalScale?: number;
    aoIntensity?: number;
    heightOffset?: number;
    heightContrast?: number;
    tintColor?: ColorRGBA | string;
}

export class LandscapeLayer {
    readonly name: string;
    enabled: boolean = true;

    #redGPUContext?: RedGPUContext;
    #baseColorTexture?: BitmapTexture;
    #normalTexture?: BitmapTexture;
    #ormTexture?: BitmapTexture;
    #weightTexture?: BitmapTexture;

    #pendingBaseColorSrc?: string;
    #pendingNormalSrc?: string;
    #pendingOrmSrc?: string;
    #pendingWeightSrc?: string;

    uvScale: [number, number] = [20.0, 20.0];
    uvOffset: [number, number] = [0.0, 0.0];

    weightChannel: LandscapeWeightMapChannel = 'R';

    roughness: number = 1.0;
    metallic: number = 0.0;
    normalIntensity: number = 1.0;
    aoIntensity: number = 1.0;
    heightOffset: number = 0.0;
    heightContrast: number = 1.0;

    tintColor: ColorRGBA = new ColorRGBA(255, 255, 255, 1);

    dirty: boolean = true;
    onChange?: () => void;

    constructor(redGPUContextOrOptions: RedGPUContext | LandscapeLayerOptions, options?: LandscapeLayerOptions) {
        let actualOptions: LandscapeLayerOptions;
        if (redGPUContextOrOptions instanceof RedGPUContext) {
            this.#redGPUContext = redGPUContextOrOptions;
            actualOptions = options!;
        } else {
            actualOptions = redGPUContextOrOptions;
        }

        this.name = actualOptions.name;
        if (actualOptions.enabled !== undefined) this.enabled = actualOptions.enabled;

        if (actualOptions.baseColorTexture !== undefined) {
            this.baseColorTexture = actualOptions.baseColorTexture;
        }
        if (actualOptions.normalTexture !== undefined) {
            this.normalTexture = actualOptions.normalTexture;
        }
        if (actualOptions.ormTexture !== undefined) {
            this.ormTexture = actualOptions.ormTexture;
        }
        const weightTex = actualOptions.weightTexture ?? actualOptions.weightMapTexture ?? actualOptions.splatTexture;
        if (weightTex !== undefined) {
            this.weightTexture = weightTex;
        }

        const scale = actualOptions.uvScale ?? actualOptions.textureScale;
        if (scale) this.uvScale = [...scale];

        const offset = actualOptions.uvOffset ?? actualOptions.textureOffset;
        if (offset) this.uvOffset = [...offset];

        const wCh = actualOptions.weightChannel ?? actualOptions.weightMapChannel ?? actualOptions.weightMapChannelIndex ?? actualOptions.splatChannel;
        if (wCh !== undefined) this.weightChannel = wCh;

        const rFactor = actualOptions.roughness ?? actualOptions.roughnessFactor;
        if (rFactor !== undefined) this.roughness = rFactor;

        const mFactor = actualOptions.metallic ?? actualOptions.metallicFactor;
        if (mFactor !== undefined) this.metallic = mFactor;

        const nIntensity = actualOptions.normalIntensity ?? actualOptions.normalScale;
        if (nIntensity !== undefined) this.normalIntensity = nIntensity;

        if (actualOptions.aoIntensity !== undefined) this.aoIntensity = actualOptions.aoIntensity;
        if (actualOptions.heightOffset !== undefined) this.heightOffset = actualOptions.heightOffset;
        if (actualOptions.heightContrast !== undefined) this.heightContrast = actualOptions.heightContrast;

        if (actualOptions.tintColor) {
            if (typeof actualOptions.tintColor === 'string') {
                const col = new ColorRGBA();
                col.setColorByHEX(actualOptions.tintColor);
                this.tintColor = col;
            } else {
                this.tintColor = actualOptions.tintColor;
            }
        }
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
        this.onChange?.();
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

    #resolveLinearFormat(): GPUTextureFormat {
        return navigator.gpu?.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'rgba8unorm';
    }

    get textureScale(): [number, number] {
        return this.uvScale;
    }

    set textureScale(val: [number, number]) {
        this.uvScale = val;
    }

    get textureOffset(): [number, number] {
        return this.uvOffset;
    }

    set textureOffset(val: [number, number]) {
        this.uvOffset = val;
    }

    get roughnessFactor(): number {
        return this.roughness;
    }

    set roughnessFactor(val: number) {
        this.roughness = val;
    }

    get metallicFactor(): number {
        return this.metallic;
    }

    set metallicFactor(val: number) {
        this.metallic = val;
    }

    get normalScale(): number {
        return this.normalIntensity;
    }

    set normalScale(val: number) {
        this.normalIntensity = val;
    }

    get weightMapTexture(): BitmapTexture | undefined {
        return this.weightTexture;
    }

    set weightMapTexture(val: BitmapTexture | undefined) {
        this.weightTexture = val;
    }

    get splatTexture(): BitmapTexture | undefined {
        return this.weightTexture;
    }

    set splatTexture(val: BitmapTexture | undefined) {
        this.weightTexture = val;
    }

    get weightMapChannel(): LandscapeWeightMapChannel {
        return this.weightChannel;
    }

    set weightMapChannel(val: LandscapeWeightMapChannel) {
        this.weightChannel = val;
    }

    get weightMapChannelIndex(): number {
        const ch = String(this.weightChannel).toUpperCase();
        if (ch === 'G' || ch === '1') return 1;
        if (ch === 'B' || ch === '2') return 2;
        if (ch === 'A' || ch === '3') return 3;
        return 0;
    }

    set weightMapChannelIndex(val: number) {
        if (val === 1) this.weightChannel = 'G';
        else if (val === 2) this.weightChannel = 'B';
        else if (val === 3) this.weightChannel = 'A';
        else this.weightChannel = 'R';
    }

    get splatChannel(): LandscapeWeightMapChannel {
        return this.weightChannel;
    }

    set splatChannel(val: LandscapeWeightMapChannel) {
        this.weightChannel = val;
    }
}

export default LandscapeLayer;

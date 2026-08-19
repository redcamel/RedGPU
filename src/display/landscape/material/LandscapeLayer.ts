import ColorRGBA from "../../../color/ColorRGBA";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import RedGPUContext from "../../../context/RedGPUContext";

export type LandscapeLayerBlendMode = 'SLOPE' | 'HEIGHT' | 'WEIGHT_MAP';
/** @deprecated Use LandscapeLayerBlendMode */
export type LandscapeLayerBlendType = LandscapeLayerBlendMode;

export type LandscapeWeightMapChannel = 'R' | 'G' | 'B' | 'A' | 'r' | 'g' | 'b' | 'a' | 0 | 1 | 2 | 3;

export interface LandscapeLayerOptions {
    name: string;
    enabled?: boolean;
    baseColorTexture?: BitmapTexture | string;
    normalTexture?: BitmapTexture | string;
    ormTexture?: BitmapTexture | string;
    /** Weight Mask Texture (Splatmap) for WEIGHT_MAP Blend Mode */
    weightTexture?: BitmapTexture | string;
    /** Legacy alias for weightTexture */
    weightMapTexture?: BitmapTexture | string;
    /** Legacy alias for weightTexture */
    splatTexture?: BitmapTexture | string;
    /** UE5 Standard: UV Scale [U, V] (타일당 텍스처 반복 횟수) */
    uvScale?: [number, number];
    /** Legacy alias: Texture Scale [U, V] */
    textureScale?: [number, number];
    /** UE5 Standard: UV Offset [U, V] */
    uvOffset?: [number, number];
    /** Legacy alias: Texture Offset [U, V] */
    textureOffset?: [number, number];
    /** UE5 Standard: Layer Blend Mode */
    blendMode?: LandscapeLayerBlendMode;
    /** Legacy alias: Layer Blend Type */
    blendType?: LandscapeLayerBlendMode;
    /** UE5 Standard: Weight Channel ('R' | 'G' | 'B' | 'A') */
    weightChannel?: LandscapeWeightMapChannel;
    /** Legacy alias: Weight Map Channel */
    weightMapChannel?: LandscapeWeightMapChannel;
    /** Legacy alias: Weight Map Channel Index */
    weightMapChannelIndex?: LandscapeWeightMapChannel;
    /** Legacy alias: Splat Channel */
    splatChannel?: LandscapeWeightMapChannel;
    minVal?: number;
    maxVal?: number;
    /** UE5 Standard: Blend Falloff (Feathering range) */
    blendFalloff?: number;
    /** Legacy alias: Falloff */
    falloff?: number;
    /** UE5 Standard: Roughness (0.0 ~ 1.0) */
    roughness?: number;
    /** Legacy alias: Roughness Factor */
    roughnessFactor?: number;
    /** UE5 Standard: Metallic (0.0 ~ 1.0) */
    metallic?: number;
    /** Legacy alias: Metallic Factor */
    metallicFactor?: number;
    /** UE5 Standard: Normal Map Intensity */
    normalIntensity?: number;
    /** Legacy alias: Normal Scale */
    normalScale?: number;
    /** UE5 Standard: Ambient Occlusion Intensity (0.0 ~ 2.0) */
    aoIntensity?: number;
    /** UE5 Standard: Height Offset for Height Blend Mode */
    heightOffset?: number;
    /** UE5 Standard: Height Contrast for Micro Detail Blend Mode */
    heightContrast?: number;
    tintColor?: ColorRGBA | string;
}

/**
 * [KO] UE5(Unreal Engine 5) 공식 규격 일치 Landscape 지형 PBR 머티리얼 레이어 정의 클래스입니다.
 * [EN] UE5 (Unreal Engine 5) standard compliant PBR layer definition class for Landscape terrain material.
 */
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

    /** [KO] 타일 기준 UV 스케일 [U, V] (타일당 텍스처 반복 횟수) [EN] Tile-based UV Scale [U, V] */
    uvScale: [number, number] = [20.0, 20.0];
    /** UE5 Standard: UV Offset [U, V] */
    uvOffset: [number, number] = [0.0, 0.0];

    /** UE5 Standard: Blend Mode */
    blendMode: LandscapeLayerBlendMode = 'SLOPE';
    /** UE5 Standard: Weight Channel ('R' | 'G' | 'B' | 'A') */
    weightChannel: LandscapeWeightMapChannel = 'R';
    minVal: number = 0.0;
    maxVal: number = 45.0;
    /** UE5 Standard: Blend Falloff */
    blendFalloff: number = 5.0;

    /** UE5 Standard: Roughness */
    roughness: number = 1.0;
    /** UE5 Standard: Metallic */
    metallic: number = 0.0;
    /** UE5 Standard: Normal Intensity */
    normalIntensity: number = 1.0;
    /** UE5 Standard: Ambient Occlusion Intensity */
    aoIntensity: number = 1.0;

    /** UE5 Standard: Height Offset */
    heightOffset: number = 0.0;
    /** UE5 Standard: Height Contrast */
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

        const bMode = actualOptions.blendMode ?? actualOptions.blendType;
        if (bMode) this.blendMode = bMode;

        const wCh = actualOptions.weightChannel ?? actualOptions.weightMapChannel ?? actualOptions.weightMapChannelIndex ?? actualOptions.splatChannel;
        if (wCh !== undefined) this.weightChannel = wCh;

        if (actualOptions.minVal !== undefined) this.minVal = actualOptions.minVal;
        if (actualOptions.maxVal !== undefined) this.maxVal = actualOptions.maxVal;

        const bFalloff = actualOptions.blendFalloff ?? actualOptions.falloff;
        if (bFalloff !== undefined) this.blendFalloff = bFalloff;

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

    /**
     * [KO] 문자열 경로로 등록된 텍스처들을 RedGPUContext를 주입받아 BitmapTexture 인스턴스로 자동 해결합니다.
     * [EN] Automatically resolves textures registered as string paths to BitmapTexture instances using the injected RedGPUContext.
     */
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

    // --- Legacy & UE5 Aliases for 100% Backward Compatibility ---
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

    get blendType(): LandscapeLayerBlendMode {
        return this.blendMode;
    }

    set blendType(val: LandscapeLayerBlendMode) {
        this.blendMode = val;
    }

    get falloff(): number {
        return this.blendFalloff;
    }

    set falloff(val: number) {
        this.blendFalloff = val;
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
        return 0; // 'R' or 0
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

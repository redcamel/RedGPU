import ColorRGBA from "../../../color/ColorRGBA";
import BitmapTexture from "../../../resources/texture/BitmapTexture";

export type LandscapeLayerBlendMode = 'SLOPE' | 'HEIGHT' | 'WEIGHT_MAP';
/** @deprecated Use LandscapeLayerBlendMode */
export type LandscapeLayerBlendType = LandscapeLayerBlendMode;

export interface LandscapeLayerOptions {
    name: string;
    enabled?: boolean;
    baseColorTexture?: BitmapTexture;
    normalTexture?: BitmapTexture;
    ormTexture?: BitmapTexture;
    /** UE5 Standard: UV Scale [U, V] */
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
    tintColor?: ColorRGBA | string;
}

/**
 * [KO] UE5(Unreal Engine 5) 공식 규격 일치 Landscape 지형 PBR 머티리얼 레이어 정의 클래스입니다.
 * [EN] UE5 (Unreal Engine 5) standard compliant PBR layer definition class for Landscape terrain material.
 */
export class LandscapeLayer {
    readonly name: string;
    enabled: boolean = true;

    baseColorTexture?: BitmapTexture;
    normalTexture?: BitmapTexture;
    ormTexture?: BitmapTexture;

    /** UE5 Standard: UV Scale [U, V] */
    uvScale: [number, number] = [1.0, 1.0];
    /** UE5 Standard: UV Offset [U, V] */
    uvOffset: [number, number] = [0.0, 0.0];

    /** UE5 Standard: Blend Mode */
    blendMode: LandscapeLayerBlendMode = 'SLOPE';
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

    tintColor: ColorRGBA = new ColorRGBA(255, 255, 255, 1);

    dirty: boolean = true;

    constructor(options: LandscapeLayerOptions) {
        this.name = options.name;
        if (options.enabled !== undefined) this.enabled = options.enabled;

        if (options.baseColorTexture) this.baseColorTexture = options.baseColorTexture;
        if (options.normalTexture) this.normalTexture = options.normalTexture;
        if (options.ormTexture) this.ormTexture = options.ormTexture;

        const scale = options.uvScale ?? options.textureScale;
        if (scale) this.uvScale = [...scale];

        const offset = options.uvOffset ?? options.textureOffset;
        if (offset) this.uvOffset = [...offset];

        const bMode = options.blendMode ?? options.blendType;
        if (bMode) this.blendMode = bMode;

        if (options.minVal !== undefined) this.minVal = options.minVal;
        if (options.maxVal !== undefined) this.maxVal = options.maxVal;

        const bFalloff = options.blendFalloff ?? options.falloff;
        if (bFalloff !== undefined) this.blendFalloff = bFalloff;

        const rFactor = options.roughness ?? options.roughnessFactor;
        if (rFactor !== undefined) this.roughness = rFactor;

        const mFactor = options.metallic ?? options.metallicFactor;
        if (mFactor !== undefined) this.metallic = mFactor;

        const nIntensity = options.normalIntensity ?? options.normalScale;
        if (nIntensity !== undefined) this.normalIntensity = nIntensity;

        if (options.tintColor) {
            if (typeof options.tintColor === 'string') {
                const col = new ColorRGBA();
                col.setColorByHEX(options.tintColor);
                this.tintColor = col;
            } else {
                this.tintColor = options.tintColor;
            }
        }
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
}

export default LandscapeLayer;

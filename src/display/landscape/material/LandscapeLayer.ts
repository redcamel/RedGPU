import ColorRGBA from "../../../color/ColorRGBA";
import BitmapTexture from "../../../resources/texture/BitmapTexture";

export type LandscapeLayerBlendType = 'SLOPE' | 'HEIGHT' | 'WEIGHT_MAP';

export interface LandscapeLayerOptions {
    name: string;
    enabled?: boolean;
    baseColorTexture?: BitmapTexture;
    normalTexture?: BitmapTexture;
    ormTexture?: BitmapTexture;
    textureScale?: [number, number];
    textureOffset?: [number, number];
    blendType?: LandscapeLayerBlendType;
    minVal?: number;
    maxVal?: number;
    blendFalloff?: number;
    roughnessFactor?: number;
    metallicFactor?: number;
    normalScale?: number;
    tintColor?: ColorRGBA | string;
}

/**
 * [KO] Landscape 지형 머티리얼의 단일 PBR 레이어 정의 클래스입니다.
 * [EN] Single PBR layer definition class for Landscape terrain material.
 */
export class LandscapeLayer {
    readonly name: string;
    enabled: boolean = true;

    baseColorTexture?: BitmapTexture;
    normalTexture?: BitmapTexture;
    ormTexture?: BitmapTexture;

    textureScale: [number, number] = [1.0, 1.0];
    textureOffset: [number, number] = [0.0, 0.0];

    blendType: LandscapeLayerBlendType = 'SLOPE';
    minVal: number = 0.0;
    maxVal: number = 45.0;
    blendFalloff: number = 5.0;

    roughnessFactor: number = 1.0;
    metallicFactor: number = 0.0;
    normalScale: number = 1.0;

    tintColor: ColorRGBA = new ColorRGBA(255, 255, 255, 1);

    dirty: boolean = true;

    constructor(options: LandscapeLayerOptions) {
        this.name = options.name;
        if (options.enabled !== undefined) this.enabled = options.enabled;

        if (options.baseColorTexture) this.baseColorTexture = options.baseColorTexture;
        if (options.normalTexture) this.normalTexture = options.normalTexture;
        if (options.ormTexture) this.ormTexture = options.ormTexture;

        if (options.textureScale) this.textureScale = [...options.textureScale];
        if (options.textureOffset) this.textureOffset = [...options.textureOffset];

        if (options.blendType) this.blendType = options.blendType;
        if (options.minVal !== undefined) this.minVal = options.minVal;
        if (options.maxVal !== undefined) this.maxVal = options.maxVal;
        if (options.blendFalloff !== undefined) this.blendFalloff = options.blendFalloff;

        if (options.roughnessFactor !== undefined) this.roughnessFactor = options.roughnessFactor;
        if (options.metallicFactor !== undefined) this.metallicFactor = options.metallicFactor;
        if (options.normalScale !== undefined) this.normalScale = options.normalScale;

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
}

export default LandscapeLayer;

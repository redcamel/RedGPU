import ColorRGBA from "../../../color/ColorRGBA";
import BitmapTexture from "../../../resources/texture/BitmapTexture";

export type LandscapeLayerBlendType = 'SLOPE' | 'HEIGHT' | 'WEIGHT_MAP';

export interface LandscapeLayerBlendParams {
    /** [KO] 최소 적용 범위 (Slope: 도 단위 0~90, Height: m 단위) */
    minVal?: number;
    /** [KO] 최대 적용 범위 (Slope: 도 단위 0~90, Height: m 단위) */
    maxVal?: number;
    /** [KO] 페이드/경계 감쇄 폭 (Falloff) */
    blendFalloff?: number;
    /** [KO] Heightmap 기반 마이크로 콘트라스트 가중치 */
    heightContrast?: number;
}

export interface LandscapeLayerOptions {
    name: string;
    baseColorTexture?: BitmapTexture;
    normalTexture?: BitmapTexture;
    ormTexture?: BitmapTexture;
    textureScale?: [number, number];
    textureOffset?: [number, number];
    blendType?: LandscapeLayerBlendType;
    blendParams?: LandscapeLayerBlendParams;
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

    baseColorTexture?: BitmapTexture;
    normalTexture?: BitmapTexture;
    ormTexture?: BitmapTexture;

    textureScale: [number, number] = [1.0, 1.0];
    textureOffset: [number, number] = [0.0, 0.0];

    blendType: LandscapeLayerBlendType = 'SLOPE';
    blendParams: Required<LandscapeLayerBlendParams> = {
        minVal: 0,
        maxVal: 45,
        blendFalloff: 5,
        heightContrast: 1.0
    };

    roughnessFactor: number = 1.0;
    metallicFactor: number = 0.0;
    normalScale: number = 1.0;

    tintColor: ColorRGBA = new ColorRGBA(255, 255, 255, 1);

    dirty: boolean = true;

    constructor(options: LandscapeLayerOptions) {
        this.name = options.name;

        if (options.baseColorTexture) this.baseColorTexture = options.baseColorTexture;
        if (options.normalTexture) this.normalTexture = options.normalTexture;
        if (options.ormTexture) this.ormTexture = options.ormTexture;

        if (options.textureScale) this.textureScale = [...options.textureScale];
        if (options.textureOffset) this.textureOffset = [...options.textureOffset];

        if (options.blendType) this.blendType = options.blendType;
        if (options.blendParams) {
            this.blendParams = {
                ...this.blendParams,
                ...options.blendParams
            };
        }

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

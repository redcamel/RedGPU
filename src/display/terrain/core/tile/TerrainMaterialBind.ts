import RedGPUContext from "../../../../context/RedGPUContext";
import TerrainLayerSystem from "../TerrainLayerSystem";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";

class TerrainMaterialBind extends TerrainLayerSystem {

    constructor(redGPUContext: RedGPUContext, verticesPerSide: number = 64) {
        super(redGPUContext, verticesPerSide);
    }

    get baseColorTexture(): BitmapTexture {
        return this.material.baseColorTexture;
    }

    set baseColorTexture(texture: BitmapTexture) {
        this.material.baseColorTexture = texture;
    }

    get ormTexture(): BitmapTexture {
        return this.material.ormTexture;
    }

    set ormTexture(texture: BitmapTexture) {
        this.material.ormTexture = texture;
    }

    get splatTexture(): BitmapTexture {
        return this.material.splatTexture;
    }

    set splatTexture(texture: BitmapTexture) {
        this.material.splatTexture = texture;
    }

    get tileScale(): number {
        return this.material.tileScale;
    }

    set tileScale(value: number) {
        this.material.tileScale = value;
    }

    get macroScale(): number {
        return this.material.macroScale;
    }

    set macroScale(value: number) {
        this.material.macroScale = value;
    }

    get metallicFactor(): number {
        return this.material.metallicFactor;
    }

    set metallicFactor(value: number) {
        this.material.metallicFactor = value;
    }

    get roughnessFactor(): number {
        return this.material.roughnessFactor;
    }

    set roughnessFactor(value: number) {
        this.material.roughnessFactor = value;
    }

    get normalScale(): number {
        return this.material.normalScale;
    }

    set normalScale(value: number) {
        this.material.normalScale = value;
    }

    get occlusionStrength(): number {
        return this.material.occlusionStrength;
    }

    set occlusionStrength(value: number) {
        this.material.occlusionStrength = value;
    }

    get blendContrast(): number {
        return this.material.blendContrast;
    }

    set blendContrast(value: number) {
        this.material.blendContrast = value;
    }

    get baseColorWeight(): number {
        return this.material.baseColorWeight;
    }

    set baseColorWeight(value: number) {
        this.material.baseColorWeight = value;
    }

    get baseColorBlendMode(): 'mix' | 'multiply' {
        return this.material.baseColorBlendMode;
    }

    set baseColorBlendMode(value: 'mix' | 'multiply') {
        this.material.baseColorBlendMode = value;
    }

    setup(options: {
        baseColor?: string;
        orm?: string;
        splat?: string;
    }): this {
        const ctx = this.redGPUContext;

        if (options.baseColor) {
            this.material.baseColorTexture = new BitmapTexture(ctx, options.baseColor);
        }

        if (options.orm) {
            this.material.ormTexture = new BitmapTexture(ctx, options.orm, true, null, null, 'rgba8unorm');
        }

        if (options.splat) {
            this.material.splatTexture = new BitmapTexture(ctx, options.splat, true, null, null, 'rgba8unorm');
        }

        return this;
    }
}

Object.freeze(TerrainMaterialBind);
export default TerrainMaterialBind;
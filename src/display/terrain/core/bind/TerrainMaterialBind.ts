import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../mesh/Mesh";
import TerrainGeometry from "../geometry/TerrainGeometry";
import TerrainMaterial, {TerrainLayerConfig} from "../material/TerrainMaterial";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import {sanitizeVerticesPerSide, TerrainOptions} from "../tile/TerrainTileManager";
import DirectTexture from "../../../../resources/texture/DirectTexture";

export interface TerrainMaterialBind {
    heightmapAtlasTexture: DirectTexture | BitmapTexture | null;
}

export class TerrainMaterialBind extends Mesh {
    heightmapAtlasTexture: DirectTexture | BitmapTexture | null = null;

    constructor(redGPUContext: RedGPUContext, options?: TerrainOptions) {
        const verticesPerSide = sanitizeVerticesPerSide(options?.verticesPerSide ?? 64);
        const geometry = new TerrainGeometry(redGPUContext, verticesPerSide);
        const material = new TerrainMaterial(redGPUContext, options);

        super(redGPUContext, geometry, material);
    }

    override get material(): TerrainMaterial {
        return super.material as TerrainMaterial;
    }

    override set material(val: any) {
        throw new Error('Terrain.material is read-only and cannot be reassigned.');
    }

    // ==========================================================
    // Convenience Setup

    // ==========================================================
    get layers(): TerrainLayerConfig[] {
        return this.material.layers || [];
    }

    // ==========================================================
    // Layer Proxies

    // ==========================================================
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

    // ==========================================================
    // Material Property Proxies

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

    // ==========================================================
    setup(options: {
        height?: string;
        baseColor?: string;
        orm?: string;
        splat?: string;
    }): this {
        const ctx = this.redGPUContext;

        if (options.height) {
            this.heightmapAtlasTexture = new BitmapTexture(ctx, options.height, false, null, null, 'r16float');
        }

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

    addLayer(config: TerrainLayerConfig): number {
        return this.material.addLayer(config);
    }

    removeLayer(indexOrName: number | string): boolean {
        return this.material.removeLayer(indexOrName);
    }

    updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        return this.material.updateLayer(indexOrName, partialConfig);
    }
}

export default TerrainMaterialBind;

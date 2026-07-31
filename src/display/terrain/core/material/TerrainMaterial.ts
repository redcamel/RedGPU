import RedGPUContext from "../../../../context/RedGPUContext";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import TextureArray from "../../../../resources/texture/TextureArray";
import fragmentModuleSource from './fragment.wgsl';
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import defineColorRGBA from "../../../../defineProperty/funcs/color/defineColorRGBA";
import defineTexture from "../../../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../../../defineProperty/funcs/texture/defineSampler";
import GPU_FILTER_MODE from "../../../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import defineBoolean from "../../../../defineProperty/funcs/defineBoolean";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import TerrainRVT from "../rvt/TerrainRVT";
import keepLog from "../../../../utils/keepLog";

export interface TerrainLayerConfig {
    name?: string;
    diffuse?: string | BitmapTexture;
    normal?: string | BitmapTexture;
    height?: string | BitmapTexture;
    orm?: string | BitmapTexture;
    roughnessFactor?: number;
}

interface TerrainMaterial {
    debugSplatTexture: boolean;
    baseColorFactor: [number, number, number, number] | string;
    baseColorTexture: BitmapTexture;
    splatTexture: BitmapTexture;
    diffuseArray: TextureArray;
    heightArray: TextureArray;
    normalArray: TextureArray;
    ormArray: TextureArray;
    textureSampler: Sampler;
    ormTexture: BitmapTexture;
    rvtAlbedoTexture: DirectTexture;
    rvtNormalORMTexture: DirectTexture;
    rvtSampler: Sampler;
}

class TerrainMaterial extends ABitmapBaseMaterial {
    #layers: TerrainLayerConfig[] = [];
    #rvt: TerrainRVT
    #tileScale: number = 16.0;
    #macroScale: number = 2.0;
    #blendContrast: number = 0.0;
    #metallicFactor: number = 0;
    #roughnessFactor: number = 1.0;
    #normalScale: number = 1.0;
    #occlusionStrength: number = 1.0;
    #baseColorWeight: number = 0.5;
    #baseColorBlendMode: 'mix' | 'multiply' = 'multiply';
    #bakeTimer: any = null;

    constructor(redGPUContext: RedGPUContext, name?: string) {
        super(
            redGPUContext,
            'TERRAIN_MATERIAL',
            fragmentModuleSource,
            2
        );
        if (name) (this as any).name = name;

        this.initGPURenderInfos();

        this.textureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT
        });

        this.rvtSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });

        this.#rvt = new TerrainRVT(redGPUContext, {atlasSize: 4096});

        this.rvtAlbedoTexture = this.#rvt.albedoDirectTexture
        this.rvtNormalORMTexture = this.#rvt.normalORMDirectTexture

        if (!this.__packingList) this.__packingList = [];
        this.__packingList.push(this.bakeAllRVTTiles);
    }

    get layers(): TerrainLayerConfig[] {
        return [...this.#layers];
    }

    get baseColorWeight(): number {
        return this.#baseColorWeight;
    }

    set baseColorWeight(v: number) {
        this.#baseColorWeight = v;
        this.bakeAllRVTTiles();
    }

    get baseColorBlendMode(): 'mix' | 'multiply' {
        return this.#baseColorBlendMode;
    }

    set baseColorBlendMode(v: 'mix' | 'multiply') {
        this.#baseColorBlendMode = v;
        this.bakeAllRVTTiles();
    }

    get metallicFactor(): number {
        return this.#metallicFactor;
    }

    set metallicFactor(v: number) {
        this.#metallicFactor = v;
        this.bakeAllRVTTiles();
    }

    get roughnessFactor(): number {
        return this.#roughnessFactor;
    }

    set roughnessFactor(v: number) {
        this.#roughnessFactor = v;
        this.bakeAllRVTTiles();
    }

    get normalScale(): number {
        return this.#normalScale;
    }

    set normalScale(v: number) {
        this.#normalScale = v;
        this.bakeAllRVTTiles();
    }

    get occlusionStrength(): number {
        return this.#occlusionStrength;
    }

    set occlusionStrength(v: number) {
        this.#occlusionStrength = v;
        this.bakeAllRVTTiles();
    }

    get tileScale(): number {
        return this.#tileScale;
    }

    set tileScale(v: number) {
        this.#tileScale = v;
        this.bakeAllRVTTiles();
    }

    get macroScale(): number {
        return this.#macroScale;
    }

    set macroScale(v: number) {
        this.#macroScale = v;
        this.bakeAllRVTTiles();
    }

    get blendContrast(): number {
        return this.#blendContrast;
    }

    set blendContrast(v: number) {
        this.#blendContrast = v;
        this.bakeAllRVTTiles();
    }

    public bakeAllRVTTiles = (tileCountX: number = 16, tileCountZ: number = 16): void => {
        if (!this.#rvt) return;
        for (let row = 0; row < tileCountZ; row++) {
            for (let col = 0; col < tileCountX; col++) {
                this.#rvt.bakeTile(this, col, row, tileCountX, tileCountZ);
            }
        }
    };

    public bakeRVTTile(tileCol: number, tileRow: number, tileCountX: number = 16, tileCountZ: number = 16): void {
        if (this.#rvt) {
            this.#rvt.bakeTile(this, tileCol, tileRow, tileCountX, tileCountZ);
        }
    }

    override updateTexture(prevTexture: any, texture: any) {
        super.updateTexture(prevTexture, texture);
        this.bakeAllRVTTiles();
    }

    public addLayer(config: TerrainLayerConfig): number {
        if (this.#layers.length >= 4) {
            consoleAndThrowError("TerrainMaterial supports a maximum of 4 layers.");
        }
        this.#layers.push(config);
        this.#rebuildLayerTextureArrays();
        this.bakeAllRVTTiles();
        return this.#layers.length - 1;
    }

    public removeLayer(indexOrName: number | string): boolean {
        const targetIndex = typeof indexOrName === 'string'
            ? this.#layers.findIndex(l => l.name === indexOrName)
            : indexOrName;

        if (targetIndex >= 0 && targetIndex < this.#layers.length) {
            this.#layers.splice(targetIndex, 1);
            this.#rebuildLayerTextureArrays();
            this.bakeAllRVTTiles();
            return true;
        }
        return false;
    }

    public updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        const targetIndex = typeof indexOrName === 'string'
            ? this.#layers.findIndex(l => l.name === indexOrName)
            : indexOrName;

        if (targetIndex >= 0 && targetIndex < this.#layers.length) {
            this.#layers[targetIndex] = {...this.#layers[targetIndex], ...partialConfig};
            this.#rebuildLayerTextureArrays();
            this.bakeAllRVTTiles();
            return true;
        }
        return false;
    }

    #rebuildLayerTextureArrays(): void {
        if (this.#layers.length === 0) return;

        const extractSrc = (val: string | BitmapTexture | undefined): string => {
            if (!val) return '';
            if (typeof val === 'string') return val;
            if ('src' in val && typeof (val as any).src === 'string') return (val as any).src;
            return '';
        };

        const diffuseSrcs: string[] = [];
        const normalSrcs: string[] = [];
        const heightSrcs: string[] = [];
        const ormSrcs: string[] = [];

        this.#layers.forEach((layer, idx) => {
            const dSrc = extractSrc(layer.diffuse);
            diffuseSrcs.push(dSrc);

            const nSrc = extractSrc(layer.normal) || dSrc;
            normalSrcs.push(nSrc);

            const hSrc = extractSrc(layer.height) || dSrc;
            heightSrcs.push(hSrc);

            const oSrc = extractSrc(layer.orm) || dSrc;
            ormSrcs.push(oSrc);

        });

        const ctx = this.redGPUContext;
        const onLoad = (v) => {
            keepLog('오긴오냐', this.uuid)
            this.bakeAllRVTTiles();
        }
        this.diffuseArray = new TextureArray(ctx, diffuseSrcs, true, onLoad, undefined, 'rgba8unorm-srgb');
        this.normalArray = new TextureArray(ctx, normalSrcs, true, onLoad, undefined, 'rgba8unorm');
        this.heightArray = new TextureArray(ctx, heightSrcs, true, onLoad, undefined, 'rgba8unorm');
        this.ormArray = new TextureArray(ctx, ormSrcs, true, onLoad, undefined, 'rgba8unorm');

    }
}

Object.defineProperty(TerrainMaterial.prototype, 'isPBRMaterial', {
    value: true,
    writable: false
});

defineBoolean(TerrainMaterial, [
    {key: 'debugSplatTexture', value: false},
]);

defineColorRGBA(TerrainMaterial, [
    {key: 'baseColorFactor', value: '#ffffff'}
]);

defineTexture(TerrainMaterial, [
    {key: 'baseColorTexture'},
    {key: 'splatTexture'},
    {key: 'ormTexture'},
    {key: 'rvtAlbedoTexture'},
    {key: 'rvtNormalORMTexture'},
]);

defineSampler(TerrainMaterial, [
    {key: 'rvtSampler'},
]);

Object.freeze(TerrainMaterial);
export default TerrainMaterial;

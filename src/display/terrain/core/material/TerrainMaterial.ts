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
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import TerrainRVT from "../rvt/TerrainRVT";

export interface TerrainLayerConfig {
    name?: string;
    diffuse?: string | BitmapTexture;
    normal?: string | BitmapTexture;
    height?: string | BitmapTexture;
    orm?: string | BitmapTexture;
    roughnessFactor?: number;
}

export interface TerrainMaterialOptions {
    atlasSize?: number;
}

interface TerrainMaterial {
    invAtlasDim: number;
    targetTerrain?: any;
    debugSplatTexture: boolean;
    debugHeightTexture: boolean;
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
    rvtPageTableTexture: DirectTexture;
    rvtSampler: Sampler;
}

class TerrainMaterial extends ABitmapBaseMaterial {
    targetTerrain?: any;
    #layers: TerrainLayerConfig[] = [];
    #rvt: TerrainRVT
    #tileScale: number = 32.0;
    #macroScale: number = 2.0;
    #blendContrast: number = 0.85;
    #metallicFactor: number = 0;
    #roughnessFactor: number = 1.0;
    #normalScale: number = 1.0;
    #occlusionStrength: number = 1.0;
    #baseColorWeight: number = 0.5;
    #baseColorBlendMode: 'mix' | 'multiply' = 'multiply';

    constructor(
        redGPUContext: RedGPUContext,
        nameOrOptions?: string | TerrainMaterialOptions,
        options?: TerrainMaterialOptions
    ) {
        super(
            redGPUContext,
            'TERRAIN_MATERIAL',
            fragmentModuleSource,
            2
        );

        let name: string | undefined;
        let finalOptions: TerrainMaterialOptions = {};

        if (typeof nameOrOptions === 'string') {
            name = nameOrOptions;
            if (options) finalOptions = options;
        } else if (nameOrOptions && typeof nameOrOptions === 'object') {
            finalOptions = nameOrOptions;
        }

        if (name) (this as any).name = name;

        this.initGPURenderInfos();

        this.textureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT,
            maxAnisotropy: 16
        });

        this.rvtSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            maxAnisotropy: 16
        });

        const atlasSize = finalOptions.atlasSize ?? (4096 * 2);
        this.invAtlasDim = 1.0 / atlasSize;
        this.#rvt = new TerrainRVT(redGPUContext, {atlasSize});

        this.rvtAlbedoTexture = this.#rvt.albedoDirectTexture as DirectTexture;
        this.rvtNormalORMTexture = this.#rvt.normalORMDirectTexture as DirectTexture;
        this.rvtPageTableTexture = this.#rvt.pageTableDirectTexture as DirectTexture;

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

    #bakePromise: Promise<void> | null = null;
    #latestTileCountX = 16;
    #latestTileCountZ = 16;

    public bakeAllRVTTiles = (tileCountX: number = 16, tileCountZ: number = 16): void => {
        this.#latestTileCountX = tileCountX;
        this.#latestTileCountZ = tileCountZ;

        if (this.#bakePromise) return;

        this.#bakePromise = Promise.resolve().then(() => {
            this.#bakePromise = null;
            if (!this.#rvt) return;
            this.#rvt.bakeAll(this);
        });
    };

    public bakeRVT = (tileCountX: number = 16, tileCountZ: number = 16): void => {
        this.bakeAllRVTTiles(tileCountX, tileCountZ);
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
        return this.#layers.length - 1;
    }

    public removeLayer(indexOrName: number | string): boolean {
        const targetIndex = typeof indexOrName === 'string'
            ? this.#layers.findIndex(l => l.name === indexOrName)
            : indexOrName;

        if (targetIndex >= 0 && targetIndex < this.#layers.length) {
            this.#layers.splice(targetIndex, 1);
            this.#rebuildLayerTextureArrays();
            return true;
        }
        return false;
    }

    public updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        const targetIndex = typeof indexOrName === 'string'
            ? this.#layers.findIndex(l => l.name === indexOrName)
            : indexOrName;

        if (targetIndex >= 0 && targetIndex < this.#layers.length) {
            const oldLayer = this.#layers[targetIndex];
            const newLayer = {...oldLayer, ...partialConfig};

            const isTextureChanged =
                ('diffuse' in partialConfig && extractSrc(oldLayer.diffuse) !== extractSrc(newLayer.diffuse)) ||
                ('normal' in partialConfig && extractSrc(oldLayer.normal) !== extractSrc(newLayer.normal)) ||
                ('height' in partialConfig && extractSrc(oldLayer.height) !== extractSrc(newLayer.height)) ||
                ('orm' in partialConfig && extractSrc(oldLayer.orm) !== extractSrc(newLayer.orm));

            this.#layers[targetIndex] = newLayer;

            if (isTextureChanged) {
                this.#rebuildLayerTextureArrays();
            } else {
                this.bakeAllRVTTiles();
            }
            return true;
        }
        return false;
    }

    override destroy(): void {
        if (this.#rvt) {
            this.#rvt.destroy();
            this.#rvt = null!;
        }
        if (this.diffuseArray) {
            this.diffuseArray.destroy();
            this.diffuseArray = null!;
        }
        if (this.normalArray) {
            this.normalArray.destroy();
            this.normalArray = null!;
        }
        if (this.heightArray) {
            this.heightArray.destroy();
            this.heightArray = null!;
        }
        if (this.ormArray) {
            this.ormArray.destroy();
            this.ormArray = null!;
        }
        super.destroy();
    }

    #rebuildLayerTextureArrays(): void {
        if (this.#layers.length === 0) return;

        if (this.diffuseArray) {
            this.diffuseArray.destroy();
            this.diffuseArray = null!;
        }
        if (this.normalArray) {
            this.normalArray.destroy();
            this.normalArray = null!;
        }
        if (this.heightArray) {
            this.heightArray.destroy();
            this.heightArray = null!;
        }
        const diffuseSrcs: string[] = [];
        const normalSrcs: string[] = [];
        const heightSrcs: string[] = [];
        const ormSrcs: string[] = [];

        this.#layers.forEach((layer) => {
            const dSrc = extractSrc(layer.diffuse);
            diffuseSrcs.push(dSrc);

            const nSrc = extractSrc(layer.normal);
            normalSrcs.push(nSrc);

            const hSrc = extractSrc(layer.height);
            heightSrcs.push(hSrc);

            const oSrc = extractSrc(layer.orm);
            ormSrcs.push(oSrc);
        });

        const ctx = this.redGPUContext;

        const createTextureArrayPromise = (srcs: string[], format: GPUTextureFormat): Promise<TextureArray | null> => {
            const hasValidSrc = srcs.some(src => !!src && src.trim() !== '');
            if (!hasValidSrc) return Promise.resolve(null);

            return new Promise((resolve) => {
                let instance: TextureArray;
                instance = new TextureArray(
                    ctx,
                    srcs,
                    true,
                    () => resolve(instance),
                    () => resolve(null),
                    format
                );
            });
        };

        Promise.all([
            createTextureArrayPromise(diffuseSrcs, 'rgba8unorm-srgb'),
            createTextureArrayPromise(normalSrcs, 'rgba8unorm'),
            createTextureArrayPromise(heightSrcs, 'rgba8unorm'),
            createTextureArrayPromise(ormSrcs, 'rgba8unorm')
        ]).then(([dArr, nArr, hArr, oArr]) => {
            this.diffuseArray = dArr!;
            this.normalArray = nArr!;
            this.heightArray = hArr!;
            this.ormArray = oArr!;
            this.bakeAllRVTTiles();
        });
    }
}

Object.defineProperty(TerrainMaterial.prototype, 'isPBRMaterial', {
    value: true,
    writable: false
});

defineBoolean(TerrainMaterial, [
    {key: 'debugSplatTexture', value: false},
    {key: 'debugHeightTexture', value: false},
]);

defineNumber(TerrainMaterial, [
    {key: 'invAtlasDim', value: 1.0 / 8192.0},
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
    {key: 'rvtPageTableTexture'},
]);

defineSampler(TerrainMaterial, [
    {key: 'rvtSampler'},
]);

const extractSrc = (val: string | BitmapTexture | undefined): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (val instanceof BitmapTexture || ('src' in val && typeof (val as any).src === 'string')) {
        return (val as BitmapTexture).src;
    }
    return '';
};

Object.freeze(TerrainMaterial);
export default TerrainMaterial;

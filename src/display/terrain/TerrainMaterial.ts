import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import TextureArray from "../../resources/texture/TextureArray";
import fragmentModuleSource from './fragment.wgsl';
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";
import defineColorRGBA from "../../defineProperty/funcs/color/defineColorRGBA";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";
import consoleAndThrowError from "../../utils/consoleAndThrowError";

export interface TerrainLayerConfig {
    name?: string;
    diffuse?: string | BitmapTexture;
    normal?: string | BitmapTexture;
    height?: string | BitmapTexture;
    orm?: string | BitmapTexture;
    roughnessFactor?: number;
}

interface TerrainMaterial {
    metallicFactor: number;
    roughnessFactor: number;
    normalScale: number;
    tileScale: number;
    macroScale: number;
    occlusionStrength: number;
    blendContrast: number;
    grassRoughnessFactor: number;
    sandRoughnessFactor: number;
    rockRoughnessFactor: number;
    gravelRoughnessFactor: number;
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
}

/**
 * [KO] CDLOD 지형 렌더링에 사용되는 전용 물리 기반(PBR) 머티리얼 클래스입니다.
 * [EN] Dedicated physical-based (PBR) material class used for CDLOD terrain rendering.
 */
class TerrainMaterial extends ABitmapBaseMaterial {
    #layers: TerrainLayerConfig[] = [];

    constructor(redGPUContext: RedGPUContext, name?: string) {
        super(
            redGPUContext,
            'TERRAIN_MATERIAL',
            fragmentModuleSource,
            2
        );
        if (name) (this as any).name = name;

        this.initGPURenderInfos();

        // 💡 지형 타일링 텍스처의 반복(Repeat) 매핑을 위한 선형 필터링 샘플러 (밉맵 및 이방성 필터링 적용)
        this.textureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT
        });
    }

    get layers(): TerrainLayerConfig[] {
        return [...this.#layers];
    }

    /**
     * [KO] 단일 지형 디테일 레이어를 추가합니다. (최대 4개)
     * [EN] Adds a single terrain detail layer. (Maximum 4)
     */
    public addLayer(config: TerrainLayerConfig): number {
        if (this.#layers.length >= 4) {
            consoleAndThrowError("TerrainMaterial supports a maximum of 4 layers.");
        }
        this.#layers.push(config);
        this.#rebuildLayerTextureArrays();
        return this.#layers.length - 1;
    }

    /**
     * [KO] 인덱스 또는 이름을 기준으로 특정 레이어를 제거합니다.
     * [EN] Removes a specific layer by index or name.
     */
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

    /**
     * [KO] 인덱스 또는 이름을 기준으로 특정 레이어의 속성을 부분 수정합니다.
     * [EN] Partially updates properties of a specific layer by index or name.
     */
    public updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        const targetIndex = typeof indexOrName === 'string'
            ? this.#layers.findIndex(l => l.name === indexOrName)
            : indexOrName;

        if (targetIndex >= 0 && targetIndex < this.#layers.length) {
            this.#layers[targetIndex] = {...this.#layers[targetIndex], ...partialConfig};
            this.#rebuildLayerTextureArrays();
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

            if (layer.roughnessFactor !== undefined) {
                switch (idx) {
                    case 0:
                        this.grassRoughnessFactor = layer.roughnessFactor;
                        break;
                    case 1:
                        this.sandRoughnessFactor = layer.roughnessFactor;
                        break;
                    case 2:
                        this.rockRoughnessFactor = layer.roughnessFactor;
                        break;
                    case 3:
                        this.gravelRoughnessFactor = layer.roughnessFactor;
                        break;
                }
            }
        });

        const ctx = this.redGPUContext;
        // 💡 Diffuse(Albedo)는 sRGB 포맷, 데이터 맵(Normal/Height/ORM)은 Linear(rgba8unorm) 포맷으로 내부 자동 설정
        this.diffuseArray = new TextureArray(ctx, diffuseSrcs, true, undefined, undefined, 'rgba8unorm-srgb');
        this.normalArray = new TextureArray(ctx, normalSrcs, true, undefined, undefined, 'rgba8unorm');
        this.heightArray = new TextureArray(ctx, heightSrcs, true, undefined, undefined, 'rgba8unorm');
        this.ormArray = new TextureArray(ctx, ormSrcs, true, undefined, undefined, 'rgba8unorm');
    }
}

Object.defineProperty(TerrainMaterial.prototype, 'isPBRMaterial', {
    value: true,
    writable: false
});

defineNumber(TerrainMaterial, [
    {key: 'metallicFactor', value: 0},
    {key: 'roughnessFactor', value: 0.85},
    {key: 'normalScale', value: 1.0},
    {key: 'tileScale', value: 1.0},
    {key: 'macroScale', value: 1.0},
    {key: 'occlusionStrength', value: 1.0},
    {key: 'blendContrast', value: 0.0},
    //
    {key: 'grassRoughnessFactor', value: 0.85},
    {key: 'sandRoughnessFactor', value: 0.80},
    {key: 'rockRoughnessFactor', value: 0.65},
    {key: 'gravelRoughnessFactor', value: 0.70},
]);
defineBoolean(TerrainMaterial, [
    {key: 'debugSplatTexture', value: false}
]);

defineColorRGBA(TerrainMaterial, [
    {key: 'baseColorFactor', value: '#ffffff'}
]);

defineTexture(TerrainMaterial, [
    {key: 'baseColorTexture'},
    {key: 'splatTexture'},
    {key: 'diffuseArray'},
    {key: 'heightArray'},
    {key: 'normalArray'},
    {key: 'ormArray'},
    {key: 'ormTexture'}
]);

defineSampler(TerrainMaterial, [
    {key: 'textureSampler'}
]);
Object.freeze(TerrainMaterial);
export default TerrainMaterial;


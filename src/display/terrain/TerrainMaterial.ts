import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import DirectTexture from "../../resources/texture/DirectTexture";
import TextureArray from "../../resources/texture/TextureArray";
import fragmentModuleSource from './fragment.wgsl';
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";
import defineColorRGBA from "../../defineProperty/funcs/color/defineColorRGBA";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import TerrainRVT from "./TerrainRVT";
import updateTargetUniform from "../../defineProperty/core/updateTargetUniform";
import {keepLog} from "../../utils";

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
    // RVT 전용 바인딩 슬롯
    rvtAlbedoTexture: DirectTexture;
    rvtNormalORMTexture: DirectTexture;
    rvtSampler: Sampler;
}

/**
 * [KO] CDLOD 지형 렌더링에 사용되는 전용 물리 기반(PBR) 머티리얼 클래스입니다.
 * [EN] Dedicated physical-based (PBR) material class used for CDLOD terrain rendering.
 */
class TerrainMaterial extends ABitmapBaseMaterial {
    #layers: TerrainLayerConfig[] = [];
    #rvt: TerrainRVT
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

        // 💡 RVT 아틀라스 텍스처용 선형 필터링 샘플러 (클램프 모드, 아틀라스 경계 보호)
        this.rvtSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });

        this.#rvt = new TerrainRVT(redGPUContext, {atlasSize: 2048});

        this.rvtAlbedoTexture = this.#rvt.albedoDirectTexture
        this.rvtNormalORMTexture = this.#rvt.normalORMDirectTexture

        if (!this.__packingList) this.__packingList = [];
        this.__packingList.push(this.bakeRVT);
        this.bakeRVT();
    }

    #tileScale: number = 1.0;
    #macroScale: number = 1.0;
    #blendContrast: number = 0.0;

    get layers(): TerrainLayerConfig[] {
        return [...this.#layers];
    }

    #metallicFactor: number = 0;
    #roughnessFactor: number = 0.85;
    #normalScale: number = 1.0;
    #occlusionStrength: number = 1.0;
    #grassRoughnessFactor: number = 0.85;
    #sandRoughnessFactor: number = 0.80;
    #rockRoughnessFactor: number = 0.65;
    #gravelRoughnessFactor: number = 0.70;

    get rvt(): TerrainRVT {
        return this.#rvt;
    }

    get metallicFactor(): number {
        return this.#metallicFactor;
    }

    set metallicFactor(v: number) {
        this.#metallicFactor = v;
        updateTargetUniform(this, 'metallicFactor', v);
        this.bakeRVT();
    }

    get roughnessFactor(): number {
        return this.#roughnessFactor;
    }

    set roughnessFactor(v: number) {
        this.#roughnessFactor = v;
        updateTargetUniform(this, 'roughnessFactor', v);
        this.bakeRVT();
    }

    get normalScale(): number {
        return this.#normalScale;
    }

    set normalScale(v: number) {
        this.#normalScale = v;
        updateTargetUniform(this, 'normalScale', v);
        this.bakeRVT();
    }

    get occlusionStrength(): number {
        return this.#occlusionStrength;
    }

    set occlusionStrength(v: number) {
        this.#occlusionStrength = v;
        updateTargetUniform(this, 'occlusionStrength', v);
        this.bakeRVT();
    }

    get tileScale(): number {
        return this.#tileScale;
    }

    set tileScale(v: number) {
        this.#tileScale = v;
        updateTargetUniform(this, 'tileScale', v);
        this.bakeRVT();
    }

    get macroScale(): number {
        return this.#macroScale;
    }

    set macroScale(v: number) {
        this.#macroScale = v;
        updateTargetUniform(this, 'macroScale', v);
        this.bakeRVT();
    }

    get blendContrast(): number {
        return this.#blendContrast;
    }

    set blendContrast(v: number) {
        this.#blendContrast = v;
        updateTargetUniform(this, 'blendContrast', v);
        this.bakeRVT();
    }

    get grassRoughnessFactor(): number {
        return this.#grassRoughnessFactor;
    }

    set grassRoughnessFactor(v: number) {
        this.#grassRoughnessFactor = v;
        updateTargetUniform(this, 'grassRoughnessFactor', v);
        this.bakeRVT();
    }

    get sandRoughnessFactor(): number {
        return this.#sandRoughnessFactor;
    }

    set sandRoughnessFactor(v: number) {
        this.#sandRoughnessFactor = v;
        updateTargetUniform(this, 'sandRoughnessFactor', v);
        this.bakeRVT();
    }

    get rockRoughnessFactor(): number {
        return this.#rockRoughnessFactor;
    }

    set rockRoughnessFactor(v: number) {
        this.#rockRoughnessFactor = v;
        updateTargetUniform(this, 'rockRoughnessFactor', v);
        this.bakeRVT();
    }

    get gravelRoughnessFactor(): number {
        return this.#gravelRoughnessFactor;
    }

    set gravelRoughnessFactor(v: number) {
        this.#gravelRoughnessFactor = v;
        updateTargetUniform(this, 'gravelRoughnessFactor', v);
        this.bakeRVT();
    }

    bakeRVT = () => {
        if (this.#rvt) {
            this.#rvt.bake(this);
        }
    };

    override updateTexture(prevTexture: any, texture: any) {
        super.updateTexture(prevTexture, texture);
        this.bakeRVT();
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
        this.bakeRVT();
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
            this.bakeRVT();
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
            this.bakeRVT();
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
        const onLoad = (v) => {
            keepLog('오긴오냐', this.uuid)
            this.bakeRVT();
        }
        // 💡 Diffuse(Albedo)는 sRGB 포맷, 데이터 맵(Normal/Height/ORM)은 Linear(rgba8unorm) 포맷으로 내부 자동 설정
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
    // RVT 아틀라스 텍스처 슬롯
    {key: 'rvtAlbedoTexture'},
    {key: 'rvtNormalORMTexture'},
]);

defineSampler(TerrainMaterial, [
    {key: 'rvtSampler'},
]);

Object.freeze(TerrainMaterial);
export default TerrainMaterial;


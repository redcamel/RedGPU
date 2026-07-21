import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import TextureArray from "../../resources/texture/TextureArray";
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl';
import defineNumber from "../../defineProperty/funcs/number/defineNumber";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";
import defineColorRGBA from "../../defineProperty/funcs/color/defineColorRGBA";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";

interface TerrainMaterial {
    metallicFactor: number;
    roughnessFactor: number;
    normalScale: number;
    tileScale: number;
    macroScale: number;
    baseColorFactor: [number, number, number, number];
    baseColorTexture: BitmapTexture;
    useBaseColorTexture: boolean;
    splatMap: BitmapTexture;
    diffuseArray: TextureArray;
    normalArray: TextureArray;
    textureSampler: Sampler;
}

/**
 * [KO] CDLOD 지형 렌더링에 사용되는 전용 물리 기반(PBR) 머티리얼 클래스입니다.
 * [EN] Dedicated physical-based (PBR) material class used for CDLOD terrain rendering.
 */
class TerrainMaterial extends ABitmapBaseMaterial {
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
}

Object.defineProperty(TerrainMaterial.prototype, 'isPBRMaterial', {
    value: true,
    writable: false
});

defineNumber(TerrainMaterial, [
    {key: 'metallicFactor', value: 0},
    {key: 'roughnessFactor', value: 0.85},
    {key: 'normalScale', value: 1.0},
    {key: 'tileScale', value: 50.0},
    {key: 'macroScale', value: 26.5}
]);

defineBoolean(TerrainMaterial, [
    {key: 'useBaseColorTexture', value: false}
]);

defineColorRGBA(TerrainMaterial, [
    {key: 'baseColorFactor', value: '#7f7361'}
]);

defineTexture(TerrainMaterial, [
    {key: 'baseColorTexture'},
    {key: 'splatMap'},
    {key: 'diffuseArray'},
    {key: 'normalArray'}
]);

defineSampler(TerrainMaterial, [
    {key: 'textureSampler'}
]);

Object.freeze(TerrainMaterial);
export default TerrainMaterial;

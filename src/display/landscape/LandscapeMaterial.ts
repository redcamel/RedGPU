import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import AUVTransformBaseMaterial from "../../material/core/AUVTransformBaseMaterial";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import landscapeFragmentSource from "./shader/landscapeFragment.wgsl";
import defineColorRGBA from "../../defineProperty/funcs/color/defineColorRGBA";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";

interface LandscapeMaterial {
    color: ColorRGBA;
    roughnessFactor: number;
    metallicFactor: number;
    occlusionStrength: number;
    baseColorTexture: BitmapTexture;
    ormTexture: BitmapTexture;
    baseColorTextureSampler: Sampler;
}

/**
 * [KO] Landscape 지형 시스템 전용 PBR 머티리얼 클래스입니다 (UE5 PBR ORM: Occlusion, Roughness, Metallic & Occlusion Strength 지원).
 * [EN] PBR material class dedicated to Landscape terrain system (Supports UE5 PBR ORM: Occlusion, Roughness, Metallic & Occlusion Strength).
 */
class LandscapeMaterial extends AUVTransformBaseMaterial {
    constructor(redGPUContext: RedGPUContext, colorHex: string = '#ffffff', baseColorTexture?: BitmapTexture) {
        super(
            redGPUContext,
            'LANDSCAPE_MATERIAL',
            landscapeFragmentSource,
            2 // RedGPU 표준 머티리얼 그룹 인덱스 2
        );

        this.baseColorTextureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT
        });

        this.baseColorTexture = baseColorTexture;
        this.color.setColorByHEX(colorHex);
        this.roughnessFactor = 1.0;
        this.metallicFactor = 0.0;
        this.occlusionStrength = 1.0;
        this.textureScale = [160, 160];
        this.initGPURenderInfos();
    }
}

defineColorRGBA(LandscapeMaterial, [
    {key: 'color'}
]);

defineNumber(LandscapeMaterial, [
    {key: 'roughnessFactor', value: 1.0, min: 0, max: 1},
    {key: 'metallicFactor', value: 0.0, min: 0, max: 1},
    {key: 'occlusionStrength', value: 1.0, min: 0, max: 2}
]);

defineSampler(LandscapeMaterial, [
    {key: 'baseColorTextureSampler'}
]);

defineTexture(LandscapeMaterial, [
    {key: 'baseColorTexture'},
    {key: 'ormTexture'}
]);

export {LandscapeMaterial};
export default LandscapeMaterial;

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

interface LandscapeMaterial {
    color: ColorRGBA;
    baseColorTexture: BitmapTexture;
    baseColorTextureSampler: Sampler;
}

/**
 * [KO] Landscape 지형 시스템 전용 머티리얼 클래스입니다 (RedGPU PBRMaterial 네이밍 표준 및 @group(2) 규격 완전 준수).
 * [EN] Material class dedicated to Landscape terrain system (Fully compliant with RedGPU PBRMaterial naming standard & @group(2) material group).
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
        this.initGPURenderInfos();
    }
}

defineColorRGBA(LandscapeMaterial, [
    {key: 'color'}
]);

defineSampler(LandscapeMaterial, [
    {key: 'baseColorTextureSampler'}
]);

defineTexture(LandscapeMaterial, [
    {key: 'baseColorTexture'}
]);

export {LandscapeMaterial};
export default LandscapeMaterial;

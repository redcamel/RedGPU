import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";
import Sampler from "../../resources/sampler/Sampler";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import landscapeFragmentSource from "./shader/landscapeFragment.wgsl";
import defineColorRGBA from "../../defineProperty/funcs/color/defineColorRGBA";

interface LandscapeMaterial {
    color: ColorRGBA;
}

/**
 * [KO] Landscape 지형 시스템 전용 단일 머티리얼 클래스입니다 (지형 컬러, LOD 디버그, 높이맵 파이프라인 원스톱 전담).
 * [EN] Single material class dedicated to Landscape terrain system (One-stop for terrain color, LOD debug, heightmap pipeline).
 */
class LandscapeMaterial extends ABitmapBaseMaterial {
    #textureSampler: Sampler;

    constructor(redGPUContext: RedGPUContext, colorHex: string = '#387d42') {
        super(
            redGPUContext,
            'LANDSCAPE_MATERIAL',
            landscapeFragmentSource,
            1
        );

        this.initGPURenderInfos();

        this.textureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT,
            maxAnisotropy: 16
        });

        this.color.setColorByHEX(colorHex);
    }

    public get textureSampler(): Sampler {
        return this.#textureSampler;
    }

    public set textureSampler(val: Sampler) {
        this.#textureSampler = val;
    }
}

defineColorRGBA(LandscapeMaterial, [
    {key: 'color'}
]);

export {LandscapeMaterial};
export default LandscapeMaterial;

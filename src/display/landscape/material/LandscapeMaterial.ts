import RedGPUContext from "../../../context/RedGPUContext.js";
import DirectTexture from "../../../resources/texture/DirectTexture.js";
import BitmapTexture from "../../../resources/texture/BitmapTexture.js";
import AUVTransformBaseMaterial from "../../../material/core/AUVTransformBaseMaterial.js";
import Sampler from "../../../resources/sampler/Sampler.js";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler.js";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture.js";
import landscapeFragmentSource from "./landscapeFragment.wgsl";

export interface LandscapeMaterial {
    diffuseTexture: BitmapTexture | DirectTexture | any;
    diffuseTextureSampler: Sampler;
}

/**
 * [KO] LandscapeMaterial (통합 높이맵 텍스처 렌더링 전용 재질 - 전체 지형 월드 UV 지원)
 * [EN] LandscapeMaterial (Integrated Heightmap Texture Material - World UV Support)
 */
export class LandscapeMaterial extends AUVTransformBaseMaterial {
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: any, name?: string) {
        super(
            redGPUContext,
            'LANDSCAPE_MATERIAL',
            landscapeFragmentSource,
            2
        );
        if (name) this.name = name;
        this.diffuseTexture = diffuseTexture;
        this.diffuseTextureSampler = new Sampler(this.redGPUContext);
        this.initGPURenderInfos();
    }
}

defineSampler(LandscapeMaterial, [
    {key: 'diffuseTextureSampler'}
]);
defineTexture(LandscapeMaterial, [
    {key: 'diffuseTexture'}
]);
Object.defineProperty(LandscapeMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});

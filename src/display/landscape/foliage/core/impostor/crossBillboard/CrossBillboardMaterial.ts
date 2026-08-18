import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../../../resources/texture/BitmapTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import fragmentModuleSource from './crossBillboardFragment.wgsl';
import AUVTransformBaseMaterial from "../../../../../../material/core/AUVTransformBaseMaterial";
import defineSampler from "../../../../../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../../../../../defineProperty/funcs/texture/defineTexture";
import GPU_BLEND_FACTOR from "../../../../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_MIPMAP_FILTER_MODE from "../../../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";

/**
 * [KO] 언리얼 엔진 5 스타일 십자 빌보드(Cross-Billboard Impostor) 식생 전용 초경량 머티리얼입니다.
 * [EN] Unreal Engine 5 style ultra-lightweight material dedicated for foliage Cross-Billboard Impostors.
 */
interface CrossBillboardMaterial {
    diffuseTexture: BitmapTexture | DirectTexture;
    diffuseTextureSampler: Sampler;
    useCutOff: boolean;
    cutOff: number;
    doubleSided: boolean;
    alphaBlend: number;
}

class CrossBillboardMaterial extends AUVTransformBaseMaterial {
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture | DirectTexture, name?: string) {
        super(
            redGPUContext,
            'CROSS_BILLBOARD_MATERIAL',
            fragmentModuleSource,
            2
        );
        if (name) this.name = name;
        this.diffuseTexture = diffuseTexture;
        this.diffuseTextureSampler = new Sampler(this.redGPUContext);
        this.diffuseTextureSampler.mipmapFilter = GPU_MIPMAP_FILTER_MODE.LINEAR;

        // 🌟 기본값: 언리얼 엔진 표준 MASK 모드 & 양면 렌더링
        this.useCutOff = true;
        this.cutOff = 0.5;
        this.doubleSided = true;
        this.transparent = false;
        this.alphaBlend = 1; // 1 = MASK / OPAQUE

        const {blendColorState, blendAlphaState} = this;
        if (blendColorState && blendAlphaState) {
            blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
            blendColorState.dstFactor = GPU_BLEND_FACTOR.ZERO;
            blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE;
            blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ZERO;
        }

        this.initGPURenderInfos();
    }
}

defineSampler(CrossBillboardMaterial, [
    {key: 'diffuseTextureSampler'}
]);
defineTexture(CrossBillboardMaterial, [
    {key: 'diffuseTexture'}
]);
Object.defineProperty(CrossBillboardMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});

Object.freeze(CrossBillboardMaterial);
export default CrossBillboardMaterial;

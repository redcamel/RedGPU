import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import fragmentModuleSource from './fragment.wgsl';
import defineColorRGB from "../../../defineProperty/funcs/color/defineColorRGB";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineVector2 from "../../../defineProperty/funcs/vector/defineVector2";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";

interface SingleLayerWaterMaterial {
    /**
     * [KO] PBR 표준 수면 기본 알베도 컬러(ColorRGB)
     * [EN] PBR standard water surface base albedo color (ColorRGB)
     */
    baseColor: ColorRGB;
    /**
     * [KO] 수면 노멀 맵 텍스처
     * [EN] Water surface normal map texture
     */
    normalTexture: BitmapTexture;
    /**
     * [KO] 수면 노멀 맵 샘플러
     * [EN] Water surface normal map sampler
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 노멀 강도 스케일
     * [EN] Normal strength scale
     */
    normalScale: number;
    /**
     * [KO] 노멀 텍스처 UV 타일링 배수
     * [EN] Normal texture UV tiling multiplier
     */
    normalTiling: number;
    /**
     * [KO] 바람에 의한 물결 스크롤 속도
     * [EN] Wave scrolling speed by wind
     */
    windSpeed: number;
    /**
     * [KO] 바람 방향 벡터 [X, Y]
     * [EN] Wind direction vector [X, Y]
     */
    windDirection: [number, number];
    /**
     * [KO] PBR 마이크로패싯 표면 거칠기 (Roughness, 0.0 ~ 1.0, 물 기본값: 0.05)
     * [EN] PBR microfacet surface roughness (Roughness, 0.0 ~ 1.0, water default: 0.05)
     */
    roughness: number;
    /**
     * [KO] PBR 스펙큘러 반사율 스케일링 팩터 (물 기본값: 1.0)
     * [EN] PBR specular reflectance scaling factor (water default: 1.0)
     */
    specularFactor: number;
}

/**
 * [KO] 언리얼 엔진 5(UE5)의 SingleLayerWater 셰이딩 모델에 대응하는 PBR 표준 수체 머티리얼 클래스입니다.
 * [EN] Dedicated PBR water rendering material class corresponding to Unreal Engine 5 (UE5) SingleLayerWater shading model.
 *
 * [KO] Cook-Torrance GGX 마이크로패싯 조명 모델과 시간(t) 기반 물결 노멀 스크롤링을 지원합니다.
 * [EN] Supports Cook-Torrance GGX microfacet lighting model and time(t)-based wave normal scrolling.
 *
 * @category Material
 */
class SingleLayerWaterMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] SingleLayerWaterMaterial 생성자
     * [EN] SingleLayerWaterMaterial constructor
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param baseColor - 기본 수면 HEX 컬러 (기본값: '#1a5b8c')
     * @param opacity - 기본 수면 불투명도 (기본값: 0.7)
     */
    constructor(redGPUContext: RedGPUContext, baseColor: string = '#1a5b8c', opacity: number = 0.7) {
        super(
            redGPUContext,
            'SINGLE_LAYER_WATER_MATERIAL',
            fragmentModuleSource,
            2
        );
        this.transparent = true;

        // 물결 텍스처 무한 스크롤 반복을 위한 repeat 샘플러 장착
        this.normalTextureSampler = new Sampler(this.redGPUContext, {
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: 'repeat',
            addressModeV: 'repeat',
            addressModeW: 'repeat',
        });

        this.initGPURenderInfos();
        this.baseColor.setColorByHEX(baseColor);
        this.opacity = opacity;

        // Premultiplied Alpha 블렌딩 설정: 스펙큘러가 opacity에 의해 깎이지 않고 100% 온전하게 빛나도록 보존
        this.blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
        this.blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;

        this.normalScale = 0.8;
        this.normalTiling = 3.5;
        this.windSpeed = 0.04;
        this.windDirection = [1.0, 0.3];
        this.roughness = 0.05;
        this.specularFactor = 1.0;
    }

    /**
     * [KO] 하위 호환성을 위한 color getter/setter
     * [EN] color getter/setter for backwards compatibility
     */
    get color(): ColorRGB {
        return this.baseColor;
    }

}

defineColorRGB(SingleLayerWaterMaterial, [
    {key: 'baseColor'},
]);

defineTexture(SingleLayerWaterMaterial, [
    {key: 'normalTexture'},
]);

defineSampler(SingleLayerWaterMaterial, [
    {key: 'normalTextureSampler'},
]);

definePositiveNumber(SingleLayerWaterMaterial, [
    {key: 'normalScale', value: 0.8},
    {key: 'normalTiling', value: 3.5},
    {key: 'windSpeed', value: 0.04},
    {key: 'roughness', value: 0.05},
    {key: 'specularFactor', value: 1.0},
]);

defineVector2(SingleLayerWaterMaterial, [
    {key: 'windDirection', value: [1.0, 0.3]},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;

import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import fragmentModuleSource from './shader/singleLayerWaterFragment.wgsl';
import defineColorRGB from "../../../defineProperty/funcs/color/defineColorRGB";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineVector2 from "../../../defineProperty/funcs/vector/defineVector2";
import defineBoolean from "../../../defineProperty/funcs/defineBoolean";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";

interface SingleLayerWaterMaterial {
    /**
     * [KO] PBR 표준 수면 기본 얕은 물 알베도 컬러(ColorRGB)
     * [EN] PBR standard water surface base shallow albedo color (ColorRGB)
     */
    baseColor: ColorRGB;
    /**
     * [KO] 수심이 깊은 곳의 심해 남색 알베도 컬러(ColorRGB)
     * [EN] Abyssal deep water albedo color (ColorRGB)
     */
    deepColor: ColorRGB;
    /**
     * [KO] 주 수면 노멀 맵 텍스처 (대형/중형 너울)
     * [EN] Main water surface normal map texture (Large/Mid swells)
     */
    normalTexture: BitmapTexture;
    /**
     * [KO] 고주파 마이크로 물결/노이즈를 위한 제2 노멀 맵 텍스처 (선택 사항)
     * [EN] Second normal map texture for high-frequency micro ripples/noise (optional)
     */
    normalTexture2: BitmapTexture;
    /**
     * [KO] 제2 노멀 맵 사용 여부 (normalTexture2 지정 시 자동 연동)
     * [EN] Whether to use second normal map (auto synced when normalTexture2 is set)
     */
    useNormalTexture2: boolean;
    /**
     * [KO] 수면 노멀 맵 샘플러
     * [EN] Water surface normal map sampler
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 주 노멀 강도 스케일
     * [EN] Main normal strength scale
     */
    normalScale: number;
    /**
     * [KO] 주 노멀 텍스처 UV 타일링 배수
     * [EN] Main normal texture UV tiling multiplier
     */
    normalTiling: number;
    /**
     * [KO] 제2 노멀 강도 스케일 (기본값: 1.0)
     * [EN] Second normal strength scale (default: 1.0)
     */
    normalScale2: number;
    /**
     * [KO] 제2 노멀 텍스처 상대 UV 타일링 배수 (기본값: 2.5)
     * [EN] Second normal texture relative UV tiling multiplier (default: 2.5)
     */
    normalTiling2: number;
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
     * [KO] PBR 마이크로패싯 표면 거칠기 (Roughness, 0.0 ~ 1.0, 물 UE5 기본값: 0.02)
     * [EN] PBR microfacet surface roughness (Roughness, 0.0 ~ 1.0, water UE5 default: 0.02)
     */
    roughness: number;
    /**
     * [KO] PBR 스펙큘러 반사율 스케일링 팩터 (물 기본값: 1.0)
     * [EN] PBR specular reflectance scaling factor (water default: 1.0)
     */
    specularFactor: number;
    /**
     * [KO] 연안 및 침수 물체 경계면 소프트 블렌딩 깊이 거리 (단위: m, UE5 기본값: 1.0 = 100cm)
     * [EN] Shoreline and submerged object boundary soft depth fade distance (Unit: m, UE5 default: 1.0 = 100cm)
     */
    depthFadeDistance: number;
    /**
     * [KO] 수중 굴절 왜곡 강도 (UE5 기본값: 0.03, 0.0일 때 굴절 왜곡 없음)
     * [EN] Underwater refraction distortion strength (UE5 default: 0.03, 0.0 for no distortion)
     */
    refractionStrength: number;
    /**
     * [KO] 수심에 따른 빛의 수체 흡수/소멸 계수 (Beer-Lambert extinction factor, UE5 호수 기본값: 0.28)
     * [EN] Light water absorption/extinction factor by water depth (Beer-Lambert extinction factor, UE5 lake default: 0.28)
     */
    extinctionFactor: number;
}

/**
 * [KO] 언리얼 엔진 5(UE5)의 SingleLayerWater 셰이딩 모델에 대응하는 PBR 표준 수체 머티리얼 클래스입니다.
 * [EN] Dedicated PBR water rendering material class corresponding to Unreal Engine 5 (UE5) SingleLayerWater shading model.
 *
 * [KO] Cook-Torrance GGX 마이크로패싯 조명 모델과 시간(t) 기반 물결 노멀 스크롤링 및 듀얼 노멀 RNM 블렌딩을 지원합니다.
 * [EN] Supports Cook-Torrance GGX microfacet lighting model, time(t)-based wave normal scrolling, and dual normal RNM blending.
 *
 * @category Material
 */
class SingleLayerWaterMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] SingleLayerWaterMaterial 생성자
     * [EN] SingleLayerWaterMaterial constructor
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param baseColor - 기본 얕은 수면 알베도 HEX 컬러 (기본값: '#18d8b6' - 청명한 열대 에메랄드 그린)
     * @param deepColor - 깊은 수심 심해 남색 HEX 컬러 (기본값: '#023d58' - 깊은 라군 사파이어 블루)
     * @param opacity - 기본 수면 불투명도 (기본값: 0.88)
     */
    constructor(redGPUContext: RedGPUContext, baseColor: string = '#18d8b6', deepColor: string = '#023d58', opacity: number = 0.88) {
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
        this.deepColor.setColorByHEX(deepColor);
        this.opacity = opacity;

        // Premultiplied Alpha 블렌딩 설정: 스펙큘러가 opacity에 의해 깎이지 않고 100% 온전하게 빛나도록 보존
        this.blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
        this.blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;

        this.normalScale = 1.0;
        this.normalTiling = 4.0;
        this.normalScale2 = 0.8;
        this.normalTiling2 = 2.0;
        this.useNormalTexture2 = false;

        this.windSpeed = 0.045;
        this.windDirection = [1.0, 0.35];
        this.roughness = 0.02;
        this.specularFactor = 1.0;
        this.depthFadeDistance = 1.2;
        this.refractionStrength = 0.026;
        this.extinctionFactor = 0.22;

        // 불투명 씬(Opaque) 렌더링 후의 컬러/뎁스 스냅샷을 사용하는 2Path 렌더 패스로 라우팅
        this.use2PathRender = true;
    }
}

defineColorRGB(SingleLayerWaterMaterial, [
    {key: 'baseColor'},
    {key: 'deepColor'},
]);

defineTexture(SingleLayerWaterMaterial, [
    {key: 'normalTexture'},
    {key: 'normalTexture2'},
]);

defineSampler(SingleLayerWaterMaterial, [
    {key: 'normalTextureSampler'},
]);

definePositiveNumber(SingleLayerWaterMaterial, [
    {key: 'normalScale', value: 1.0},
    {key: 'normalTiling', value: 3.5},
    {key: 'normalScale2', value: 1.0},
    {key: 'normalTiling2', value: 2.5},
    {key: 'windSpeed', value: 0.04},
    {key: 'roughness', value: 0.02},
    {key: 'specularFactor', value: 1.0},
    {key: 'depthFadeDistance', value: 1.0},
    {key: 'refractionStrength', value: 0.03},
    {key: 'extinctionFactor', value: 0.28},
]);

defineVector2(SingleLayerWaterMaterial, [
    {key: 'windDirection', value: [1.0, 0.3]},
]);

defineBoolean(SingleLayerWaterMaterial, [
    {key: 'useNormalTexture2', value: false},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;

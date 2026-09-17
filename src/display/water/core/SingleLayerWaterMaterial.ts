import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import fragmentModuleSource from './shader/singleLayerWaterFragment.wgsl';
import ColorRGB from "../../../color/ColorRGB";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Sampler from "../../../resources/sampler/Sampler";
import defineUint from "../../../defineProperty/funcs/number/defineUint";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineColorRGB from "../../../defineProperty/funcs/color/defineColorRGB";
import defineVector2 from "../../../defineProperty/funcs/vector/defineVector2";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler";
import defineBoolean from "../../../defineProperty/funcs/defineBoolean";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";

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
     * [KO] 주 수면 노멀 맵 텍스처
     * [EN] Main water surface normal map texture
     */
    normalTexture: BitmapTexture;
    /**
     * [KO] 수면 노멀 맵 샘플러
     * [EN] Water surface normal map sampler
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 디테일 수면 노멀 맵 텍스처 (마이크로 잔물결 / 교차 파도)
     * [EN] Detail water surface normal map texture (micro ripples / cross waves)
     */
    normalDetailTexture: BitmapTexture;
    /**
     * [KO] 주 노멀 강도 스케일
     * [EN] Main normal strength scale
     */
    normalScale: number;
    /**
     * [KO] 제2 노멀 강도 스케일
     * [EN] Secondary normal strength scale
     */
    normalScale2: number;
    /**
     * [KO] 주 노멀 텍스처 UV 타일링 배수
     * [EN] Main normal texture UV tiling multiplier
     */
    normalTiling: number;
    /**
     * [KO] 제2 노멀 텍스처 UV 타일링 배수
     * [EN] Secondary normal texture UV tiling multiplier
     */
    normalTiling2: number;
    /**
     * [KO] 바람에 의한 물결 스크롤 속도
     * [EN] Wave scrolling speed by wind
     */
    windSpeed: number;
    /**
     * [KO] 제2 노멀 파도 스크롤 속도
     * [EN] Secondary normal wave scrolling speed
     */
    windSpeed2: number;
    /**
     * [KO] 바람 방향 벡터 [X, Y]
     * [EN] Wind direction vector [X, Y]
     */
    windDirection: [number, number];
    /**
     * [KO] 제2 노멀 파도 진행 방향 벡터 [X, Y]
     * [EN] Secondary normal wave direction vector [X, Y]
     */
    windDirection2: [number, number];
    /**
     * [KO] 제2 노멀 텍스처 사용 여부
     * [EN] Whether to use secondary normal texture
     */
    useNormalTexture2: boolean;
    /**
     * [KO] 수중 굴절 왜곡 강도 (UE5 기본값: 0.02)
     * [EN] Underwater refraction distortion strength (UE5 default: 0.02)
     */
    refractionStrength: number;
    /**
     * [KO] 수심에 따른 빛의 수체 흡수/소멸 계수 (Beer-Lambert extinction factor, UE5 호수 기본값: 0.28)
     * [EN] Light water absorption/extinction factor by water depth (Beer-Lambert extinction factor, UE5 lake default: 0.28)
     */
    extinctionFactor: number;
    /**
     * [KO] 수면 기본 불투명도 (0.0 ~ 1.0, 기본값: 0.85)
     * [EN] Water surface base opacity (0.0 ~ 1.0, default: 0.85)
     */
    opacity: number;
    /**
     * [KO] 해안선 및 지형 경계면 소프트 페이드 거리 (단위: m, 기본값: 1.0m)
     * [EN] Shoreline and terrain boundary soft depth fade distance (Unit: m, default: 1.0m)
     */
    depthFadeDistance: number;
    /**
     * [KO] 수면 거칠기 (0.0: 완전 거울 반사 ~ 1.0: 거친 난반사, 기본값: 0.05)
     * [EN] Water surface roughness (0.0: perfect mirror reflection ~ 1.0: diffuse, default: 0.05)
     */
    roughness: number;
    /**
     * [KO] 환경 반사 및 스펙큘러 강도 배율 (기본값: 1.0)
     * [EN] Environment reflection and specular intensity factor (default: 1.0)
     */
    specularFactor: number;
    /**
     * [KO] Schlick 프레넬 수직 입사 반사율 F0 (물의 물리 상수 기본값: 0.02)
     * [EN] Schlick Fresnel normal incidence reflectance F0 (Water physical constant default: 0.02)
     */
    fresnelF0: number;
    /**
     * [KO] 디버그 뷰 모드 (0: PBR Water, 1: Raw, 2: Linear Scene, 3: Linear Water, 4: Delta Depth, 5: Depth Fade, 6: Passthrough, 7: Extinction, 8: Albedo, 9: Normal Map, 10: Refraction Offset, 11: Fresnel Factor, 12: Sky Reflection, 13: Sun Glitter)
     * [EN] Debug view mode (0: PBR Water, 1: Raw, 2: Linear Scene, 3: Linear Water, 4: Delta Depth, 5: Depth Fade, 6: Passthrough, 7: Extinction, 8: Albedo, 9: Normal Map, 10: Refraction Offset, 11: Fresnel Factor, 12: Sky Reflection, 13: Sun Glitter)
     */
    debugMode: number;
    /**
     * [KO] 수심 마스크 시각화 정규화 기준 거리 (단위: m, 기본값: 5.0m)
     * [EN] Depth mask visualization normalization distance (Unit: m, default: 5.0m)
     */
    debugMaxDepth: number;
    /**
     * [KO] 제1 주 노멀 맵의 Y축(Green) 반전 여부 (기본값: false - OpenGL 표준)
     * [EN] Whether to invert Y-axis (Green) of main normal map (default: false - OpenGL standard)
     */
    invertNormalY1: boolean;
    /**
     * [KO] 제2 디테일 노멀 맵의 Y축(Green) 반전 여부 (기본값: false - OpenGL 표준)
     * [EN] Whether to invert Y-axis (Green) of secondary normal map (default: false - OpenGL standard)
     */
    invertNormalY2: boolean;
    /**
     * [KO] 수중 바닥 카우스틱스(햇살 일렁임) 강도 (0.0 ~ 2.0, 기본값: 0.45)
     * [EN] Underwater caustics (sunlight network) strength (0.0 ~ 2.0, default: 0.45)
     */
    causticsStrength: number;
    /**
     * [KO] 수중 바닥 카우스틱스 공간 스케일 배율 (기본값: 1.0)
     * [EN] Underwater caustics spatial scale multiplier (default: 1.0)
     */
    causticsScale: number;
    /**
     * [KO] 수중 바닥 카우스틱스 일렁임 속도 (기본값: 1.0)
     * [EN] Underwater caustics animation speed (default: 1.0)
     */
    causticsSpeed: number;
    /**
     * [KO] 스크린 공간 반사(SSR) 활성화 여부 (기본값: true)
     * [EN] Whether screen space reflection (SSR) is enabled (default: true)
     */
    enableSSR: boolean;
    /**
     * [KO] SSR 최대 반사 추적 거리 (단위: m, 기본값: 25.0)
     * [EN] SSR maximum reflection tracing distance (Unit: m, default: 25.0)
     */
    ssrMaxDistance: number;
    /**
     * [KO] SSR 레이마칭 샘플링 단계 수 (기본값: 32)
     * [EN] SSR ray marching step count (default: 32)
     */
    ssrStepCount: number;
    /**
     * [KO] SSR 표면 두께 허용치 (단위: m, 기본값: 0.5)
     * [EN] SSR surface thickness threshold (Unit: m, default: 0.5)
     */
    ssrThickness: number;
}

/**
 * [KO] 언리얼 엔진 5의 SingleLayerWater (SLW) 셰이딩 모델 기반 PBR 수면 머티리얼 클래스 (Phase 8 - Depth Bleeding Fix)
 * [EN] PBR water material class based on Unreal Engine 5 SingleLayerWater (SLW) shading model (Phase 8 - Depth Bleeding Fix)
 *
 * @category Material
 */
class SingleLayerWaterMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] SingleLayerWaterMaterial 생성자
     * [EN] SingleLayerWaterMaterial constructor
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param baseColor - 기본 얕은 수면 알베도 HEX 컬러 (기본값: '#18d8b6' - 청명한 열대 에메랄드 그린)
     * @param deepColor - 깊은 수심 심해 남색 HEX 컬러 (기본값: '#065279' - 깊은 라군 사파이어 블루)
     * @param opacity - 기본 수면 불투명도 (기본값: 1.0)
     */
    constructor(redGPUContext: RedGPUContext, baseColor: string = '#18d8b6', deepColor: string = '#065279', opacity: number = 1.0) {
        super(
            redGPUContext,
            'SINGLE_LAYER_WATER_MATERIAL',
            fragmentModuleSource,
            2
        );

        // 2Path 렌더 패스 활성화
        this.use2PathRender = true;
        this.transparent = true;

        // Premultiplied Alpha 블렌딩 설정
        this.blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
        this.blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;

        // 물결 텍스처 무한 스크롤 반복을 위한 repeat 샘플러 장착
        this.normalTextureSampler = new Sampler(this.redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT,
            addressModeW: GPU_ADDRESS_MODE.REPEAT,
        });

        this.initGPURenderInfos();

        this.baseColor.setColorByHEX(baseColor);
        this.deepColor.setColorByHEX(deepColor);
        this.opacity = opacity;
        this.refractionStrength = 0.025;
        this.normalScale = 0.22;
        this.normalScale2 = 0.10;
        this.normalTiling = 28.0;
        this.normalTiling2 = 56.0;
        this.windSpeed = 0.025;
        this.windSpeed2 = 0.040;
        this.windDirection = [1.0, 0.3];
        this.windDirection2 = [-0.6, 0.8];
        this.useNormalTexture2 = true;
        this.extinctionFactor = 0.22;
        this.depthFadeDistance = 0.8;
        this.roughness = 0.05;
        this.specularFactor = 1.0;
        this.fresnelF0 = 0.02;
        this.invertNormalY1 = false; // 기본 OpenGL 규격 (필요시 DirectX 호환 반전)
        this.invertNormalY2 = false; // 기본 OpenGL 규격 (필요시 DirectX 호환 반전)
        this.causticsStrength = 0.65;
        this.causticsScale = 1.0;
        this.causticsSpeed = 1.0;
        this.enableSSR = true;
        this.ssrMaxDistance = 25.0;
        this.ssrStepCount = 32;
        this.ssrThickness = 0.5;

        // 기본 디버그 모드: Step 8 PBR Water without Bleeding (0)
        this.debugMode = 0;
        this.debugMaxDepth = 5.0;
    }

    /**
     * [KO] 하위 호환성을 위한 normalTexture2 getter
     * [EN] Backward compatibility getter for normalTexture2
     */
    get normalTexture2(): BitmapTexture {
        return this.normalDetailTexture;
    }

    /**
     * [KO] 하위 호환성을 위한 normalTexture2 setter
     * [EN] Backward compatibility setter for normalTexture2
     */
    set normalTexture2(value: BitmapTexture) {
        this.normalDetailTexture = value;
    }
}

defineColorRGB(SingleLayerWaterMaterial, [
    {key: 'baseColor', value: '#18d8b6'},
    {key: 'deepColor', value: '#065279'},
]);

defineTexture(SingleLayerWaterMaterial, [
    {key: 'normalTexture'},
    {key: 'normalDetailTexture'},
]);

defineSampler(SingleLayerWaterMaterial, [
    {key: 'normalTextureSampler'},
]);

defineVector2(SingleLayerWaterMaterial, [
    {key: 'windDirection', value: [1.0, 0.3]},
    {key: 'windDirection2', value: [-0.6, 0.8]},
]);

definePositiveNumber(SingleLayerWaterMaterial, [
    {key: 'opacity', value: 1.0, min: 0, max: 1},
    {key: 'refractionStrength', value: 0.025},
    {key: 'normalScale', value: 0.22},
    {key: 'normalScale2', value: 0.10},
    {key: 'normalTiling', value: 28.0},
    {key: 'normalTiling2', value: 56.0},
    {key: 'windSpeed', value: 0.025},
    {key: 'windSpeed2', value: 0.040},
    {key: 'extinctionFactor', value: 0.22},
    {key: 'depthFadeDistance', value: 0.8},
    {key: 'roughness', value: 0.05, min: 0, max: 1},
    {key: 'specularFactor', value: 1.0, min: 0, max: 2},
    {key: 'fresnelF0', value: 0.02, min: 0, max: 1},
    {key: 'debugMaxDepth', value: 5.0},
    {key: 'causticsStrength', value: 0.65, min: 0, max: 2},
    {key: 'causticsScale', value: 1.0, min: 0.1, max: 5},
    {key: 'causticsSpeed', value: 1.0, min: 0, max: 5},
    {key: 'ssrMaxDistance', value: 25.0, min: 2.0, max: 100.0},
    {key: 'ssrThickness', value: 0.5, min: 0.05, max: 5.0},
]);

defineUint(SingleLayerWaterMaterial, [
    {key: 'debugMode', value: 0},
    {key: 'ssrStepCount', value: 32},
]);

defineBoolean(SingleLayerWaterMaterial, [
    {key: 'useNormalTexture2', value: true},
    {key: 'invertNormalY1', value: false},
    {key: 'invertNormalY2', value: false},
    {key: 'enableSSR', value: true},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;

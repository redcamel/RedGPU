import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";
import fragmentModuleSource from './shader/singleLayerWaterFragment.wgsl';
import ColorRGB from "../../color/ColorRGB";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import Sampler from "../../resources/sampler/Sampler";
import defineUint from "../../defineProperty/funcs/number/defineUint";
import definePositiveNumber from "../../defineProperty/funcs/number/definePositiveNumber";
import defineColorRGB from "../../defineProperty/funcs/color/defineColorRGB";
import defineVector2 from "../../defineProperty/funcs/vector/defineVector2";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";

import DirectTexture from "../../resources/texture/DirectTexture";

interface SingleLayerWaterMaterial {
    /**
     * [KO] 얕은 수면의 기본 색상입니다.
     * [EN] Base color of shallow water.
     */
    baseColor: ColorRGB;
    /**
     * [KO] 깊은 수심에서 나타나는 색상입니다.
     * [EN] Color shown at deep water depth.
     */
    deepColor: ColorRGB;
    /**
     * [KO] 수면 굴곡을 표현하는 기본 노멀 텍스처입니다.
     * [EN] Primary normal texture representing surface undulation.
     */
    normalTexture: BitmapTexture;
    /**
     * [KO] 노멀 텍스처 샘플링에 사용하는 샘플러입니다. 기본값은 LINEAR 필터와 REPEAT 주소 모드입니다.
     * [EN] Sampler used for normal texture sampling. Defaults to LINEAR filtering and REPEAT address mode.
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 미세 물결을 표현하는 디테일 노멀 텍스처입니다.
     * [EN] Detail normal texture representing fine ripples.
     */
    normalDetailTexture: BitmapTexture;
    /**
     * [KO] 상호작용 파동 시뮬레이션 결과가 담긴 리플 텍스처입니다.
     * [EN] Ripple texture containing the interaction wave simulation result.
     */
    rippleTexture: DirectTexture | BitmapTexture | GPUTexture;
    /**
     * [KO] 기본 노멀 강도입니다. (0 ~ 1, 기본값: 1.0)
     * [EN] Primary normal strength. (0 ~ 1, default: 1.0)
     */
    normalScale: number;
    /**
     * [KO] 디테일 노멀 강도입니다. (0 ~ 1, 기본값: 0.5)
     * [EN] Detail normal strength. (0 ~ 1, default: 0.5)
     */
    normalDetailScale: number;
    /**
     * [KO] 기본 노멀 텍스처 반복 횟수입니다. (기본값: 18.0)
     * [EN] Tiling count of the primary normal texture. (default: 18.0)
     */
    normalTiling: number;
    /**
     * [KO] 디테일 노멀 텍스처 반복 횟수입니다. (기본값: 36.0)
     * [EN] Tiling count of the detail normal texture. (default: 36.0)
     */
    normalDetailTiling: number;
    /**
     * [KO] 노멀 텍스처 흐름 속도 배율입니다. (기본값: 0.025)
     * [EN] Flow speed multiplier of the normal textures. (default: 0.025)
     */
    flowRateScale: number;
    /**
     * [KO] 수면 아래 배경의 굴절 왜곡 강도입니다. (0 ~ 1, 기본값: 1.0)
     * [EN] Refraction distortion strength of the underwater background. (0 ~ 1, default: 1.0)
     */
    refractionStrength: number;
    /**
     * [KO] 수심에 따른 빛 감쇠 계수입니다. 값이 클수록 빠르게 어두워집니다. (기본값: 0.22)
     * [EN] Light extinction factor over depth. Higher values darken faster. (default: 0.22)
     */
    extinctionFactor: number;
    /**
     * [KO] 수면 불투명도입니다. (0 ~ 1, 기본값: 1.0)
     * [EN] Water surface opacity. (0 ~ 1, default: 1.0)
     */
    opacity: number;
    /**
     * [KO] 물가 경계에서 투명하게 페이드되는 수심 거리입니다. (기본값: 0.8)
     * [EN] Depth distance over which the shoreline fades out. (default: 0.8)
     */
    depthFadeDistance: number;
    /**
     * [KO] 수면 거칠기입니다. (0 ~ 1, 기본값: 0.07)
     * [EN] Surface roughness. (0 ~ 1, default: 0.07)
     */
    roughness: number;
    /**
     * [KO] 스페큘러 반사 강도입니다. (0 ~ 2, 기본값: 1.0)
     * [EN] Specular reflection strength. (0 ~ 2, default: 1.0)
     */
    specularFactor: number;
    /**
     * [KO] 디버그 출력 모드입니다. 0이면 일반 렌더링입니다.
     * [EN] Debug output mode. 0 means normal rendering.
     */
    debugMode: number;
    /**
     * [KO] 깊이 디버그 시각화에 사용하는 최대 수심입니다. (기본값: 5.0)
     * [EN] Maximum depth used for depth debug visualization. (default: 5.0)
     */
    debugMaxDepth: number;
    /**
     * [KO] 기본 노멀 텍스처의 Y(그린) 채널 반전 여부입니다.
     * [EN] Whether to invert the Y (green) channel of the primary normal texture.
     */
    invertNormalY: boolean;
    /**
     * [KO] 디테일 노멀 텍스처의 Y(그린) 채널 반전 여부입니다.
     * [EN] Whether to invert the Y (green) channel of the detail normal texture.
     */
    invertNormalDetailY: boolean;
    /**
     * [KO] 수중 커스틱 강도입니다. (0 ~ 2, 기본값: 1.0)
     * [EN] Underwater caustics strength. (0 ~ 2, default: 1.0)
     */
    causticsStrength: number;
    /**
     * [KO] 커스틱 패턴 크기 배율입니다. (0.1 ~ 5, 기본값: 1.0)
     * [EN] Caustics pattern scale multiplier. (0.1 ~ 5, default: 1.0)
     */
    causticsScale: number;
    /**
     * [KO] 커스틱 애니메이션 속도입니다. (0 ~ 5, 기본값: 1.0)
     * [EN] Caustics animation speed. (0 ~ 5, default: 1.0)
     */
    causticsSpeed: number;
    /**
     * [KO] 스크린 스페이스 반사(SSR) 사용 여부입니다. (기본값: true)
     * [EN] Whether screen-space reflection (SSR) is enabled. (default: true)
     */
    enableSSR: boolean;
    /**
     * [KO] SSR 레이 최대 추적 거리입니다. (2 ~ 300, 기본값: 100.0)
     * [EN] Maximum SSR ray marching distance. (2 ~ 300, default: 100.0)
     */
    ssrMaxDistance: number;
    /**
     * [KO] SSR 레이 마칭 단계 수입니다. (기본값: 64)
     * [EN] Number of SSR ray marching steps. (default: 64)
     */
    ssrStepCount: number;
    /**
     * [KO] SSR 교차 판정에 사용하는 깊이 두께입니다. (0.05 ~ 5, 기본값: 1.0)
     * [EN] Depth thickness used for SSR hit testing. (0.05 ~ 5, default: 1.0)
     */
    ssrThickness: number;
    /**
     * [KO] 물의 탁도입니다. 값이 클수록 수중 시야가 흐려집니다. (0 ~ 1, 기본값: 0.35)
     * [EN] Water turbidity. Higher values reduce underwater visibility. (0 ~ 1, default: 0.35)
     */
    turbidity: number;
    /**
     * [KO] 리플 시뮬레이션 영역의 월드 XZ 중심 좌표입니다.
     * [EN] World XZ center of the ripple simulation domain.
     */
    rippleDomainCenter: [number, number];
    /**
     * [KO] 리플 시뮬레이션 영역의 월드 단위 한 변 크기입니다. (최소 1, 기본값: 16.0)
     * [EN] Side length of the ripple simulation domain in world units. (min 1, default: 16.0)
     */
    rippleDomainSize: number;
    /**
     * [KO] 리플이 수면 노멀에 미치는 강도입니다. (최소 0, 기본값: 1.0)
     * [EN] Strength of ripples applied to the surface normal. (min 0, default: 1.0)
     */
    rippleNormalStrength: number;
}

/**
 * [KO] 굴절, 수심 기반 색상·감쇠, 커스틱, SSR을 지원하는 단일 레이어 물 재질입니다.
 * [EN] Single-layer water material supporting refraction, depth-based color/extinction, caustics, and SSR.
 *
 * [KO] 2패스 렌더링(`use2PathRender`)을 사용하여 불투명 씬을 먼저 렌더링한 뒤 수면을 합성합니다.
 * [EN] Uses 2-pass rendering (`use2PathRender`) to composite the water surface after the opaque scene is rendered.
 *
 * ### Example
 * ```typescript
 * const material = new RedGPU.Water.SingleLayerWaterMaterial(redGPUContext, '#18d8b6', '#065279');
 * material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'waterNormal.jpg');
 * ```
 *
 * @see [Basic lake example](/RedGPU/examples/3d/water/lake/basicLake/)
 * @see [Lake settings example](/RedGPU/examples/3d/water/lake/lakeSettings/)
 * @see [Waves and optics example](/RedGPU/examples/3d/water/lake/wavesAndOptics/)
 * @category Water
 */
class SingleLayerWaterMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] SingleLayerWaterMaterial 인스턴스를 생성합니다.
     * [EN] Creates a SingleLayerWaterMaterial instance.
     *
     * ### Example
     * ```typescript
     * const material = new RedGPU.Water.SingleLayerWaterMaterial(redGPUContext, '#18d8b6', '#065279', 1.0);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param baseColor -
     * [KO] 얕은 수면 색상 HEX 문자열 (기본값: '#18d8b6')
     * [EN] Shallow water color HEX string (default: '#18d8b6')
     * @param deepColor -
     * [KO] 깊은 수심 색상 HEX 문자열 (기본값: '#065279')
     * [EN] Deep water color HEX string (default: '#065279')
     * @param opacity -
     * [KO] 불투명도 (0 ~ 1, 기본값: 1.0)
     * [EN] Opacity (0 ~ 1, default: 1.0)
     */
    constructor(redGPUContext: RedGPUContext, baseColor: string = '#18d8b6', deepColor: string = '#065279', opacity: number = 1.0) {
        super(
            redGPUContext,
            'SINGLE_LAYER_WATER_MATERIAL',
            fragmentModuleSource,
            2
        );

        this.use2PathRender = true;

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
        this.refractionStrength = 1.0;
        this.normalScale = 1.0;
        this.normalDetailScale = 0.5;
        this.normalTiling = 18.0;
        this.normalDetailTiling = 36.0;
        this.flowRateScale = 0.025;
        this.extinctionFactor = 0.22;
        this.depthFadeDistance = 0.8;
        this.roughness = 0.07;
        this.specularFactor = 1.0;
        this.invertNormalY = false;
        this.invertNormalDetailY = false;
        this.causticsStrength = 1.0;
        this.causticsScale = 1.0;
        this.causticsSpeed = 1.0;
        this.enableSSR = true;
        this.ssrMaxDistance = 100.0;
        this.ssrStepCount = 64;
        this.ssrThickness = 1.0;
        this.turbidity = 0.35;
        this.rippleDomainCenter = [0.0, 0.0];
        this.rippleDomainSize = 16.0;
        this.rippleNormalStrength = 1.0;

        this.debugMode = 0;
        this.debugMaxDepth = 5.0;
    }
}

defineColorRGB(SingleLayerWaterMaterial, [
    {key: 'baseColor', value: '#18d8b6'},
    {key: 'deepColor', value: '#065279'},
]);

defineTexture(SingleLayerWaterMaterial, [
    {key: 'normalTexture'},
    {key: 'normalDetailTexture'},
    {key: 'rippleTexture'},
]);

defineSampler(SingleLayerWaterMaterial, [
    {key: 'normalTextureSampler'},
]);

defineVector2(SingleLayerWaterMaterial, [
    {key: 'rippleDomainCenter', value: [0.0, 0.0]},
]);

definePositiveNumber(SingleLayerWaterMaterial, [
    {key: 'opacity', value: 1.0, min: 0, max: 1},
    {key: 'refractionStrength', value: 1.0, min: 0, max: 1},
    {key: 'normalScale', value: 1.0, min: 0.0, max: 1.0},
    {key: 'normalDetailScale', value: 0.5, min: 0.0, max: 1.0},
    {key: 'normalTiling', value: 18.0},
    {key: 'normalDetailTiling', value: 36.0},
    {key: 'flowRateScale', value: 0.025},
    {key: 'extinctionFactor', value: 0.22},
    {key: 'depthFadeDistance', value: 0.8},
    {key: 'roughness', value: 0.07, min: 0, max: 1},
    {key: 'specularFactor', value: 1.0, min: 0, max: 2},
    {key: 'debugMaxDepth', value: 5.0},
    {key: 'causticsStrength', value: 1.0, min: 0, max: 2},
    {key: 'causticsScale', value: 1.0, min: 0.1, max: 5},
    {key: 'causticsSpeed', value: 1.0, min: 0, max: 5},
    {key: 'ssrMaxDistance', value: 100.0, min: 2.0, max: 300.0},
    {key: 'ssrThickness', value: 1.0, min: 0.05, max: 5.0},
    {key: 'turbidity', value: 0.35, min: 0.0, max: 1.0},
    {key: 'rippleDomainSize', value: 16.0, min: 1.0},
    {key: 'rippleNormalStrength', value: 1.0, min: 0.0},
]);

defineUint(SingleLayerWaterMaterial, [
    {key: 'debugMode', value: 0},
    {key: 'ssrStepCount', value: 64},
]);

defineBoolean(SingleLayerWaterMaterial, [
    {key: 'invertNormalY', value: false},
    {key: 'invertNormalDetailY', value: false},
    {key: 'enableSSR', value: true},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;

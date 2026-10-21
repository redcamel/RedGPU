import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";
import fragmentModuleSource from './shader/lakeFragment.wgsl';
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

interface LakeMaterial {
    /**
     * [KO] 얕은 수면의 기본 색상입니다. (기본값: `'#18d8b6'`)
     * [EN] Base color of shallow water. (Default: `'#18d8b6'`)
     */
    baseColor: ColorRGB;
    /**
     * [KO] 깊은 수심의 색상입니다. (기본값: `'#065279'`)
     * [EN] Color at deep water depth. (Default: `'#065279'`)
     */
    deepColor: ColorRGB;
    /**
     * [KO] 수면 굴곡을 표현하는 기본 노멀 텍스처입니다.
     * [EN] Primary normal texture representing surface undulation.
     */
    normalTexture: BitmapTexture;
    /**
     * [KO] 노멀 텍스처 샘플러입니다. (기본값: `LINEAR` 필터, `REPEAT` 주소 모드)
     * [EN] Sampler for normal textures. (Default: `LINEAR` filter, `REPEAT` address mode)
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 미세 물결을 표현하는 디테일 노멀 텍스처입니다.
     * [EN] Detail normal texture representing fine ripples.
     */
    normalDetailTexture: BitmapTexture;
    /**
     * [KO] 상호작용 파동 시뮬레이션 결과가 저장된 리플 노멀 텍스처입니다.
     * [EN] Ripple normal texture storing the interaction wave simulation result.
     */
    rippleTexture: DirectTexture | BitmapTexture | GPUTexture;
    /**
     * [KO] 기본 노멀 텍스처의 강도입니다. (범위: `0` ~ `1`, 기본값: `1.0`)
     * [EN] Strength of the primary normal texture. (Range: `0` ~ `1`, default: `1.0`)
     */
    normalScale: number;
    /**
     * [KO] 디테일 노멀 텍스처의 강도입니다. (범위: `0` ~ `1`, 기본값: `0.5`)
     * [EN] Strength of the detail normal texture. (Range: `0` ~ `1`, default: `0.5`)
     */
    normalDetailScale: number;
    /**
     * [KO] 기본 지오메트리 크기(월드 `100m`) 기준 기본 노멀 텍스처의 타일링 반복 횟수입니다. (기본값: `20.0`, 타일당 `5.0m`)
     * [EN] Tiling repeat count of the primary normal texture per `100m` reference world scale. (Default: `20.0`, `5.0m` per tile)
     */
    normalTiling: number;
    /**
     * [KO] 기본 지오메트리 크기(월드 `100m`) 기준 디테일 노멀 텍스처의 타일링 반복 횟수입니다. (기본값: `40.0`, 타일당 `2.5m`)
     * [EN] Tiling repeat count of the detail normal texture per `100m` reference world scale. (Default: `40.0`, `2.5m` per tile)
     */
    normalDetailTiling: number;
    /**
     * [KO] 노멀 텍스처의 흐름 속도 배율입니다. (기본값: `0.025`)
     * [EN] Flow speed multiplier of the normal textures. (Default: `0.025`)
     */
    flowRateScale: number;
    /**
     * [KO] 수중 배경의 굴절 왜곡 강도입니다. (범위: `0` ~ `1`, 기본값: `1.0`)
     * [EN] Refraction distortion strength of the underwater background. (Range: `0` ~ `1`, default: `1.0`)
     */
    refractionStrength: number;
    /**
     * [KO] 수심 증가에 따른 빛 감쇠 계수입니다. (기본값: `0.22`)
     * [EN] Light extinction factor over depth. (Default: `0.22`)
     */
    extinctionFactor: number;
    /**
     * [KO] 수면 불투명도입니다. (범위: `0` ~ `1`, 기본값: `1.0`)
     * [EN] Water surface opacity. (Range: `0` ~ `1`, default: `1.0`)
     */
    opacity: number;
    /**
     * [KO] 물가 경계가 투명하게 페이드되는 수심 거리입니다. (기본값: `0.8`)
     * [EN] Depth distance over which the shoreline fades out. (Default: `0.8`)
     */
    depthFadeDistance: number;
    /**
     * [KO] 수면 거칠기입니다. (범위: `0` ~ `1`, 기본값: `0.07`)
     * [EN] Surface roughness. (Range: `0` ~ `1`, default: `0.07`)
     */
    roughness: number;
    /**
     * [KO] 스페큘러 반사 강도입니다. (범위: `0` ~ `2`, 기본값: `1.0`)
     * [EN] Specular reflection strength. (Range: `0` ~ `2`, default: `1.0`)
     */
    specularFactor: number;
    /**
     * [KO] 디버그 시각화 모드입니다. (`0`: 일반 렌더링, 기본값: `0`)
     * [EN] Debug visualization mode. (`0`: normal rendering, default: `0`)
     */
    debugMode: number;
    /**
     * [KO] 깊이 디버그 시각화의 기준 최대 수심입니다. (기본값: `5.0`)
     * [EN] Reference maximum depth for depth debug visualization. (Default: `5.0`)
     */
    debugMaxDepth: number;
    /**
     * [KO] 기본 노멀 텍스처의 Y(G) 채널 반전 여부입니다. (기본값: `false`)
     * [EN] Whether to invert the Y (G) channel of the primary normal texture. (Default: `false`)
     */
    invertNormalY: boolean;
    /**
     * [KO] 디테일 노멀 텍스처의 Y(G) 채널 반전 여부입니다. (기본값: `false`)
     * [EN] Whether to invert the Y (G) channel of the detail normal texture. (Default: `false`)
     */
    invertNormalDetailY: boolean;
    /**
     * [KO] 수중 커스틱 강도입니다. (범위: `0` ~ `2`, 기본값: `1.0`)
     * [EN] Underwater caustics strength. (Range: `0` ~ `2`, default: `1.0`)
     */
    causticsStrength: number;
    /**
     * [KO] 수중 커스틱 패턴 크기 배율입니다. (범위: `0.1` ~ `5`, 기본값: `1.0`)
     * [EN] Underwater caustics pattern scale multiplier. (Range: `0.1` ~ `5`, default: `1.0`)
     */
    causticsScale: number;
    /**
     * [KO] 수중 커스틱 애니메이션 속도입니다. (범위: `0` ~ `5`, 기본값: `1.0`)
     * [EN] Underwater caustics animation speed. (Range: `0` ~ `5`, default: `1.0`)
     */
    causticsSpeed: number;
    /**
     * [KO] 스크린 스페이스 반사(SSR) 활성화 여부입니다. (기본값: `true`)
     * [EN] Whether screen-space reflection (SSR) is enabled. (Default: `true`)
     */
    enableSSR: boolean;
    /**
     * [KO] SSR 레이 마칭 최대 추적 거리입니다. (범위: `2` ~ `300`, 기본값: `100.0`)
     * [EN] Maximum SSR ray marching distance. (Range: `2` ~ `300`, default: `100.0`)
     */
    ssrMaxDistance: number;
    /**
     * [KO] SSR 레이 마칭 단계 수입니다. (기본값: `64`)
     * [EN] Number of SSR ray marching steps. (Default: `64`)
     */
    ssrStepCount: number;
    /**
     * [KO] SSR 교차 판정 깊이 두께입니다. (범위: `0.05` ~ `5`, 기본값: `1.0`)
     * [EN] Depth thickness for SSR hit testing. (Range: `0.05` ~ `5`, default: `1.0`)
     */
    ssrThickness: number;
    /**
     * [KO] 물의 탁도입니다. 값이 클수록 수중 시야가 흐려집니다. (범위: `0` ~ `1`, 기본값: `0.35`)
     * [EN] Water turbidity. Higher values reduce underwater visibility. (Range: `0` ~ `1`, default: `0.35`)
     */
    turbidity: number;
    /**
     * [KO] 상호작용 리플 시뮬레이션 도메인의 월드 XZ 중심 좌표입니다. (기본값: `[0.0, 0.0]`)
     * [EN] World XZ center coordinates of the interaction ripple simulation domain. (Default: `[0.0, 0.0]`)
     */
    rippleDomainCenter: [number, number];
    /**
     * [KO] 상호작용 리플 시뮬레이션 도메인의 월드 단위 한 변 크기입니다. (최소값: `1.0`, 기본값: `20.0`)
     * [EN] Side length of the interaction ripple simulation domain in world units. (Min: `1.0`, default: `20.0`)
     */
    rippleDomainSize: number;
    /**
     * [KO] 상호작용 리플이 수면 노멀에 반영되는 강도입니다. (최소값: `0.0`, 기본값: `1.0`)
     * [EN] Strength of interaction ripples applied to the surface normal. (Min: `0.0`, default: `1.0`)
     */
    rippleNormalStrength: number;
}

/**
 * [KO] 굴절, 수심 기반 색상 감쇠, 수중 커스틱, 스크린 스페이스 반사(SSR)를 지원하는 호수 수면 재질 클래스입니다.
 * [EN] Lake water surface material class supporting refraction, depth-based color extinction, underwater caustics, and screen-space reflection (SSR).
 *
 * [KO] `Lake` 인스턴스 생성 시 내부적으로 자동 생성되며, 2패스 렌더링(`use2PathRender`)을 통해 불투명 씬 렌더링 이후 수면 굴절 및 반사를 합성합니다.
 * [EN] Automatically created internally when a `Lake` instance is constructed, and uses 2-pass rendering (`use2PathRender`) to composite water refraction and reflection after the opaque scene is rendered.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const lake = new RedGPU.Water.Lake(redGPUContext, 200, 200);
 * const material = lake.waterMaterial;
 * material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'waterNormal.jpg');
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/water/lake/lakeMaterial/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Basic lake example](/RedGPU/examples/3d/water/lake/basicLake/)
 * @see [Lake material example](/RedGPU/examples/3d/water/lake/lakeMaterial/)
 * @category Water
 */
class LakeMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] `LakeMaterial` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `LakeMaterial`.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param baseColor -
     * [KO] 얕은 수면 색상 HEX 문자열 (기본값: `'#18d8b6'`)
     * [EN] Shallow water color HEX string (default: `'#18d8b6'`)
     * @param deepColor -
     * [KO] 깊은 수심 색상 HEX 문자열 (기본값: `'#065279'`)
     * [EN] Deep water color HEX string (default: `'#065279'`)
     * @param opacity -
     * [KO] 수면 불투명도 (범위: `0` ~ `1`, 기본값: `1.0`)
     * [EN] Water surface opacity (range: `0` ~ `1`, default: `1.0`)
     */
    constructor(redGPUContext: RedGPUContext, baseColor: string = '#18d8b6', deepColor: string = '#065279', opacity: number = 1.0) {
        super(
            redGPUContext,
            'LAKE_MATERIAL',
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
        this.normalTiling = 20.0;
        this.normalDetailTiling = 40.0;
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
        this.rippleDomainSize = 20.0;
        this.rippleNormalStrength = 1.0;

        this.debugMode = 0;
        this.debugMaxDepth = 5.0;
    }
}

defineColorRGB(LakeMaterial, [
    {key: 'baseColor', value: '#18d8b6'},
    {key: 'deepColor', value: '#065279'},
]);

defineTexture(LakeMaterial, [
    {key: 'normalTexture'},
    {key: 'normalDetailTexture'},
    {key: 'rippleTexture'},
]);

defineSampler(LakeMaterial, [
    {key: 'normalTextureSampler'},
]);

defineVector2(LakeMaterial, [
    {key: 'rippleDomainCenter', value: [0.0, 0.0]},
]);

definePositiveNumber(LakeMaterial, [
    {key: 'opacity', value: 1.0, min: 0, max: 1},
    {key: 'refractionStrength', value: 1.0, min: 0, max: 1},
    {key: 'normalScale', value: 1.0, min: 0.0, max: 1.0},
    {key: 'normalDetailScale', value: 0.5, min: 0.0, max: 1.0},
    {key: 'normalTiling', value: 20.0},
    {key: 'normalDetailTiling', value: 40.0},
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
    {key: 'rippleDomainSize', value: 20.0, min: 1.0},
    {key: 'rippleNormalStrength', value: 1.0, min: 0.0},
]);

defineUint(LakeMaterial, [
    {key: 'debugMode', value: 0},
    {key: 'ssrStepCount', value: 64},
]);

defineBoolean(LakeMaterial, [
    {key: 'invertNormalY', value: false},
    {key: 'invertNormalDetailY', value: false},
    {key: 'enableSSR', value: true},
]);

Object.freeze(LakeMaterial);
export default LakeMaterial;

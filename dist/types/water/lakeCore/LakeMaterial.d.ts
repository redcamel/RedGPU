import RedGPUContext from "../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";
import ColorRGB from "../../color/ColorRGB";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import Sampler from "../../resources/sampler/Sampler";
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
     * [KO] 노멀 텍스처 샘플러입니다.
     * [EN] Sampler for normal textures.
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
     * [KO] 월드 `100m` 기준 기본 노멀 텍스처의 타일링 반복 횟수입니다. (기본값: `20.0`)
     * [EN] Tiling repeat count of the primary normal texture per `100m` world scale. (Default: `20.0`)
     */
    normalTiling: number;
    /**
     * [KO] 월드 `100m` 기준 디테일 노멀 텍스처의 타일링 반복 횟수입니다. (기본값: `40.0`)
     * [EN] Tiling repeat count of the detail normal texture per `100m` world scale. (Default: `40.0`)
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
     * [KO] 디버그 시각화 모드입니다. (기본값: `0`)
     * [EN] Debug visualization mode. (Default: `0`)
     */
    debugMode: number;
    /**
     * [KO] 깊이 디버그 시각화의 기준 최대 수심입니다. (기본값: `5.0`)
     * [EN] Reference maximum depth for depth debug visualization. (Default: `5.0`)
     */
    debugMaxDepth: number;
    /**
     * [KO] 기본 노멀 텍스처의 Y 채널 반전 여부입니다. (기본값: `false`)
     * [EN] Whether to invert the Y channel of the primary normal texture. (Default: `false`)
     */
    invertNormalY: boolean;
    /**
     * [KO] 디테일 노멀 텍스처의 Y 채널 반전 여부입니다. (기본값: `false`)
     * [EN] Whether to invert the Y channel of the detail normal texture. (Default: `false`)
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
     * [KO] 물의 탁도입니다. (범위: `0` ~ `1`, 기본값: `0.35`)
     * [EN] Water turbidity. (Range: `0` ~ `1`, default: `0.35`)
     */
    turbidity: number;
    /**
     * [KO] 상호작용 리플 도메인의 월드 XZ 중심 좌표입니다. (기본값: `[0.0, 0.0]`)
     * [EN] World XZ center coordinates of the interaction ripple domain. (Default: `[0.0, 0.0]`)
     */
    rippleDomainCenter: [number, number];
    /**
     * [KO] 상호작용 리플 도메인의 월드 단위 한 변 크기입니다. (최소값: `1.0`, 기본값: `20.0`)
     * [EN] Side length of the interaction ripple domain in world units. (Min: `1.0`, default: `20.0`)
     */
    rippleDomainSize: number;
    /**
     * [KO] 상호작용 리플이 수면 노멀에 반영되는 강도입니다. (최소값: `0.0`, 기본값: `1.0`)
     * [EN] Strength of interaction ripples applied to the surface normal. (Min: `0.0`, default: `1.0`)
     */
    rippleNormalStrength: number;
}
/**
 * [KO] 호수 수면의 굴절, 수심 감쇠, 수중 커스틱 및 스크린 스페이스 반사(SSR)를 표현하는 재질 클래스입니다.
 * [EN] Material class representing lake water refraction, depth extinction, underwater caustics, and screen-space reflection (SSR).
 *
 * [KO] `Lake` 인스턴스 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Automatically created internally when a `Lake` instance is constructed.
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
 * const lake = new RedGPU.Water.Lake(redGPUContext);
 * const material = lake.material;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/water/lake/lakeMaterial/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Basic lake example](/RedGPU/examples/3d/water/lake/basicLake/)
 * @see [Lake material example](/RedGPU/examples/3d/water/lake/lakeMaterial/)
 * @category Water
 */
declare class LakeMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] `LakeMaterial` 인스턴스를 생성합니다.
     * [EN] Creates a `LakeMaterial` instance.
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
    constructor(redGPUContext: RedGPUContext, baseColor?: string, deepColor?: string, opacity?: number);
}
export default LakeMaterial;

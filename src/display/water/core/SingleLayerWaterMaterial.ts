import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import fragmentModuleSource from './shader/singleLayerWaterFragment.wgsl';
import ColorRGB from "../../../color/ColorRGB";
import defineUint from "../../../defineProperty/funcs/number/defineUint";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineColorRGB from "../../../defineProperty/funcs/color/defineColorRGB";
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
     * [KO] 디버그 뷰 모드 (0: PBR Water, 1: Raw, 2: Linear Scene, 3: Linear Water, 4: Delta Depth, 5: Depth Fade, 6: Passthrough, 7: Extinction, 8: Albedo)
     * [EN] Debug view mode (0: PBR Water, 1: Raw, 2: Linear Scene, 3: Linear Water, 4: Delta Depth, 5: Depth Fade, 6: Passthrough, 7: Extinction, 8: Albedo)
     */
    debugMode: number;
    /**
     * [KO] 수심 마스크 시각화 정규화 기준 거리 (단위: m, 기본값: 5.0m)
     * [EN] Depth mask visualization normalization distance (Unit: m, default: 5.0m)
     */
    debugMaxDepth: number;
}

/**
 * [KO] 언리얼 엔진 5의 SingleLayerWater (SLW) 셰이딩 모델 기반 PBR 수면 머티리얼 클래스 (Phase 6 - Beer-Lambert Water Optics)
 * [EN] PBR water material class based on Unreal Engine 5 SingleLayerWater (SLW) shading model (Phase 6 - Beer-Lambert Water Optics)
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
     * @param opacity - 기본 수면 불투명도 (기본값: 0.85)
     */
    constructor(redGPUContext: RedGPUContext, baseColor: string = '#18d8b6', deepColor: string = '#023d58', opacity: number = 0.85) {
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

        this.initGPURenderInfos();

        this.baseColor.setColorByHEX(baseColor);
        this.deepColor.setColorByHEX(deepColor);
        this.opacity = opacity;
        this.extinctionFactor = 0.28;
        this.depthFadeDistance = 1.0;

        // 기본 디버그 모드: Step 6 PBR Water with Beer-Lambert Absorption (0)
        this.debugMode = 0;
        this.debugMaxDepth = 5.0;
    }
}

defineColorRGB(SingleLayerWaterMaterial, [
    {key: 'baseColor', value: '#18d8b6'},
    {key: 'deepColor', value: '#023d58'},
]);

definePositiveNumber(SingleLayerWaterMaterial, [
    {key: 'extinctionFactor', value: 0.28},
    {key: 'opacity', value: 0.85, min: 0, max: 1},
    {key: 'depthFadeDistance', value: 1.0},
    {key: 'debugMaxDepth', value: 5.0},
]);

defineUint(SingleLayerWaterMaterial, [
    {key: 'debugMode', value: 0},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;

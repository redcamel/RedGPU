import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import fragmentModuleSource from './shader/singleLayerWaterFragment.wgsl';
import defineUint from "../../../defineProperty/funcs/number/defineUint";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";

interface SingleLayerWaterMaterial {
    /**
     * [KO] 디버그 뷰 모드 (0: Soft Pink with Fade, 1: Raw Depth, 2: Linear Scene, 3: Linear Water, 4: Delta Depth, 5: Depth Fade Mask)
     * [EN] Debug view mode (0: Soft Pink with Fade, 1: Raw Depth, 2: Linear Scene, 3: Linear Water, 4: Delta Depth, 5: Depth Fade Mask)
     */
    debugMode: number;
    /**
     * [KO] 수심 마스크 시각화 정규화 기준 거리 (단위: m, 기본값: 5.0m)
     * [EN] Depth mask visualization normalization distance (Unit: m, default: 5.0m)
     */
    debugMaxDepth: number;
    /**
     * [KO] 해안선 및 지형 경계면 소프트 페이드 거리 (단위: m, 기본값: 1.0m)
     * [EN] Shoreline and terrain boundary soft depth fade distance (Unit: m, default: 1.0m)
     */
    depthFadeDistance: number;
}

/**
 * [KO] 언리얼 엔진 5의 SingleLayerWater (SLW) 셰이딩 모델 기반 PBR 수면 머티리얼 클래스 (Phase 4 - Depth Fade)
 * [EN] PBR water material class based on Unreal Engine 5 SingleLayerWater (SLW) shading model (Phase 4 - Depth Fade)
 *
 * @category Material
 */
class SingleLayerWaterMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] SingleLayerWaterMaterial 생성자
     * [EN] SingleLayerWaterMaterial constructor
     * @param redGPUContext - RedGPUContext 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
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

        // 기본 디버그 모드: Step 4 Soft Pink with Depth Fade (0)
        this.debugMode = 0;
        this.debugMaxDepth = 5.0;
        this.depthFadeDistance = 1.0;
    }
}

defineUint(SingleLayerWaterMaterial, [
    {key: 'debugMode', value: 0},
]);

definePositiveNumber(SingleLayerWaterMaterial, [
    {key: 'debugMaxDepth', value: 5.0},
    {key: 'depthFadeDistance', value: 1.0},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;

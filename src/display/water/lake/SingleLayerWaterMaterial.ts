import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
import fragmentModuleSource from './fragment.wgsl';
import defineColorRGB from "../../../defineProperty/funcs/color/defineColorRGB";

interface SingleLayerWaterMaterial {
    /**
     * [KO] 수면 기본 컬러(ColorRGB)
     * [EN] Water surface base color (ColorRGB)
     */
    color: ColorRGB;
}

/**
 * [KO] 언리얼 엔진 5(UE5)의 SingleLayerWater 셰이딩 모델에 대응하는 수체 렌더링 전용 머티리얼 클래스입니다.
 * [EN] Dedicated water rendering material class corresponding to Unreal Engine 5 (UE5) SingleLayerWater shading model.
 *
 * [KO] Step 0에서는 가장 단순한 단색 반투명 수면 평면을 렌더링하며, 후속 단계에서 다중 노멀 스크롤, Depth Fade, 비어-람베르트 감쇄, 스넬 굴절 왜곡으로 점진 확장됩니다.
 * [EN] Step 0 renders a basic monochromatic translucent water plane, and progressively extends with multi-normal scrolling, depth fade, Beer-Lambert extinction, and Snell refraction distortion in subsequent steps.
 *
 * @category Material
 */
class SingleLayerWaterMaterial extends ABaseMaterial {
    /**
     * [KO] SingleLayerWaterMaterial 생성자
     * [EN] SingleLayerWaterMaterial constructor
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param color - 기본 수면 HEX 컬러 (기본값: '#1a5b8c')
     * @param opacity - 기본 수면 불투명도 (기본값: 0.65)
     */
    constructor(redGPUContext: RedGPUContext, color: string = '#1a5b8c', opacity: number = 0.65) {
        super(
            redGPUContext,
            'SINGLE_LAYER_WATER_MATERIAL',
            fragmentModuleSource,
            2
        );
        this.transparent = true;
        this.initGPURenderInfos();
        this.color.setColorByHEX(color);
        this.opacity = opacity;
    }
}

Object.defineProperty(SingleLayerWaterMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});

defineColorRGB(SingleLayerWaterMaterial, [
    {key: 'color'},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;

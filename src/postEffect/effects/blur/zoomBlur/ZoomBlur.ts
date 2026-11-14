import RedGPUContext from "../../../../context/RedGPUContext";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface ZoomBlur {
    /**
     * [KO] 블러 강도 (0 ~ 100)
     * [EN] Blur strength (0 ~ 100)
     * @defaultValue 10
     */
    amount: number;
    /**
     * [KO] 블러 중심점 X 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Blur center X offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerX: number;
    /**
     * [KO] 블러 중심점 Y 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Blur center Y offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerY: number;
    /**
     * [KO] 샘플링 횟수 (1 ~ 100)
     * [EN] Number of samples (1 ~ 100)
     * @defaultValue 16
     */
    sampleCount: number;
}

/**
 * [KO] 화면의 특정 지점을 향해 방사형 줌 번짐을 적용하는 줌 블러 후처리 이펙트입니다.
 * [EN] Zoom Blur post-processing effect that applies radial zoom blur toward a specific screen point.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * effect.amount = 80;
 * effect.sampleCount = 40;
 * effect.centerX = 100;
 * effect.centerY = -50;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/zoomBlur/" style="width:100%; height:500px;"></iframe>
 *
 * @see [ZoomBlur example](/RedGPU/examples/postEffect/blur/zoomBlur/)
 * @category Blur
 */
class ZoomBlur extends ASingleComputePassPostEffect {

    /**
     * [KO] ZoomBlur 인스턴스를 생성합니다.
     * [EN] Creates a ZoomBlur instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1, isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_ZOOM_BLUR',
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

    /**
     * [KO] 줌 블러(Zoom Blur) 효과를 렌더링합니다.
     * [EN] Renders the zoom blur effect.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] 줌 블러가 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with zoom blur applied (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.amount <= 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

definePositiveNumber(ZoomBlur, [
    {key: 'amount', value: 10, min: 0, max: 100}
]);
defineNumber(ZoomBlur, [
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
]);
defineUint(ZoomBlur, [
    {key: 'sampleCount', value: 16, min: 1, max: 100}
]);
Object.freeze(ZoomBlur);
export default ZoomBlur;

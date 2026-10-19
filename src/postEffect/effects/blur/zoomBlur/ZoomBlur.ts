import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";


interface ZoomBlur {
    /**
     * [KO] 블러 강도 (기본값: 10)
     * [EN] Blur strength (default: 10)
     */
    amount: number
    /**
     * [KO] 블러 중심점 X 오프셋 (단위: 픽셀, 0 = 화면 중앙, 기본값: 0)
     * [EN] Blur center X offset (unit: pixels, 0 = screen center, default: 0)
     */
    centerX: number
    /**
     * [KO] 블러 중심점 Y 오프셋 (단위: 픽셀, 0 = 화면 중앙, 기본값: 0)
     * [EN] Blur center Y offset (unit: pixels, 0 = screen center, default: 0)
     */
    centerY: number
    /**
     * [KO] 샘플링 횟수 (범위: 1 ~ 100, 기본값: 30)
     * [EN] Number of samples (range: 1 to 100, default: 30)
     */
    sampleCount: number
}

/**
 * [KO] 화면의 특정 지점을 향해 방사형 줌 번짐을 적용하는 줌 블러 후처리 이펙트입니다.
 * [EN] Zoom Blur post-processing effect that applies radial zoom blur toward a specific screen point.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * // [KO] 블러 강도 및 샘플링 횟수 조절
 * // [EN] Adjust blur strength and sample count
 * effect.amount = 80;
 * effect.sampleCount = 40;
 * // [KO] 중심점 오프셋 설정 (단위: 픽셀)
 * // [EN] Set center offset (unit: pixels)
 * effect.centerX = 100;
 * effect.centerY = -50;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/zoomBlur/" style="width:100%; height:500px;"></iframe>
 * @see [ZoomBlur example](/RedGPU/examples/postEffect/blur/zoomBlur/)
 * @category Blur
 */
class ZoomBlur extends ASinglePassPostEffect {

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
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_ZOOM_BLUR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}

definePositiveNumber(ZoomBlur, [
    {key: 'amount', value: 10}
])
defineNumber(ZoomBlur, [
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
])
defineUint(ZoomBlur, [
    {key: 'sampleCount', value: 30, min: 1, max: 100}
])
Object.freeze(ZoomBlur)
export default ZoomBlur

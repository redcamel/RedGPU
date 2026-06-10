import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";


interface ZoomBlur {
    /** [KO] 블러 강도. 값이 클수록 줌 번짐이 강해집니다. [EN] Blur strength. Higher values increase zoom bleeding. */
    amount: number
    /** [KO] 블러의 중심점 X 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Blur center X offset (in pixels, 0 is screen center). */
    centerX: number
    /** [KO] 블러의 중심점 Y 오프셋 (픽셀 단위, 0은 화면 중앙). [EN] Blur center Y offset (in pixels, 0 is screen center). */
    centerY: number
    /** [KO] 샘플링 횟수 (1 ~ 100). [EN] Number of samples (1 to 100). */
    sampleCount: number
}

/**
 * [KO] 줌 블러(Zoom Blur) 후처리 이펙트입니다.
 * [EN] Zoom Blur post-processing effect.
 *
 * [KO] 화면의 특정 지점을 향해 이미지가 빨려 들어가는 듯한 방사형 블러 효과를 만듭니다. (0,0)은 화면의 정중앙을 의미합니다.
 * [EN] Creates a radial blur effect as if the image is being sucked into a specific point. (0,0) refers to the exact center of the screen.
 *
 * [KO] 하드웨어 선형 샘플러를 사용하여 매끄러운 품질을 제공합니다.
 * [EN] Provides smooth quality using hardware linear sampling.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * effect.amount = 80;         // 블러 강도
 * effect.sampleCount = 40;    // 샘플링 횟수 조절 (품질 향상)
 * effect.centerX = 100;       // 중앙에서 오른쪽으로 100픽셀 이동
 * effect.centerY = -50;       // 중앙에서 위쪽으로 50픽셀 이동
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/zoomBlur/"></iframe>
 * @category Blur
 */
class ZoomBlur extends ASinglePassPostEffect {

    /**
     * [KO] ZoomBlur 인스턴스를 생성합니다.
     * [EN] Creates a ZoomBlur instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
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

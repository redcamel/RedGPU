import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";

interface ZoomBlur {
    amount: number
    centerX: number
    centerY: number
    sampleCount: number
}

/**
 * [KO] 줌 블러(Zoom Blur) 후처리 이펙트입니다.
 * [EN] Zoom Blur post-processing effect.
 *
 * [KO] 중심점에서 방사형으로 퍼지는 블러 효과를 만듭니다. 하드웨어 선형 샘플링을 사용하여 매끄러운 품질을 제공합니다.
 * [EN] Creates a blur effect spreading radially from the center point. Provides smooth quality using hardware linear sampling.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * effect.amount = 80;         // 블러 강도
 * effect.sampleCount = 40;    // 샘플링 횟수 조절 (품질 향상)
 * effect.centerX = 0.5;       // 중심 X (0~1)
 * effect.centerY = 0.5;       // 중심 Y (0~1)
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

DefineGPUProperty.definePositiveNumber(ZoomBlur, [
    {key: 'amount', value: 10}
])
DefineGPUProperty.defineNumber(ZoomBlur, [
    {key: 'centerX', value: 0},
    {key: 'centerY', value: 0},
])
DefineGPUProperty.defineUint(ZoomBlur, [
    {key: 'sampleCount', value: 30, min: 1, max: 100}
])
Object.freeze(ZoomBlur)
export default ZoomBlur

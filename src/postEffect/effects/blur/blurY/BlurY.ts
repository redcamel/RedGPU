import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";


interface BlurY {
    size: number,
    sampleCount: number
}

/**
 * [KO] Y축 방향 고품질 가우시안 블러(Blur) 효과를 제공하는 클래스입니다.
 * [EN] Class that provides a high-quality Gaussian Blur effect in the Y-axis direction.
 *
 * [KO] 하드웨어 가속 선형 샘플러를 활용하여 노이즈 없는 매끄러운 블러 품질을 구현합니다.
 * [EN] Achieves smooth, noise-free blur quality by utilizing a hardware-accelerated linear sampler.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BlurY(redGPUContext);
 * effect.size = 64;         // 블러 강도 조절
 * effect.sampleCount = 20;  // 샘플링 횟수 조절 (품질 향상)
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blurY/"></iframe>
 * @category Blur
 */
class BlurY extends ASinglePassPostEffect {

    /**
     * [KO] BlurY 인스턴스를 생성합니다.
     * [EN] Creates a BlurY instance.
     *
     * @param redGPUContext - [KO] RedGPU 렌더링 컨텍스트 [EN] RedGPU rendering context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BLUR_Y',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

    }
}

definePositiveNumber(BlurY, [
    {key: 'size', value: 32, min: 0, max: 512}
])
defineUint(BlurY, [
    {key: 'sampleCount', value: 10, min: 1, max: 100}
])
Object.freeze(BlurY)
export default BlurY

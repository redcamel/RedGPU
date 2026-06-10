import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface BlurX {
    size: number;
    sampleCount: number;
}
/**
 * [KO] X축 방향 고품질 가우시안 블러(Blur) 효과를 제공하는 클래스입니다.
 * [EN] Class that provides a high-quality Gaussian Blur effect in the X-axis direction.
 *
 * [KO] 하드웨어 가속 선형 샘플러를 활용하여 노이즈 없는 매끄러운 블러 품질을 구현합니다.
 * [EN] Achieves smooth, noise-free blur quality by utilizing a hardware-accelerated linear sampler.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BlurX(redGPUContext);
 * effect.size = 64;         // 블러 강도 조절
 * effect.sampleCount = 20;  // 샘플링 횟수 조절 (품질 향상)
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blurX/"></iframe>
 * @category Blur
 */
declare class BlurX extends ASinglePassPostEffect {
    /**
     * [KO] BlurX 인스턴스를 생성합니다.
     * [EN] Creates a BlurX instance.
     *
     * @param redGPUContext - [KO] RedGPU 렌더링 컨텍스트 [EN] RedGPU rendering context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default BlurX;

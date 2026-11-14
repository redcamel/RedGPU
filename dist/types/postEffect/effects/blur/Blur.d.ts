import RedGPUContext from "../../../context/RedGPUContext";
import ASingleComputePassPostEffect from "../../core/ASingleComputePassPostEffect";
/**
 * [KO] 고정된 3x3 커널을 사용하는 컨볼루션 기반의 블러 후처리 이펙트입니다.
 * [EN] Convolution-based blur post-processing effect using a fixed 3x3 kernel.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Blur(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blur/"></iframe>
 *
 * @see [Blur example](/RedGPU/examples/postEffect/blur/blur/)
 * @category Blur
 */
declare class Blur extends ASingleComputePassPostEffect {
    /**
     * [KO] Blur 인스턴스를 생성합니다.
     * [EN] Creates a Blur instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Blur(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default Blur;

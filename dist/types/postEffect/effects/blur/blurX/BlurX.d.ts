import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] X축 방향 블러 후처리 효과를 제공하는 클래스입니다.
 * [EN] Class that provides X-axis blur post-processing effect.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BlurX(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blurX/"></iframe>
 * @category Blur
 */
declare class BlurX extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] BlurX 인스턴스를 생성합니다.
     * [EN] Creates a BlurX instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 블러 강도를 반환합니다.
     * [EN] Returns the blur strength.
     */
    get size(): number;
    /**
     * [KO] 블러 강도를 설정합니다. (최소 0)
     * [EN] Sets the blur strength. (Minimum 0)
     *
     * @param value
     * [KO] 블러 강도
     * [EN] Blur strength
     */
    set size(value: number);
}
export default BlurX;

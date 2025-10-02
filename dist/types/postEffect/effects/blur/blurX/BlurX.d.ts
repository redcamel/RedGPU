import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * X축 방향 블러 후처리 효과를 제공하는 클래스입니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.BlurX(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/blur/blurX/"></iframe>
 */
declare class BlurX extends ASinglePassPostEffect {
    #private;
    /**
     * BlurX 인스턴스를 생성합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * 블러 강도를 반환합니다.
     */
    get size(): number;
    /**
     * 블러 강도를 설정합니다.
     * 최소값은 0입니다.
     * @param value - 블러 강도
     */
    set size(value: number);
}
export default BlurX;

import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 비네팅(Vignetting) 후처리 이펙트입니다.
 * [EN] Vignetting post-processing effect.
 *
 * [KO] 화면 가장자리를 어둡게 하여 집중도를 높이는 효과를 만듭니다.
 * [EN] Creates an effect that darkens the edges of the screen to increase focus.
 *
 * [KO] size(범위), smoothness(부드러움)를 조절할 수 있습니다.
 * [EN] Can adjust size (range) and smoothness.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
 * effect.size = 0.6;        // 비네팅 범위
 * effect.smoothness = 0.3;  // 경계 부드러움
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/vignetting/"></iframe>
 * @category Lens
 */
declare class Vignetting extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] Vignetting 인스턴스를 생성합니다.
     * [EN] Creates a Vignetting instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 비네팅 범위를 반환합니다.
     * [EN] Returns the vignetting size.
     */
    get size(): number;
    /**
     * [KO] 비네팅 범위를 설정합니다. (최소 0)
     * [EN] Sets the vignetting size. (Minimum 0)
     */
    set size(value: number);
    /**
     * [KO] 비네팅 부드러움을 반환합니다.
     * [EN] Returns the vignetting smoothness.
     */
    get smoothness(): number;
    /**
     * [KO] 비네팅 부드러움을 설정합니다. (0 ~ 1)
     * [EN] Sets the vignetting smoothness. (0 ~ 1)
     */
    set smoothness(value: number);
}
export default Vignetting;

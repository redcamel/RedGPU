import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 바이브런스/채도(Vibrance/Saturation) 후처리 이펙트입니다.
 * [EN] Vibrance/Saturation post-processing effect.
 *
 * [KO] 채도와 바이브런스를 각각 조절할 수 있습니다.
 * [EN] Can adjust Saturation and Vibrance respectively.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;    // 바이브런스 증가
 * effect.saturation = 20;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/vibrance/"></iframe>
 * @category Adjustments
 */
declare class Vibrance extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] Vibrance 인스턴스를 생성합니다.
     * [EN] Creates a Vibrance instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 바이브런스 값을 반환합니다.
     * [EN] Returns the vibrance value.
     */
    get vibrance(): number;
    /**
     * [KO] 바이브런스 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the vibrance value. (-100 ~ 100)
     */
    set vibrance(value: number);
    /**
     * [KO] 채도 값을 반환합니다.
     * [EN] Returns the saturation value.
     */
    get saturation(): number;
    /**
     * [KO] 채도 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the saturation value. (-100 ~ 100)
     */
    set saturation(value: number);
}
export default Vibrance;

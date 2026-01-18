import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 바이브런스/채도(Vibrance/Saturation) 후처리 이펙트입니다.
 * 채도와 바이브런스를 각각 조절할 수 있습니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;    // 바이브런스 증가
 * effect.saturation = 20;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/vibrance/"></iframe>
 */
declare class Vibrance extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 바이브런스 반환 */
    get vibrance(): number;
    /**
     * 바이브런스 설정
     * 범위 -100~100
     */
    set vibrance(value: number);
    /** 채도 반환 */
    get saturation(): number;
    /**
     * 채도 설정
     * 범위 -100~100
     */
    set saturation(value: number);
}
export default Vibrance;

import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 줌 블러(Zoom Blur) 후처리 이펙트입니다.
 * 중심점에서 방사형으로 퍼지는 블러 효과를 만듭니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/zoomBlur/"></iframe>
 */
declare class ZoomBlur extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 중심 X 반환 */
    get centerX(): number;
    /** 중심 X 설정 */
    set centerX(value: number);
    /** 중심 Y 반환 */
    get centerY(): number;
    /** 중심 Y 설정 */
    set centerY(value: number);
    /** 블러 강도 반환 */
    get amount(): number;
    /** 블러 강도 설정. 최소 0 */
    set amount(value: number);
}
export default ZoomBlur;

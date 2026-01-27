import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 줌 블러(Zoom Blur) 후처리 이펙트입니다.
 * [EN] Zoom Blur post-processing effect.
 *
 * [KO] 중심점에서 방사형으로 퍼지는 블러 효과를 만듭니다.
 * [EN] Creates a blur effect spreading radially from the center point.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ZoomBlur(redGPUContext);
 * effect.amount = 80;      // 블러 강도
 * effect.centerX = 0.5;    // 중심 X (0~1)
 * effect.centerY = 0.5;    // 중심 Y (0~1)
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/zoomBlur/"></iframe>
 * @category Blur
 */
declare class ZoomBlur extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] ZoomBlur 인스턴스를 생성합니다.
     * [EN] Creates a ZoomBlur instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 중심 X 좌표를 반환합니다.
     * [EN] Returns the center X coordinate.
     */
    get centerX(): number;
    /**
     * [KO] 중심 X 좌표를 설정합니다.
     * [EN] Sets the center X coordinate.
     */
    set centerX(value: number);
    /**
     * [KO] 중심 Y 좌표를 반환합니다.
     * [EN] Returns the center Y coordinate.
     */
    get centerY(): number;
    /**
     * [KO] 중심 Y 좌표를 설정합니다.
     * [EN] Sets the center Y coordinate.
     */
    set centerY(value: number);
    /**
     * [KO] 블러 강도를 반환합니다.
     * [EN] Returns the blur strength.
     */
    get amount(): number;
    /**
     * [KO] 블러 강도를 설정합니다. (최소 0)
     * [EN] Sets the blur strength. (Minimum 0)
     */
    set amount(value: number);
}
export default ZoomBlur;

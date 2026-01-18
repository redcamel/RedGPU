import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 밝기/대비 조절 후처리 이펙트입니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.BrightnessContrast(redGPUContext);
 * effect.brightness = 50;
 * effect.contrast = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/brightnessContrast/"></iframe>
 */
declare class BrightnessContrast extends ASinglePassPostEffect {
    #private;
    /**
     * BrightnessContrast 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 밝기 반환 */
    get brightness(): number;
    /**
     * 밝기 설정
     * 범위: -150~150
     */
    set brightness(value: number);
    /** 대비 반환 */
    get contrast(): number;
    /**
     * 대비 설정
     * 범위: -50~100
     */
    set contrast(value: number);
}
export default BrightnessContrast;

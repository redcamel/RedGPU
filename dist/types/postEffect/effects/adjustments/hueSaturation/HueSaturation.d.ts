import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 색상/채도(Hue/Saturation) 후처리 이펙트입니다.
 * 색상(Hue)과 채도(Saturation)를 조절할 수 있습니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
 * effect.hue = 90;         // 색상 회전
 * effect.saturation = 50;  // 채도 증가
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/hueSaturation/"></iframe>
 */
declare class HueSaturation extends ASinglePassPostEffect {
    #private;
    /**
     * HueSaturation 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 색상 반환 */
    get hue(): number;
    /**
     * 색상 설정
     * 범위 -180~180
     */
    set hue(value: number);
    /** 채도 반환 */
    get saturation(): number;
    /**
     * 채도 설정
     * 범위 -100~100
     */
    set saturation(value: number);
}
export default HueSaturation;

import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 임계값(Threshold) 후처리 이펙트입니다.
 * 지정한 임계값을 기준으로 픽셀을 흑백으로 변환합니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Threshold(redGPUContext);
 * effect.threshold = 200; // 임계값 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/threshold/"></iframe>
 */
declare class Threshold extends ASinglePassPostEffect {
    #private;
    /**
     * Threshold 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 임계값 반환 */
    get threshold(): number;
    /**
     * 임계값 설정
     * 범위 1~255
     */
    set threshold(value: number);
}
export default Threshold;

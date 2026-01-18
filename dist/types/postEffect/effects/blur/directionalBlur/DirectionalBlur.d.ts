import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 방향성 블러(Directional Blur) 후처리 이펙트입니다.
 * 각도와 강도를 지정해 원하는 방향으로 블러를 적용할 수 있습니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
 * effect.angle = 45;   // 45도 방향 블러
 * effect.amount = 30;  // 블러 강도
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/directionalBlur/"></iframe>
 */
declare class DirectionalBlur extends ASinglePassPostEffect {
    #private;
    /**
     * DirectionalBlur 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 블러 각도 반환 */
    get angle(): number;
    /**
     * 블러 각도 설정(도)
     * 0=오른쪽, 360도로 정규화
     * @param value 각도
     */
    set angle(value: number);
    /** 블러 강도 반환 */
    get amount(): number;
    /**
     * 블러 강도 설정
     * 최소값 0
     * @param value 강도
     */
    set amount(value: number);
}
export default DirectionalBlur;

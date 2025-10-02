import RedGPUContext from "../../../context/RedGPUContext";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
/**
 * 가우시안 블러(Gaussian Blur) 후처리 이펙트입니다.
 * X, Y 방향 블러를 적용해 부드러운 블러 효과를 만듭니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
 * effect.size = 64; // 블러 강도 조절
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/blur/gaussianBlur/"></iframe>
 */
declare class GaussianBlur extends AMultiPassPostEffect {
    #private;
    /**
     * GaussianBlur 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 블러 강도 반환 */
    get size(): number;
    /**
     * 블러 강도 설정
     * 최소값 0
     */
    set size(value: number);
}
export default GaussianBlur;

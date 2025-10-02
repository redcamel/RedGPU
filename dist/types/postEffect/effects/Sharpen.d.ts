import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AMultiPassPostEffect from "../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../core/ASinglePassPostEffect";
/**
 * 샤픈(Sharpen) 후처리 이펙트입니다.
 * 컨볼루션 커널을 이용해 이미지의 경계와 디테일을 강조합니다.
 *
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/sharpen/"></iframe>
 */
declare class Sharpen extends AMultiPassPostEffect {
    #private;
    /**
     * Sharpen 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * 샤픈 효과를 렌더링합니다.
     * @returns 샤픈 처리된 텍스처 결과
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default Sharpen;

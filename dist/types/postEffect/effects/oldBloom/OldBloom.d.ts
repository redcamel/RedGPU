import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
/**
 * 올드 블룸(Old Bloom) 후처리 이펙트입니다.
 * 임계값, 가우시안 블러, 블렌드 단계를 거쳐 밝은 영역에 부드러운 빛 번짐 효과를 만듭니다.
 *
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
 * effect.threshold = 180;        // 밝기 임계값
 * effect.gaussianBlurSize = 48;  // 블러 강도
 * effect.exposure = 1.2;         // 노출
 * effect.bloomStrength = 1.5;    // 블룸 강도
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/oldBloom/"></iframe>
 */
declare class OldBloom extends AMultiPassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 밝기 임계값 반환 */
    get threshold(): number;
    /** 밝기 임계값 설정 */
    set threshold(value: number);
    /** 블러 강도 반환 */
    get gaussianBlurSize(): number;
    /** 블러 강도 설정 */
    set gaussianBlurSize(value: number);
    /** 노출 반환 */
    get exposure(): number;
    /** 노출 설정 */
    set exposure(value: number);
    /** 블룸 강도 반환 */
    get bloomStrength(): number;
    /** 블룸 강도 설정 */
    set bloomStrength(value: number);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default OldBloom;

import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { ASinglePassPostEffectResult } from "../../core/ASinglePassPostEffect";
/**
 * [KO] 올드 블룸(Old Bloom) 후처리 이펙트입니다.
 * [EN] Old Bloom post-processing effect.
 *
 * [KO] 임계값, 가우시안 블러, 블렌드 단계를 거쳐 밝은 영역에 부드러운 빛 번짐 효과를 만듭니다.
 * [EN] Creates a soft glow effect in bright areas through threshold, Gaussian blur, and blend steps.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
 * effect.threshold = 180;
 * effect.gaussianBlurSize = 48;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/oldBloom/"></iframe>
 * @category Visual Effects
 */
declare class OldBloom extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] OldBloom 인스턴스를 생성합니다.
     * [EN] Creates an OldBloom instance.
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     */
    constructor(redGPUContext: RedGPUContext);
    get threshold(): number;
    set threshold(value: number);
    get gaussianBlurSize(): number;
    set gaussianBlurSize(value: number);
    get exposure(): number;
    set exposure(value: number);
    get bloomStrength(): number;
    set bloomStrength(value: number);
    /**
     * [KO] 올드 블룸 효과를 렌더링합니다. (Threshold -> GaussianBlur -> Blend)
     * [EN] Renders the old bloom effect. (Threshold -> GaussianBlur -> Blend)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default OldBloom;

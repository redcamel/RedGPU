import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { IPostEffectResult } from "../../core/types";
/**
 * [KO] 올드 블룸(Old Bloom) 후처리 이펙트입니다.
 * [EN] Old Bloom post-processing effect.
 *
 * [KO] 클래식한 방식의 블룸 효과를 구현합니다. 밝은 영역을 추출(Threshold)하고, 가우시안 블러(Gaussian Blur)를 적용한 뒤, 원본 이미지와 합성(Blend)하여 부드러운 빛 번짐 효과를 만듭니다.
 * [EN] Implements a classic bloom effect. It extracts bright areas (Threshold), applies Gaussian Blur, and then blends them with the original image to create a soft glow effect.
 *
 * [KO] 이 효과는 HDR 공간에서 동작하여 1.0 이상의 밝기 에너지를 보존하며 시네마틱한 결과물을 제공합니다.
 * [EN] This effect operates in HDR space, preserving brightness energy above 1.0 to provide cinematic results.
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
    /**
     * [KO] 임계값을 반환합니다.
     * [EN] Returns the threshold.
     *
     * @returns
     * [KO] 최소 밝기 기준값
     * [EN] Minimum brightness threshold
     */
    get threshold(): number;
    /**
     * [KO] 임계값을 설정합니다.
     * [EN] Sets the threshold.
     *
     * @param value -
     * [KO] 최소 밝기 기준값
     * [EN] Minimum brightness threshold
     */
    set threshold(value: number);
    /**
     * [KO] 가우시안 블러 크기를 반환합니다.
     * [EN] Returns the Gaussian blur size.
     *
     * @returns
     * [KO] 블러 크기 (반경)
     * [EN] Blur size (radius)
     */
    get gaussianBlurSize(): number;
    /**
     * [KO] 가우시안 블러 크기를 설정합니다.
     * [EN] Sets the Gaussian blur size.
     *
     * @param value -
     * [KO] 블러 크기 (반경)
     * [EN] Blur size (radius)
     */
    set gaussianBlurSize(value: number);
    /**
     * [KO] 노출값을 반환합니다.
     * [EN] Returns the exposure value.
     *
     * @returns
     * [KO] 노출 보정값
     * [EN] Exposure compensation value
     */
    get exposure(): number;
    /**
     * [KO] 노출값을 설정합니다.
     * [EN] Sets the exposure value.
     *
     * @param value -
     * [KO] 노출 보정값
     * [EN] Exposure compensation value
     */
    set exposure(value: number);
    /**
     * [KO] 블룸 강도를 반환합니다.
     * [EN] Returns the bloom strength.
     *
     * @returns
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    get bloomStrength(): number;
    /**
     * [KO] 블룸 강도를 설정합니다.
     * [EN] Sets the bloom strength.
     *
     * @param value -
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    set bloomStrength(value: number);
    /**
     * [KO] 올드 블룸 효과를 단계별로 렌더링합니다.
     * [EN] Renders the old bloom effect step by step.
     *
     * [KO] 1단계: 밝은 영역 추출 (Threshold)
     * [KO] 2단계: 추출된 영역 블러 처리 (GaussianBlur)
     * [KO] 3단계: 원본과 블러된 이미지 합성 (OldBloomBlend)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default OldBloom;

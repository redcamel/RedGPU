import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { IPostEffectResult } from "../../core/types";
/**
 * [KO] 밝은 영역 추출(Threshold), 가우시안 블러(Gaussian Blur), 원본 합성을 통해 빛 번짐을 구현하는 올드 블룸(Old Bloom) 후처리 이펙트입니다.
 * [EN] Old Bloom post-processing effect that implements light bleeding by extracting bright areas (Threshold), applying Gaussian Blur, and blending with the original image.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
 * effect.threshold = 180;
 * effect.gaussianBlurSize = 48;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/oldBloom/" style="width:100%; height:500px;"></iframe>
 *
 * @see [OldBloom example](/RedGPU/examples/postEffect/oldBloom/)
 * @category Visual Effects
 */
declare class OldBloom extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] OldBloom 인스턴스를 생성합니다.
     * [EN] Creates an OldBloom instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 밝은 영역 추출 기준 임계값(1 ~ 255)을 반환하거나 설정합니다.
     * [EN] Returns or sets the threshold value (1 ~ 255) for extracting bright areas.
     *
     * @defaultValue 156
     * @returns
     * [KO] 밝기 임계값
     * [EN] Brightness threshold
     */
    get threshold(): number;
    set threshold(value: number);
    /**
     * [KO] 가우시안 블러 반경 크기(단위: 픽셀)를 반환하거나 설정합니다.
     * [EN] Returns or sets the Gaussian blur radius size (in pixels).
     *
     * @defaultValue 32
     * @returns
     * [KO] 블러 반경 크기
     * [EN] Blur radius size
     */
    get gaussianBlurSize(): number;
    set gaussianBlurSize(value: number);
    /**
     * [KO] 노출 보정값을 반환하거나 설정합니다.
     * [EN] Returns or sets the exposure compensation value.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 노출 보정값
     * [EN] Exposure compensation value
     */
    get exposure(): number;
    set exposure(value: number);
    /**
     * [KO] 블룸 효과 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the bloom effect strength.
     *
     * @defaultValue 1.2
     * @returns
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    get bloomStrength(): number;
    set bloomStrength(value: number);
    /**
     * [KO] 올드 블룸 다중 패스 후처리 효과를 렌더링합니다.
     * [EN] Renders the multi-pass Old Bloom post-processing effect.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] 블룸 합성된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Bloom composited output texture information (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default OldBloom;

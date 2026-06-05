import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import Threshold from "../adjustments/threshold/Threshold";
import GaussianBlur from "../blur/GaussianBlur";
import OldBloomBlend from "./oldBloomBlend/OldBloomBlend";

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
class OldBloom extends AMultiPassPostEffect {
    #effect_threshold: Threshold;
    #effect_gaussianBlur: GaussianBlur;
    #effect_oldBloomBlend: OldBloomBlend;

    /**
     * [KO] 블룸이 발생할 최소 밝기 기준값 (0 ~ 255)
     * [EN] Minimum brightness threshold for bloom (0 ~ 255)
     * @defaultValue 156
     */
    #threshold: number = 156;
    /**
     * [KO] 빛 번짐의 크기 (블러 반경)
     * [EN] Size of light bleeding (blur radius)
     * @defaultValue 32
     */
    #gaussianBlurSize: number = 32;
    /**
     * [KO] 최종 합성 시의 노출 보정값
     * [EN] Exposure compensation for final composition
     * @defaultValue 1.0
     */
    #exposure: number = 1.0;
    /**
     * [KO] 블룸 효과의 강도
     * [EN] Intensity of the bloom effect
     * @defaultValue 1.2
     */
    #bloomStrength: number = 1.2;

    /**
     * [KO] OldBloom 인스턴스를 생성합니다.
     * [EN] Creates an OldBloom instance.
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new Threshold(redGPUContext),
                new GaussianBlur(redGPUContext),
                new OldBloomBlend(redGPUContext),
            ],
        );
        this.#effect_threshold = this.passList[0] as Threshold;
        this.#effect_gaussianBlur = this.passList[1] as GaussianBlur;
        this.#effect_oldBloomBlend = this.passList[2] as OldBloomBlend;

        // 초기값 동기화
        this.#effect_threshold.threshold = this.#threshold;
        this.#effect_gaussianBlur.size = this.#gaussianBlurSize;
        this.#effect_oldBloomBlend.exposure = this.#exposure;
        this.#effect_oldBloomBlend.bloomStrength = this.#bloomStrength;
    }

    /** [KO] 임계값 반환 [EN] Returns the threshold */
    get threshold(): number {
        return this.#threshold;
    }

    /** [KO] 임계값 설정 [EN] Sets the threshold */
    set threshold(value: number) {
        this.#threshold = value;
        this.#effect_threshold.threshold = value;
    }

    /** [KO] 가우시안 블러 크기 반환 [EN] Returns the Gaussian blur size */
    get gaussianBlurSize(): number {
        return this.#gaussianBlurSize;
    }

    /** [KO] 가우시안 블러 크기 설정 [EN] Sets the Gaussian blur size */
    set gaussianBlurSize(value: number) {
        this.#gaussianBlurSize = value;
        this.#effect_gaussianBlur.size = value;
    }

    /** [KO] 노출값 반환 [EN] Returns the exposure value */
    get exposure(): number {
        return this.#exposure;
    }

    /** [KO] 노출값 설정 [EN] Sets the exposure value */
    set exposure(value: number) {
        this.#exposure = value;
        this.#effect_oldBloomBlend.exposure = value;
    }

    /** [KO] 블룸 강도 반환 [EN] Returns the bloom strength */
    get bloomStrength(): number {
        return this.#bloomStrength;
    }

    /** [KO] 블룸 강도 설정 [EN] Sets the bloom strength */
    set bloomStrength(value: number) {
        this.#bloomStrength = value;
        this.#effect_oldBloomBlend.bloomStrength = value;
    }

    /**
     * [KO] 올드 블룸 효과를 단계별로 렌더링합니다.
     * [EN] Renders the old bloom effect step by step.
     *
     * [KO] 1단계: 밝은 영역 추출 (Threshold)
     * [KO] 2단계: 추출된 영역 블러 처리 (GaussianBlur)
     * [KO] 3단계: 원본과 블러된 이미지 합성 (OldBloomBlend)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult) {
        const pool = view.postEffectManager.texturePool;
        const thresholdResult = this.#effect_threshold.render(view, width, height, sourceTextureInfo);
        const blurResult = this.#effect_gaussianBlur.render(view, width, height, thresholdResult);
        // thresholdResult는 blur에서 사용된 후 더 이상 필요 없음
        pool.release(thresholdResult.texture);

        const blendResult = this.#effect_oldBloomBlend.render(view, width, height, sourceTextureInfo, blurResult);
        // blurResult는 blend에서 사용된 후 더 이상 필요 없음
        pool.release(blurResult.texture);

        return blendResult;
    }
}

Object.freeze(OldBloom);
export default OldBloom;

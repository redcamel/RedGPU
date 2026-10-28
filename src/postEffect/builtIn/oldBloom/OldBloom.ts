import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import OldBloomThreshold from "./oldBloomThreshold/OldBloomThreshold";
import GaussianBlur from "../../effects/blur/GaussianBlur";
import OldBloomBlend from "./oldBloomBlend/OldBloomBlend";

/**
 * [KO] 밝은 영역 추출(Threshold), 가우시안 블러(Gaussian Blur), 원본 합성을 통해 빛 번짐을 구현하는 올드 블룸(Old Bloom) 후처리 이펙트입니다.
 * [EN] Old Bloom post-processing effect that implements light bleeding by extracting bright areas (Threshold), applying Gaussian Blur, and blending with the original image.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * view.postEffectManager.useBloom = true;
 * const bloom = view.postEffectManager.bloom;
 * bloom.threshold = 180;
 * bloom.gaussianBlurSize = 48;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/oldBloom/" style="width:100%; height:500px;"></iframe>
 *
 * @see [OldBloom example](/RedGPU/examples/postEffect/oldBloom/)
 * @category Visual Effects
 */
class OldBloom extends AMultiPassPostEffect {
    #effect_threshold: OldBloomThreshold;
    #effect_gaussianBlur: GaussianBlur;
    #effect_oldBloomBlend: OldBloomBlend;
    #threshold: number = 156;
    #gaussianBlurSize: number = 32;
    #exposure: number = 1.0;
    #bloomStrength: number = 1.2;

    /**
     * [KO] OldBloom 인스턴스를 생성합니다.
     * [EN] Creates an OldBloom instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new OldBloomThreshold(redGPUContext),
                new GaussianBlur(redGPUContext, {isLdr: false}),
                new OldBloomBlend(redGPUContext),
            ],
        );
        this.#effect_threshold = this.passList[0] as OldBloomThreshold;
        this.#effect_gaussianBlur = this.passList[1] as GaussianBlur;
        this.#effect_oldBloomBlend = this.passList[2] as OldBloomBlend;

        this.#effect_threshold.threshold = this.#threshold;
        this.#effect_gaussianBlur.size = Math.max(1, this.#gaussianBlurSize * 0.5);
        this.#effect_oldBloomBlend.exposure = this.#exposure;
        this.#effect_oldBloomBlend.bloomStrength = this.#bloomStrength;
    }

    /**
     * [KO] 밝은 영역 추출 기준 임계값(1 ~ 255)을 반환하거나 설정합니다.
     * [EN] Returns or sets the threshold value (1 ~ 255) for extracting bright areas.
     *
     * @defaultValue 156
     * @returns
     * [KO] 밝기 임계값
     * [EN] Brightness threshold
     */
    get threshold(): number {
        return this.#threshold;
    }

    set threshold(value: number) {
        this.#threshold = value;
        this.#effect_threshold.threshold = value;
    }

    /**
     * [KO] 가우시안 블러 반경 크기(단위: 픽셀)를 반환하거나 설정합니다.
     * [EN] Returns or sets the Gaussian blur radius size (in pixels).
     *
     * @defaultValue 32
     * @returns
     * [KO] 블러 반경 크기
     * [EN] Blur radius size
     */
    get gaussianBlurSize(): number {
        return this.#gaussianBlurSize;
    }

    set gaussianBlurSize(value: number) {
        this.#gaussianBlurSize = value;
        this.#effect_gaussianBlur.size = Math.max(1, value * 0.5);
    }

    /**
     * [KO] 노출 보정값을 반환하거나 설정합니다.
     * [EN] Returns or sets the exposure compensation value.
     *
     * @defaultValue 1.0
     * @returns
     * [KO] 노출 보정값
     * [EN] Exposure compensation value
     */
    get exposure(): number {
        return this.#exposure;
    }

    set exposure(value: number) {
        this.#exposure = value;
        this.#effect_oldBloomBlend.exposure = value;
    }

    /**
     * [KO] 블룸 효과 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the bloom effect strength.
     *
     * @defaultValue 1.2
     * @returns
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    get bloomStrength(): number {
        return this.#bloomStrength;
    }

    set bloomStrength(value: number) {
        this.#bloomStrength = value;
        this.#effect_oldBloomBlend.bloomStrength = value;
    }

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
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult) {
        const pool = view.postEffectManager.texturePool;
        const downW = Math.max(1, (width * 0.5) | 0);
        const downH = Math.max(1, (height * 0.5) | 0);

        const thresholdResult = this.#effect_threshold.render(view, downW, downH, sourceTextureInfo);

        const blurResult = this.#effect_gaussianBlur.render(view, downW, downH, thresholdResult);
        pool.release(thresholdResult.texture);

        const blendResult = this.#effect_oldBloomBlend.render(view, width, height, sourceTextureInfo, blurResult);
        pool.release(blurResult.texture);

        return blendResult;
    }
}

Object.freeze(OldBloom);
export default OldBloom;

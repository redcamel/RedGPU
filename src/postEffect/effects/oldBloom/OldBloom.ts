import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {IPostEffectResult} from "../../core/types";
import OldBloomThreshold from "./oldBloomThreshold/OldBloomThreshold";
import GaussianBlur from "../blur/GaussianBlur";
import OldBloomBlend from "./oldBloomBlend/OldBloomBlend";

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
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new OldBloomThreshold(redGPUContext),
                new GaussianBlur(redGPUContext),
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
     * [KO] 블룸 임계값을 반환합니다.
     * [EN] Returns the bloom threshold.
     *
     * @returns
     * [KO] 최소 밝기 기준값
     * [EN] Minimum brightness threshold
     */
    get threshold(): number {
        return this.#threshold;
    }

    /**
     * [KO] 블룸 임계값을 설정합니다.
     * [EN] Sets the bloom threshold.
     *
     * @param value -
     * [KO] 최소 밝기 기준값
     * [EN] Minimum brightness threshold
     */
    set threshold(value: number) {
        this.#threshold = value;
        this.#effect_threshold.threshold = value;
    }

    /**
     * [KO] 가우시안 블러 크기를 반환합니다.
     * [EN] Returns the Gaussian blur size.
     *
     * @returns
     * [KO] 블러 반경 크기
     * [EN] Blur radius size
     */
    get gaussianBlurSize(): number {
        return this.#gaussianBlurSize;
    }

    /**
     * [KO] 가우시안 블러 크기를 설정합니다.
     * [EN] Sets the Gaussian blur size.
     *
     * @param value -
     * [KO] 블러 반경 크기
     * [EN] Blur radius size
     */
    set gaussianBlurSize(value: number) {
        this.#gaussianBlurSize = value;
        this.#effect_gaussianBlur.size = Math.max(1, value * 0.5);
    }

    /**
     * [KO] 노출 보정값을 반환합니다.
     * [EN] Returns the exposure compensation value.
     *
     * @returns
     * [KO] 노출 보정값
     * [EN] Exposure compensation value
     */
    get exposure(): number {
        return this.#exposure;
    }

    /**
     * [KO] 노출 보정값을 설정합니다.
     * [EN] Sets the exposure compensation value.
     *
     * @param value -
     * [KO] 노출 보정값
     * [EN] Exposure compensation value
     */
    set exposure(value: number) {
        this.#exposure = value;
        this.#effect_oldBloomBlend.exposure = value;
    }

    /**
     * [KO] 블룸 강도를 반환합니다.
     * [EN] Returns the bloom strength.
     *
     * @returns
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    get bloomStrength(): number {
        return this.#bloomStrength;
    }

    /**
     * [KO] 블룸 강도를 설정합니다.
     * [EN] Sets the bloom strength.
     *
     * @param value -
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    set bloomStrength(value: number) {
        this.#bloomStrength = value;
        this.#effect_oldBloomBlend.bloomStrength = value;
    }

    /**
     * [KO] 올드 블룸 효과를 렌더링합니다.
     * [EN] Renders the Old Bloom effect.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 최종 블룸 합성 결과
     * [EN] Final bloom compositing result
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

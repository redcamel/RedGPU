import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import Threshold from "../adjustments/threshold/Threshold";
import GaussianBlur from "../blur/GaussianBlur";
import OldBloomBlend from "./OldBloomBlend";

/**
 * [KO] 올드 블룸(Old Bloom) 후처리 이펙트입니다.
 * [EN] Old Bloom post-processing effect.
 *
 * [KO] 임계값, 가우시안 블러, 블렌드 단계를 거쳐 밝은 영역에 부드러운 빛 번짐 효과를 만듭니다.
 * [EN] Creates a soft glow effect on bright areas through threshold, Gaussian blur, and blend steps.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
 * effect.threshold = 180;        // 밝기 임계값
 * effect.gaussianBlurSize = 48;  // 블러 강도
 * effect.exposure = 1.2;         // 노출
 * effect.bloomStrength = 1.5;    // 블룸 강도
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class OldBloom extends AMultiPassPostEffect {
    /** 
     * [KO] 임계값 이펙트 
     * [EN] Threshold effect
     */
    #effect_threshold: Threshold
    /** 
     * [KO] 가우시안 블러 이펙트 
     * [EN] Gaussian blur effect
     */
    #effect_gaussianBlur: GaussianBlur
    /** 
     * [KO] 블렌드 이펙트 
     * [EN] Blend effect
     */
    #effect_oldBloomBlend: OldBloomBlend
    /** 
     * [KO] 밝기 임계값. 기본값 156 
     * [EN] Brightness threshold. Default 156
     */
    #threshold: number = 156
    /** 
     * [KO] 블러 강도. 기본값 32 
     * [EN] Blur size. Default 32
     */
    #gaussianBlurSize: number = 32
    /** 
     * [KO] 노출. 기본값 1 
     * [EN] Exposure. Default 1
     */
    #exposure: number = 1
    /** 
     * [KO] 블룸 강도. 기본값 1.2 
     * [EN] Bloom strength. Default 1.2
     */
    #bloomStrength: number = 1.2

    /**
     * [KO] OldBloom 인스턴스를 생성합니다.
     * [EN] Creates an OldBloom instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
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
        this.#effect_threshold = this.passList[0] as Threshold
        this.#effect_gaussianBlur = this.passList[1] as GaussianBlur
        this.#effect_oldBloomBlend = this.passList[2] as OldBloomBlend
        this.#effect_threshold.threshold = this.#threshold
        this.#effect_gaussianBlur.size = this.#gaussianBlurSize
        this.#effect_oldBloomBlend.exposure = this.#exposure
        this.#effect_oldBloomBlend.bloomStrength = this.#bloomStrength
    }

    /** 
     * [KO] 밝기 임계값
     * [EN] Brightness threshold
     */
    get threshold(): number {
        return this.#threshold;
    }

    /**
     * [KO] 밝기 임계값을 설정합니다.
     * [EN] Sets the brightness threshold.
     */
    set threshold(value: number) {
        this.#threshold = value;
        this.#effect_threshold.threshold = value
    }

    /** 
     * [KO] 블러 강도
     * [EN] Blur size
     */
    get gaussianBlurSize(): number {
        return this.#gaussianBlurSize;
    }

    /**
     * [KO] 블러 강도를 설정합니다.
     * [EN] Sets the blur size.
     */
    set gaussianBlurSize(value: number) {
        this.#gaussianBlurSize = value;
        this.#effect_gaussianBlur.size = value
    }

    /** 
     * [KO] 노출
     * [EN] Exposure
     */
    get exposure(): number {
        return this.#exposure;
    }

    /**
     * [KO] 노출을 설정합니다.
     * [EN] Sets the exposure.
     */
    set exposure(value: number) {
        this.#exposure = value;
        this.#effect_oldBloomBlend.exposure = value
    }

    /** 
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    get bloomStrength(): number {
        return this.#bloomStrength;
    }

    /**
     * [KO] 블룸 강도를 설정합니다.
     * [EN] Sets the bloom strength.
     */
    set bloomStrength(value: number) {
        this.#bloomStrength = value;
        this.#effect_oldBloomBlend.bloomStrength = value
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
        const thresholdResult = this.#effect_threshold.render(
            view, width, height, sourceTextureInfo
        )
        const blurResult = this.#effect_gaussianBlur.render(
            view, width, height, thresholdResult
        )
        return this.#effect_oldBloomBlend.render(
            view, width, height, sourceTextureInfo, blurResult
        )
    }
}

Object.freeze(OldBloom)
export default OldBloom
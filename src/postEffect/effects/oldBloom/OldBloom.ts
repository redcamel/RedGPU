import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import Threshold from "../adjustments/threshold/Threshold";
import GaussianBlur from "../blur/GaussianBlur";
import OldBloomBlend from "./oldBloomBlend/OldBloomBlend";

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
class OldBloom extends AMultiPassPostEffect {
    #effect_threshold: Threshold;
    #effect_gaussianBlur: GaussianBlur;
    #effect_oldBloomBlend: OldBloomBlend;

    #threshold: number = 156;
    #gaussianBlurSize: number = 32;
    #exposure: number = 1.0;
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

    get threshold(): number { return this.#threshold; }
    set threshold(value: number) {
        this.#threshold = value;
        this.#effect_threshold.threshold = value;
    }

    get gaussianBlurSize(): number { return this.#gaussianBlurSize; }
    set gaussianBlurSize(value: number) {
        this.#gaussianBlurSize = value;
        this.#effect_gaussianBlur.size = value;
    }

    get exposure(): number { return this.#exposure; }
    set exposure(value: number) {
        this.#exposure = value;
        this.#effect_oldBloomBlend.exposure = value;
    }

    get bloomStrength(): number { return this.#bloomStrength; }
    set bloomStrength(value: number) {
        this.#bloomStrength = value;
        this.#effect_oldBloomBlend.bloomStrength = value;
    }

    /**
     * [KO] 올드 블룸 효과를 렌더링합니다. (Threshold -> GaussianBlur -> Blend)
     * [EN] Renders the old bloom effect. (Threshold -> GaussianBlur -> Blend)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
        const thresholdResult = this.#effect_threshold.render(view, width, height, sourceTextureInfo);
        const blurResult = this.#effect_gaussianBlur.render(view, width, height, thresholdResult);
        return this.#effect_oldBloomBlend.render(view, width, height, sourceTextureInfo, blurResult);
    }
}

Object.freeze(OldBloom);
export default OldBloom;

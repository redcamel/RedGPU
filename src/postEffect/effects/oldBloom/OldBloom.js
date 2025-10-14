import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import Threshold from "../adjustments/threshold/Threshold";
import GaussianBlur from "../blur/GaussianBlur";
import OldBloomBlend from "./OldBloomBlend";
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
 * <iframe src="/RedGPU/examples/3d/postEffect/oldBloom/"></iframe>
 */
class OldBloom extends AMultiPassPostEffect {
    /** 임계값 이펙트 */
    #effect_threshold;
    /** 가우시안 블러 이펙트 */
    #effect_gaussianBlur;
    /** 블렌드 이펙트 */
    #effect_oldBloomBlend;
    /** 밝기 임계값. 기본값 156 */
    #threshold = 156;
    /** 블러 강도. 기본값 32 */
    #gaussianBlurSize = 32;
    /** 노출. 기본값 1 */
    #exposure = 1;
    /** 블룸 강도. 기본값 1.2 */
    #bloomStrength = 1.2;
    constructor(redGPUContext) {
        super(redGPUContext, [
            new Threshold(redGPUContext),
            new GaussianBlur(redGPUContext),
            new OldBloomBlend(redGPUContext),
        ]);
        this.#effect_threshold = this.passList[0];
        this.#effect_gaussianBlur = this.passList[1];
        this.#effect_oldBloomBlend = this.passList[2];
        this.#effect_threshold.threshold = this.#threshold;
        this.#effect_gaussianBlur.size = this.#gaussianBlurSize;
        this.#effect_oldBloomBlend.exposure = this.#exposure;
        this.#effect_oldBloomBlend.bloomStrength = this.#bloomStrength;
    }
    /** 밝기 임계값 반환 */
    get threshold() {
        return this.#threshold;
    }
    /** 밝기 임계값 설정 */
    set threshold(value) {
        this.#threshold = value;
        this.#effect_threshold.threshold = value;
    }
    /** 블러 강도 반환 */
    get gaussianBlurSize() {
        return this.#gaussianBlurSize;
    }
    /** 블러 강도 설정 */
    set gaussianBlurSize(value) {
        this.#gaussianBlurSize = value;
        this.#effect_gaussianBlur.size = value;
    }
    /** 노출 반환 */
    get exposure() {
        return this.#exposure;
    }
    /** 노출 설정 */
    set exposure(value) {
        this.#exposure = value;
        this.#effect_oldBloomBlend.exposure = value;
    }
    /** 블룸 강도 반환 */
    get bloomStrength() {
        return this.#bloomStrength;
    }
    /** 블룸 강도 설정 */
    set bloomStrength(value) {
        this.#bloomStrength = value;
        this.#effect_oldBloomBlend.bloomStrength = value;
    }
    render(view, width, height, sourceTextureInfo) {
        const thresholdResult = this.#effect_threshold.render(view, width, height, sourceTextureInfo);
        const blurResult = this.#effect_gaussianBlur.render(view, width, height, thresholdResult);
        return this.#effect_oldBloomBlend.render(view, width, height, sourceTextureInfo, blurResult);
    }
}
Object.freeze(OldBloom);
export default OldBloom;

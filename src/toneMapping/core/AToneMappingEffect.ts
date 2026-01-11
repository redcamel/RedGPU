import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";

class AToneMappingEffect extends ASinglePassPostEffect {


    /** 노출값. 0.1~5.0, 기본값 1.0 */
    #exposure: number = 1.0;
    /** 명암 강도. 0.5~2.0, 기본값 1.0 */
    #contrast: number = 1.0;
    /** 밝기 조절. -1.0~1.0, 기본값 0.0 */
    #brightness: number = 0.0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

    }

    get exposure(): number {
        return this.#exposure;
    }

    set exposure(value: number) {
        this.#exposure = Math.max(0.1, Math.min(5.0, value));
        this.updateUniform('exposure', this.#exposure);
    }

    get contrast(): number {
        return this.#contrast;
    }

    set contrast(value: number) {
        this.#contrast = Math.max(0.5, Math.min(2.0, value));
        this.updateUniform('contrast', this.#contrast);
    }


    get brightness(): number {
        return this.#brightness;
    }

    set brightness(value: number) {
        this.#brightness = Math.max(-1.0, Math.min(1.0, value));
        this.updateUniform('brightness', this.#brightness);
    }


    /**
     * 내부 유니폼 일괄 갱신
     * @private
     */
    updateUniforms(): void {
        this.updateUniform('exposure', this.#exposure);
        this.updateUniform('contrast', this.#contrast);
        this.updateUniform('brightness', this.#brightness);
    }
}

Object.freeze(AToneMappingEffect);
export default AToneMappingEffect;
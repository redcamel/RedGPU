import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";

/**
 * [KO] 모든 톤 매핑 이펙트의 기본 추상 클래스입니다.
 * [EN] Base abstract class for all tone mapping effects.
 * @category ToneMapping
 */
class AToneMappingEffect extends ASinglePassPostEffect {
    /** [KO] 노출값. 0.1~5.0, 기본값 1.0 [EN] Exposure value. 0.1 to 5.0, default 1.0 */
    #exposure: number = 1.0;
    /** [KO] 명암 강도. 0.5~2.0, 기본값 1.0 [EN] Contrast strength. 0.5 to 2.0, default 1.0 */
    #contrast: number = 1.0;
    /** [KO] 밝기 조절. -1.0~1.0, 기본값 0.0 [EN] Brightness adjustment. -1.0 to 1.0, default 0.0 */
    #brightness: number = 0.0;

    /**
     * [KO] AToneMappingEffect 인스턴스를 생성합니다.
     * [EN] Creates an AToneMappingEffect instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    protected constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /** [KO] 노출값을 반환합니다. [EN] Returns the exposure value. */
    get exposure(): number {
        return this.#exposure;
    }

    /** [KO] 노출값을 설정합니다. [EN] Sets the exposure value. */
    set exposure(value: number) {
        this.#exposure = Math.max(0.1, Math.min(5.0, value));
        this.updateUniform('exposure', this.#exposure);
    }

    /** [KO] 명암 강도를 반환합니다. [EN] Returns the contrast strength. */
    get contrast(): number {
        return this.#contrast;
    }

    /** [KO] 명암 강도를 설정합니다. [EN] Sets the contrast strength. */
    set contrast(value: number) {
        this.#contrast = Math.max(0.5, Math.min(2.0, value));
        this.updateUniform('contrast', this.#contrast);
    }

    /** [KO] 밝기 조절 값을 반환합니다. [EN] Returns the brightness adjustment value. */
    get brightness(): number {
        return this.#brightness;
    }

    /** [KO] 밝기 조절 값을 설정합니다. [EN] Sets the brightness adjustment value. */
    set brightness(value: number) {
        this.#brightness = Math.max(-1.0, Math.min(1.0, value));
        this.updateUniform('brightness', this.#brightness);
    }

    /**
     * [KO] 내부 유니폼을 일괄 갱신합니다.
     * [EN] Updates all internal uniforms at once.
     */
    updateUniforms(): void {
        this.updateUniform('exposure', this.#exposure);
        this.updateUniform('contrast', this.#contrast);
        this.updateUniform('brightness', this.#brightness);
    }
}

Object.freeze(AToneMappingEffect);
export default AToneMappingEffect;

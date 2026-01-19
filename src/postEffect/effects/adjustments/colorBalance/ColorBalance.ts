import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 컬러 밸런스(Color Balance) 후처리 이펙트입니다.
 * [EN] Color Balance post-processing effect.
 *
 * [KO] 그림자의 시안-레드, 마젠타-그린, 옐로우-블루, 미드톤, 하이라이트 색상 밸런스를 조절합니다.
 * [EN] Adjusts the color balance of shadows, midtones, and highlights for Cyan-Red, Magenta-Green, and Yellow-Blue.
 *
 * [KO] 밝기 보존 옵션도 지원합니다.
 * [EN] Also supports luminosity preservation option.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
 * effect.shadowCyanRed = 50;
 * effect.midtoneYellowBlue = -30;
 * effect.preserveLuminosity = true;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorBalance/"></iframe>
 * @category Adjustments
 */
class ColorBalance extends ASinglePassPostEffect {
    /**
     * [KO] 그림자 시안-레드 (-100 ~ 100)
     * [EN] Shadow Cyan-Red (-100 ~ 100)
     * @defaultValue 0
     */
    #shadowCyanRed: number = 0
    /**
     * [KO] 그림자 마젠타-그린 (-100 ~ 100)
     * [EN] Shadow Magenta-Green (-100 ~ 100)
     * @defaultValue 0
     */
    #shadowMagentaGreen: number = 0
    /**
     * [KO] 그림자 옐로우-블루 (-100 ~ 100)
     * [EN] Shadow Yellow-Blue (-100 ~ 100)
     * @defaultValue 0
     */
    #shadowYellowBlue: number = 0
    /**
     * [KO] 미드톤 시안-레드 (-100 ~ 100)
     * [EN] Midtone Cyan-Red (-100 ~ 100)
     * @defaultValue 0
     */
    #midtoneCyanRed: number = 0
    /**
     * [KO] 미드톤 마젠타-그린 (-100 ~ 100)
     * [EN] Midtone Magenta-Green (-100 ~ 100)
     * @defaultValue 0
     */
    #midtoneMagentaGreen: number = 0
    /**
     * [KO] 미드톤 옐로우-블루 (-100 ~ 100)
     * [EN] Midtone Yellow-Blue (-100 ~ 100)
     * @defaultValue 0
     */
    #midtoneYellowBlue: number = 0
    /**
     * [KO] 하이라이트 시안-레드 (-100 ~ 100)
     * [EN] Highlight Cyan-Red (-100 ~ 100)
     * @defaultValue 0
     */
    #highlightCyanRed: number = 0
    /**
     * [KO] 하이라이트 마젠타-그린 (-100 ~ 100)
     * [EN] Highlight Magenta-Green (-100 ~ 100)
     * @defaultValue 0
     */
    #highlightMagentaGreen: number = 0
    /**
     * [KO] 하이라이트 옐로우-블루 (-100 ~ 100)
     * [EN] Highlight Yellow-Blue (-100 ~ 100)
     * @defaultValue 0
     */
    #highlightYellowBlue: number = 0
    /**
     * [KO] 밝기 보존 여부
     * [EN] Preserve luminosity
     * @defaultValue true
     */
    #preserveLuminosity: boolean = true

    /**
     * [KO] ColorBalance 인스턴스를 생성합니다.
     * [EN] Creates a ColorBalance instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_COLOR_BALANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
    }

    /**
     * [KO] 그림자 시안-레드 값을 반환합니다.
     * [EN] Returns the shadow Cyan-Red value.
     */
    get shadowCyanRed(): number {
        return this.#shadowCyanRed;
    }

    /**
     * [KO] 그림자 시안-레드 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the shadow Cyan-Red value. (-100 ~ 100)
     */
    set shadowCyanRed(value: number) {
        validateNumberRange(value, -100, 100)
        this.#shadowCyanRed = value;
        this.updateUniform('shadowCyanRed', value)
    }

    /**
     * [KO] 그림자 마젠타-그린 값을 반환합니다.
     * [EN] Returns the shadow Magenta-Green value.
     */
    get shadowMagentaGreen(): number {
        return this.#shadowMagentaGreen;
    }

    /**
     * [KO] 그림자 마젠타-그린 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the shadow Magenta-Green value. (-100 ~ 100)
     */
    set shadowMagentaGreen(value: number) {
        validateNumberRange(value, -100, 100)
        this.#shadowMagentaGreen = value;
        this.updateUniform('shadowMagentaGreen', value)
    }

    /**
     * [KO] 그림자 옐로우-블루 값을 반환합니다.
     * [EN] Returns the shadow Yellow-Blue value.
     */
    get shadowYellowBlue(): number {
        return this.#shadowYellowBlue;
    }

    /**
     * [KO] 그림자 옐로우-블루 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the shadow Yellow-Blue value. (-100 ~ 100)
     */
    set shadowYellowBlue(value: number) {
        validateNumberRange(value, -100, 100)
        this.#shadowYellowBlue = value;
        this.updateUniform('shadowYellowBlue', value)
    }

    /**
     * [KO] 미드톤 시안-레드 값을 반환합니다.
     * [EN] Returns the midtone Cyan-Red value.
     */
    get midtoneCyanRed(): number {
        return this.#midtoneCyanRed;
    }

    /**
     * [KO] 미드톤 시안-레드 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the midtone Cyan-Red value. (-100 ~ 100)
     */
    set midtoneCyanRed(value: number) {
        validateNumberRange(value, -100, 100)
        this.#midtoneCyanRed = value;
        this.updateUniform('midtoneCyanRed', value)
    }

    /**
     * [KO] 미드톤 마젠타-그린 값을 반환합니다.
     * [EN] Returns the midtone Magenta-Green value.
     */
    get midtoneMagentaGreen(): number {
        return this.#midtoneMagentaGreen;
    }

    /**
     * [KO] 미드톤 마젠타-그린 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the midtone Magenta-Green value. (-100 ~ 100)
     */
    set midtoneMagentaGreen(value: number) {
        validateNumberRange(value, -100, 100)
        this.#midtoneMagentaGreen = value;
        this.updateUniform('midtoneMagentaGreen', value)
    }

    /**
     * [KO] 미드톤 옐로우-블루 값을 반환합니다.
     * [EN] Returns the midtone Yellow-Blue value.
     */
    get midtoneYellowBlue(): number {
        return this.#midtoneYellowBlue;
    }

    /**
     * [KO] 미드톤 옐로우-블루 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the midtone Yellow-Blue value. (-100 ~ 100)
     */
    set midtoneYellowBlue(value: number) {
        validateNumberRange(value, -100, 100)
        this.#midtoneYellowBlue = value;
        this.updateUniform('midtoneYellowBlue', value)
    }

    /**
     * [KO] 하이라이트 시안-레드 값을 반환합니다.
     * [EN] Returns the highlight Cyan-Red value.
     */
    get highlightCyanRed(): number {
        return this.#highlightCyanRed;
    }

    /**
     * [KO] 하이라이트 시안-레드 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the highlight Cyan-Red value. (-100 ~ 100)
     */
    set highlightCyanRed(value: number) {
        validateNumberRange(value, -100, 100)
        this.#highlightCyanRed = value;
        this.updateUniform('highlightCyanRed', value)
    }

    /**
     * [KO] 하이라이트 마젠타-그린 값을 반환합니다.
     * [EN] Returns the highlight Magenta-Green value.
     */
    get highlightMagentaGreen(): number {
        return this.#highlightMagentaGreen;
    }

    /**
     * [KO] 하이라이트 마젠타-그린 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the highlight Magenta-Green value. (-100 ~ 100)
     */
    set highlightMagentaGreen(value: number) {
        validateNumberRange(value, -100, 100)
        this.#highlightMagentaGreen = value;
        this.updateUniform('highlightMagentaGreen', value)
    }

    /**
     * [KO] 하이라이트 옐로우-블루 값을 반환합니다.
     * [EN] Returns the highlight Yellow-Blue value.
     */
    get highlightYellowBlue(): number {
        return this.#highlightYellowBlue;
    }

    /**
     * [KO] 하이라이트 옐로우-블루 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the highlight Yellow-Blue value. (-100 ~ 100)
     */
    set highlightYellowBlue(value: number) {
        validateNumberRange(value, -100, 100)
        this.#highlightYellowBlue = value;
        this.updateUniform('highlightYellowBlue', value)
    }

    /**
     * [KO] 밝기 보존 여부를 반환합니다.
     * [EN] Returns whether luminosity is preserved.
     */
    get preserveLuminosity(): boolean {
        return this.#preserveLuminosity;
    }

    /**
     * [KO] 밝기 보존 여부를 설정합니다.
     * [EN] Sets whether luminosity is preserved.
     */
    set preserveLuminosity(value: boolean) {
        this.#preserveLuminosity = value;
        this.updateUniform('preserveLuminosity', value)
    }
}

Object.freeze(ColorBalance)
export default ColorBalance

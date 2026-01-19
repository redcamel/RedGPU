import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
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
declare class ColorBalance extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] ColorBalance 인스턴스를 생성합니다.
     * [EN] Creates a ColorBalance instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 그림자 시안-레드 값을 반환합니다.
     * [EN] Returns the shadow Cyan-Red value.
     */
    get shadowCyanRed(): number;
    /**
     * [KO] 그림자 시안-레드 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the shadow Cyan-Red value. (-100 ~ 100)
     */
    set shadowCyanRed(value: number);
    /**
     * [KO] 그림자 마젠타-그린 값을 반환합니다.
     * [EN] Returns the shadow Magenta-Green value.
     */
    get shadowMagentaGreen(): number;
    /**
     * [KO] 그림자 마젠타-그린 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the shadow Magenta-Green value. (-100 ~ 100)
     */
    set shadowMagentaGreen(value: number);
    /**
     * [KO] 그림자 옐로우-블루 값을 반환합니다.
     * [EN] Returns the shadow Yellow-Blue value.
     */
    get shadowYellowBlue(): number;
    /**
     * [KO] 그림자 옐로우-블루 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the shadow Yellow-Blue value. (-100 ~ 100)
     */
    set shadowYellowBlue(value: number);
    /**
     * [KO] 미드톤 시안-레드 값을 반환합니다.
     * [EN] Returns the midtone Cyan-Red value.
     */
    get midtoneCyanRed(): number;
    /**
     * [KO] 미드톤 시안-레드 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the midtone Cyan-Red value. (-100 ~ 100)
     */
    set midtoneCyanRed(value: number);
    /**
     * [KO] 미드톤 마젠타-그린 값을 반환합니다.
     * [EN] Returns the midtone Magenta-Green value.
     */
    get midtoneMagentaGreen(): number;
    /**
     * [KO] 미드톤 마젠타-그린 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the midtone Magenta-Green value. (-100 ~ 100)
     */
    set midtoneMagentaGreen(value: number);
    /**
     * [KO] 미드톤 옐로우-블루 값을 반환합니다.
     * [EN] Returns the midtone Yellow-Blue value.
     */
    get midtoneYellowBlue(): number;
    /**
     * [KO] 미드톤 옐로우-블루 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the midtone Yellow-Blue value. (-100 ~ 100)
     */
    set midtoneYellowBlue(value: number);
    /**
     * [KO] 하이라이트 시안-레드 값을 반환합니다.
     * [EN] Returns the highlight Cyan-Red value.
     */
    get highlightCyanRed(): number;
    /**
     * [KO] 하이라이트 시안-레드 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the highlight Cyan-Red value. (-100 ~ 100)
     */
    set highlightCyanRed(value: number);
    /**
     * [KO] 하이라이트 마젠타-그린 값을 반환합니다.
     * [EN] Returns the highlight Magenta-Green value.
     */
    get highlightMagentaGreen(): number;
    /**
     * [KO] 하이라이트 마젠타-그린 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the highlight Magenta-Green value. (-100 ~ 100)
     */
    set highlightMagentaGreen(value: number);
    /**
     * [KO] 하이라이트 옐로우-블루 값을 반환합니다.
     * [EN] Returns the highlight Yellow-Blue value.
     */
    get highlightYellowBlue(): number;
    /**
     * [KO] 하이라이트 옐로우-블루 값을 설정합니다. (-100 ~ 100)
     * [EN] Sets the highlight Yellow-Blue value. (-100 ~ 100)
     */
    set highlightYellowBlue(value: number);
    /**
     * [KO] 밝기 보존 여부를 반환합니다.
     * [EN] Returns whether luminosity is preserved.
     */
    get preserveLuminosity(): boolean;
    /**
     * [KO] 밝기 보존 여부를 설정합니다.
     * [EN] Sets whether luminosity is preserved.
     */
    set preserveLuminosity(value: boolean);
}
export default ColorBalance;

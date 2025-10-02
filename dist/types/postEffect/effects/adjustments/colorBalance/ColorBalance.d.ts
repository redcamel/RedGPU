import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 컬러 밸런스(Color Balance) 후처리 이펙트입니다.
 *
 * 그림자의 시안-레드, 마젠타-그린, 옐로우-블루, 미드톤, 하이라이트 색상 밸런스를 조절합니다.
 *
 * 밝기 보존 옵션도 지원합니다.
 *
 * @category Adjustments
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
 * effect.shadowCyanRed = 50;
 * effect.midtoneYellowBlue = -30;
 * effect.preserveLuminosity = true;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/adjustments/colorBalance/"></iframe>
 */
declare class ColorBalance extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 그림자 시안-레드 반환 */
    get shadowCyanRed(): number;
    /** 그림자 시안-레드 설정. 범위 -100~100 */
    set shadowCyanRed(value: number);
    /** 그림자 마젠타-그린 반환 */
    get shadowMagentaGreen(): number;
    /** 그림자 마젠타-그린 설정. 범위 -100~100 */
    set shadowMagentaGreen(value: number);
    /** 그림자 옐로우-블루 반환 */
    get shadowYellowBlue(): number;
    /** 그림자 옐로우-블루 설정. 범위 -100~100 */
    set shadowYellowBlue(value: number);
    /** 미드톤 시안-레드 반환 */
    get midtoneCyanRed(): number;
    /** 미드톤 시안-레드 설정. 범위 -100~100 */
    set midtoneCyanRed(value: number);
    /** 미드톤 마젠타-그린 반환 */
    get midtoneMagentaGreen(): number;
    /** 미드톤 마젠타-그린 설정. 범위 -100~100 */
    set midtoneMagentaGreen(value: number);
    /** 미드톤 옐로우-블루 반환 */
    get midtoneYellowBlue(): number;
    /** 미드톤 옐로우-블루 설정. 범위 -100~100 */
    set midtoneYellowBlue(value: number);
    /** 하이라이트 시안-레드 반환 */
    get highlightCyanRed(): number;
    /** 하이라이트 시안-레드 설정. 범위 -100~100 */
    set highlightCyanRed(value: number);
    /** 하이라이트 마젠타-그린 반환 */
    get highlightMagentaGreen(): number;
    /** 하이라이트 마젠타-그린 설정. 범위 -100~100 */
    set highlightMagentaGreen(value: number);
    /** 하이라이트 옐로우-블루 반환 */
    get highlightYellowBlue(): number;
    /** 하이라이트 옐로우-블루 설정. 범위 -100~100 */
    set highlightYellowBlue(value: number);
    /** 밝기 보존 반환 */
    get preserveLuminosity(): boolean;
    /** 밝기 보존 설정 */
    set preserveLuminosity(value: boolean);
}
export default ColorBalance;

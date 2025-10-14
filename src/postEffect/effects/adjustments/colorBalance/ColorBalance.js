import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
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
class ColorBalance extends ASinglePassPostEffect {
    /** 그림자 시안-레드. 기본값 0, 범위 -100~100 */
    #shadowCyanRed = 0;
    /** 그림자 마젠타-그린. 기본값 0, 범위 -100~100 */
    #shadowMagentaGreen = 0;
    /** 그림자 옐로우-블루. 기본값 0, 범위 -100~100 */
    #shadowYellowBlue = 0;
    /** 미드톤 시안-레드. 기본값 0, 범위 -100~100 */
    #midtoneCyanRed = 0;
    /** 미드톤 마젠타-그린. 기본값 0, 범위 -100~100 */
    #midtoneMagentaGreen = 0;
    /** 미드톤 옐로우-블루. 기본값 0, 범위 -100~100 */
    #midtoneYellowBlue = 0;
    /** 하이라이트 시안-레드. 기본값 0, 범위 -100~100 */
    #highlightCyanRed = 0;
    /** 하이라이트 마젠타-그린. 기본값 0, 범위 -100~100 */
    #highlightMagentaGreen = 0;
    /** 하이라이트 옐로우-블루. 기본값 0, 범위 -100~100 */
    #highlightYellowBlue = 0;
    /** 밝기 보존. 기본값 true */
    #preserveLuminosity = true;
    constructor(redGPUContext) {
        super(redGPUContext);
        this.init(redGPUContext, 'POST_EFFECT_COLOR_BALANCE', createBasicPostEffectCode(this, computeCode, uniformStructCode));
    }
    /** 그림자 시안-레드 반환 */
    get shadowCyanRed() {
        return this.#shadowCyanRed;
    }
    /** 그림자 시안-레드 설정. 범위 -100~100 */
    set shadowCyanRed(value) {
        validateNumberRange(value, -100, 100);
        this.#shadowCyanRed = value;
        this.updateUniform('shadowCyanRed', value);
    }
    /** 그림자 마젠타-그린 반환 */
    get shadowMagentaGreen() {
        return this.#shadowMagentaGreen;
    }
    /** 그림자 마젠타-그린 설정. 범위 -100~100 */
    set shadowMagentaGreen(value) {
        validateNumberRange(value, -100, 100);
        this.#shadowMagentaGreen = value;
        this.updateUniform('shadowMagentaGreen', value);
    }
    /** 그림자 옐로우-블루 반환 */
    get shadowYellowBlue() {
        return this.#shadowYellowBlue;
    }
    /** 그림자 옐로우-블루 설정. 범위 -100~100 */
    set shadowYellowBlue(value) {
        validateNumberRange(value, -100, 100);
        this.#shadowYellowBlue = value;
        this.updateUniform('shadowYellowBlue', value);
    }
    /** 미드톤 시안-레드 반환 */
    get midtoneCyanRed() {
        return this.#midtoneCyanRed;
    }
    /** 미드톤 시안-레드 설정. 범위 -100~100 */
    set midtoneCyanRed(value) {
        validateNumberRange(value, -100, 100);
        this.#midtoneCyanRed = value;
        this.updateUniform('midtoneCyanRed', value);
    }
    /** 미드톤 마젠타-그린 반환 */
    get midtoneMagentaGreen() {
        return this.#midtoneMagentaGreen;
    }
    /** 미드톤 마젠타-그린 설정. 범위 -100~100 */
    set midtoneMagentaGreen(value) {
        validateNumberRange(value, -100, 100);
        this.#midtoneMagentaGreen = value;
        this.updateUniform('midtoneMagentaGreen', value);
    }
    /** 미드톤 옐로우-블루 반환 */
    get midtoneYellowBlue() {
        return this.#midtoneYellowBlue;
    }
    /** 미드톤 옐로우-블루 설정. 범위 -100~100 */
    set midtoneYellowBlue(value) {
        validateNumberRange(value, -100, 100);
        this.#midtoneYellowBlue = value;
        this.updateUniform('midtoneYellowBlue', value);
    }
    /** 하이라이트 시안-레드 반환 */
    get highlightCyanRed() {
        return this.#highlightCyanRed;
    }
    /** 하이라이트 시안-레드 설정. 범위 -100~100 */
    set highlightCyanRed(value) {
        validateNumberRange(value, -100, 100);
        this.#highlightCyanRed = value;
        this.updateUniform('highlightCyanRed', value);
    }
    /** 하이라이트 마젠타-그린 반환 */
    get highlightMagentaGreen() {
        return this.#highlightMagentaGreen;
    }
    /** 하이라이트 마젠타-그린 설정. 범위 -100~100 */
    set highlightMagentaGreen(value) {
        validateNumberRange(value, -100, 100);
        this.#highlightMagentaGreen = value;
        this.updateUniform('highlightMagentaGreen', value);
    }
    /** 하이라이트 옐로우-블루 반환 */
    get highlightYellowBlue() {
        return this.#highlightYellowBlue;
    }
    /** 하이라이트 옐로우-블루 설정. 범위 -100~100 */
    set highlightYellowBlue(value) {
        validateNumberRange(value, -100, 100);
        this.#highlightYellowBlue = value;
        this.updateUniform('highlightYellowBlue', value);
    }
    /** 밝기 보존 반환 */
    get preserveLuminosity() {
        return this.#preserveLuminosity;
    }
    /** 밝기 보존 설정 */
    set preserveLuminosity(value) {
        this.#preserveLuminosity = value;
        this.updateUniform('preserveLuminosity', value);
    }
}
Object.freeze(ColorBalance);
export default ColorBalance;

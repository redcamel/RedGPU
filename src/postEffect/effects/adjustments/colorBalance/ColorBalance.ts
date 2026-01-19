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
 * [KO] 그림자, 미드톤, 하이라이트의 색상 밸런스(Cyan-Red, Magenta-Green, Yellow-Blue)를 조절합니다.
 * [EN] Adjusts color balance (Cyan-Red, Magenta-Green, Yellow-Blue) for shadows, midtones, and highlights.
 * 
 * [KO] 밝기 보존 옵션도 지원합니다.
 * [EN] Also supports luminosity preservation option.
 *
 * @category PostEffect
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
 * effect.shadowCyanRed = 50;
 * effect.midtoneYellowBlue = -30;
 * effect.preserveLuminosity = true;
 * view.postEffectManager.addEffect(effect);
 * ```
 */
class ColorBalance extends ASinglePassPostEffect {
    /** 
     * [KO] 그림자 시안-레드. 기본값 0
     * [EN] Shadow Cyan-Red. Default 0
     */
    #shadowCyanRed: number = 0
    /** 
     * [KO] 그림자 마젠타-그린. 기본값 0
     * [EN] Shadow Magenta-Green. Default 0
     */
    #shadowMagentaGreen: number = 0
    /** 
     * [KO] 그림자 옐로우-블루. 기본값 0
     * [EN] Shadow Yellow-Blue. Default 0
     */
    #shadowYellowBlue: number = 0
    /** 
     * [KO] 미드톤 시안-레드. 기본값 0
     * [EN] Midtone Cyan-Red. Default 0
     */
    #midtoneCyanRed: number = 0
    /** 
     * [KO] 미드톤 마젠타-그린. 기본값 0
     * [EN] Midtone Magenta-Green. Default 0
     */
    #midtoneMagentaGreen: number = 0
    /** 
     * [KO] 미드톤 옐로우-블루. 기본값 0
     * [EN] Midtone Yellow-Blue. Default 0
     */
    #midtoneYellowBlue: number = 0
    /** 
     * [KO] 하이라이트 시안-레드. 기본값 0
     * [EN] Highlight Cyan-Red. Default 0
     */
    #highlightCyanRed: number = 0
    /** 
     * [KO] 하이라이트 마젠타-그린. 기본값 0
     * [EN] Highlight Magenta-Green. Default 0
     */
    #highlightMagentaGreen: number = 0
    /** 
     * [KO] 하이라이트 옐로우-블루. 기본값 0
     * [EN] Highlight Yellow-Blue. Default 0
     */
    #highlightYellowBlue: number = 0
    /** 
     * [KO] 밝기 보존 여부. 기본값 true
     * [EN] Whether to preserve luminosity. Default true
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
     * [KO] 그림자 시안-레드
     * [EN] Shadow Cyan-Red
     */
    get shadowCyanRed(): number {
        return this.#shadowCyanRed;
    }

    /**
     * [KO] 그림자 시안-레드 설정
     * [EN] Sets Shadow Cyan-Red.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set shadowCyanRed(value: number) {
        validateNumberRange(value, -100, 100)
        this.#shadowCyanRed = value;
        this.updateUniform('shadowCyanRed', value)
    }

    /** 
     * [KO] 그림자 마젠타-그린
     * [EN] Shadow Magenta-Green
     */
    get shadowMagentaGreen(): number {
        return this.#shadowMagentaGreen;
    }

    /**
     * [KO] 그림자 마젠타-그린 설정
     * [EN] Sets Shadow Magenta-Green.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set shadowMagentaGreen(value: number) {
        validateNumberRange(value, -100, 100)
        this.#shadowMagentaGreen = value;
        this.updateUniform('shadowMagentaGreen', value)
    }

    /** 
     * [KO] 그림자 옐로우-블루
     * [EN] Shadow Yellow-Blue
     */
    get shadowYellowBlue(): number {
        return this.#shadowYellowBlue;
    }

    /**
     * [KO] 그림자 옐로우-블루 설정
     * [EN] Sets Shadow Yellow-Blue.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set shadowYellowBlue(value: number) {
        validateNumberRange(value, -100, 100)
        this.#shadowYellowBlue = value;
        this.updateUniform('shadowYellowBlue', value)
    }

    /** 
     * [KO] 미드톤 시안-레드
     * [EN] Midtone Cyan-Red
     */
    get midtoneCyanRed(): number {
        return this.#midtoneCyanRed;
    }

    /**
     * [KO] 미드톤 시안-레드 설정
     * [EN] Sets Midtone Cyan-Red.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set midtoneCyanRed(value: number) {
        validateNumberRange(value, -100, 100)
        this.#midtoneCyanRed = value;
        this.updateUniform('midtoneCyanRed', value)
    }

    /** 
     * [KO] 미드톤 마젠타-그린
     * [EN] Midtone Magenta-Green
     */
    get midtoneMagentaGreen(): number {
        return this.#midtoneMagentaGreen;
    }

    /**
     * [KO] 미드톤 마젠타-그린 설정
     * [EN] Sets Midtone Magenta-Green.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set midtoneMagentaGreen(value: number) {
        validateNumberRange(value, -100, 100)
        this.#midtoneMagentaGreen = value;
        this.updateUniform('midtoneMagentaGreen', value)
    }

    /** 
     * [KO] 미드톤 옐로우-블루
     * [EN] Midtone Yellow-Blue
     */
    get midtoneYellowBlue(): number {
        return this.#midtoneYellowBlue;
    }

    /**
     * [KO] 미드톤 옐로우-블루 설정
     * [EN] Sets Midtone Yellow-Blue.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set midtoneYellowBlue(value: number) {
        validateNumberRange(value, -100, 100)
        this.#midtoneYellowBlue = value;
        this.updateUniform('midtoneYellowBlue', value)
    }

    /** 
     * [KO] 하이라이트 시안-레드
     * [EN] Highlight Cyan-Red
     */
    get highlightCyanRed(): number {
        return this.#highlightCyanRed;
    }

    /**
     * [KO] 하이라이트 시안-레드 설정
     * [EN] Sets Highlight Cyan-Red.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set highlightCyanRed(value: number) {
        validateNumberRange(value, -100, 100)
        this.#highlightCyanRed = value;
        this.updateUniform('highlightCyanRed', value)
    }

    /** 
     * [KO] 하이라이트 마젠타-그린
     * [EN] Highlight Magenta-Green
     */
    get highlightMagentaGreen(): number {
        return this.#highlightMagentaGreen;
    }

    /**
     * [KO] 하이라이트 마젠타-그린 설정
     * [EN] Sets Highlight Magenta-Green.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set highlightMagentaGreen(value: number) {
        validateNumberRange(value, -100, 100)
        this.#highlightMagentaGreen = value;
        this.updateUniform('highlightMagentaGreen', value)
    }

    /** 
     * [KO] 하이라이트 옐로우-블루
     * [EN] Highlight Yellow-Blue
     */
    get highlightYellowBlue(): number {
        return this.#highlightYellowBlue;
    }

    /**
     * [KO] 하이라이트 옐로우-블루 설정
     * [EN] Sets Highlight Yellow-Blue.
     * 
     * [KO] 범위: -100~100
     * [EN] Range: -100~100
     */
    set highlightYellowBlue(value: number) {
        validateNumberRange(value, -100, 100)
        this.#highlightYellowBlue = value;
        this.updateUniform('highlightYellowBlue', value)
    }

    /** 
     * [KO] 밝기 보존 여부
     * [EN] Whether to preserve luminosity
     */
    get preserveLuminosity(): boolean {
        return this.#preserveLuminosity;
    }

    /**
     * [KO] 밝기 보존 여부를 설정합니다.
     * [EN] Sets whether to preserve luminosity.
     */
    set preserveLuminosity(value: boolean) {
        this.#preserveLuminosity = value;
        this.updateUniform('preserveLuminosity', value)
    }
}

Object.freeze(ColorBalance)
export default ColorBalance
import View3D from "../display/view/View3D";
import RedGPUContext from "../context/RedGPUContext";
import AToneMappingEffect from "./core/AToneMappingEffect";
import TONE_MAPPING_MODE from "./TONE_MAPPING_MODE";
import ToneLinear from "./linearToneMapping/ToneLinear";
import ToneKhronosPBRNeutral from "./khronosPbrNeutral/ToneKhronosPBRNeutral";
import ToneACESFilmicNarkowicz from "./ACESFilmicNarkowicz/ToneACESFilmicNarkowicz";
import ToneACESFilmicHill from "./ACESFilmicHill/ToneACESFilmicHill";
import {ASinglePassPostEffectResult} from "../postEffect/core/ASinglePassPostEffect";
import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateNumberRange from "../runtimeChecker/validateFunc/validateNumberRange";

/**
 * [KO] 톤 매핑, 노출, 대비, 밝기를 통합 관리하는 클래스입니다.
 * [EN] Class that integrates and manages tone mapping, exposure, contrast, and brightness.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // View3D를 통해 접근합니다. (Access through View3D)
 * const toneMappingManager = view.toneMappingManager;
 * toneMappingManager.mode = RedGPU.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
 * toneMappingManager.exposure = 1.2;
 * ```
 * @category ToneMapping
 */
class ToneMappingManager {
    readonly #redGPUContext: RedGPUContext;
    readonly #view: View3D;
    #toneMapping?: AToneMappingEffect;
    #mode: TONE_MAPPING_MODE = TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;

    #exposure: number = 1.0;
    #contrast: number = 1.0;
    #brightness: number = 0.0;

    /**
     * [KO] ToneMappingManager 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ToneMappingManager instance. (Internal system only)
     * @param view - [KO] View3D 인스턴스 [EN] View3D instance
     */
    constructor(view: View3D) {
        this.#redGPUContext = view.redGPUContext;
        this.#view = view;
    }

    /** [KO] 현재 활성화된 톤 매핑 이펙트 인스턴스를 반환합니다. [EN] Returns the currently active tone mapping effect instance. */
    get toneMapping(): AToneMappingEffect | undefined {
        this.#createToneMapping();
        return this.#toneMapping;
    }

    /** [KO] 현재 적용된 톤 매핑 모드를 반환합니다. [EN] Returns the currently applied tone mapping mode. */
    get mode(): TONE_MAPPING_MODE {
        return this.#mode;
    }

    /** [KO] 톤 매핑 모드를 설정합니다. [EN] Sets the tone mapping mode. */
    set mode(value: TONE_MAPPING_MODE) {
        if (this.#mode === value) return;
        this.#mode = value;
        if (this.#toneMapping) {
            this.#toneMapping.clear();
            this.#toneMapping = undefined;
        }
    }

    /** [KO] 노출값(Exposure)을 반환합니다. [EN] Returns the exposure value. */
    get exposure(): number {
        return this.#exposure;
    }

    /** [KO] 노출값(Exposure)을 설정합니다. (기본값: 1.0) [EN] Sets the exposure value. (Default: 1.0) */
    set exposure(value: number) {
        validatePositiveNumberRange(value, 0)
        this.#exposure = value;
        if (this.#toneMapping) this.#toneMapping.exposure = value;
    }

    /** [KO] 명암 대비(Contrast)를 반환합니다. [EN] Returns the contrast. */
    get contrast(): number {
        return this.#contrast;
    }

    /** [KO] 명암 대비(Contrast)를 설정합니다. (0.0 ~ 2.0, 기본값: 1.0) [EN] Sets the contrast. (0.0 to 2.0, Default: 1.0) */
    set contrast(value: number) {
        validatePositiveNumberRange(value, 0, 2)
        this.#contrast = value;
        if (this.#toneMapping) this.#toneMapping.contrast = value;
    }

    /** [KO] 밝기(Brightness)를 반환합니다. [EN] Returns the brightness. */
    get brightness(): number {
        return this.#brightness;
    }

    /** [KO] 밝기(Brightness)를 설정합니다. (-1.0 ~ 1.0, 기본값: 0.0) [EN] Sets the brightness. (-1.0 to 1.0, Default: 0.0) */
    set brightness(value: number) {
        validateNumberRange(value, -1, 1)
        this.#brightness = value;
        if (this.#toneMapping) this.#toneMapping.brightness = value;
    }

    /**
     * [KO] 톤 매핑을 렌더링합니다.
     * [EN] Renders tone mapping.
     * @param width - [KO] 너비 [EN] Width
     * @param height - [KO] 높이 [EN] Height
     * @param currentTextureView - [KO] 현재 텍스처 뷰 정보 [EN] Current texture view information
     * @returns [KO] 렌더링 결과 [EN] Rendering result
     */
    render(width: number, height: number, currentTextureView: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        const effect = this.toneMapping;
        return effect ? effect.render(this.#view, width, height, currentTextureView) : currentTextureView;
    }

    /**
     * [KO] 설정된 모드에 따라 톤 매핑 이펙트 인스턴스를 생성하고 파라미터를 동기화합니다.
     * [EN] Creates a tone mapping effect instance and synchronizes parameters according to the set mode.
     */
    #createToneMapping(): void {
        if (this.#toneMapping) return;

        switch (this.#mode) {
            case TONE_MAPPING_MODE.LINEAR:
                this.#toneMapping = new ToneLinear(this.#redGPUContext);
                break;
            case TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL:
                this.#toneMapping = new ToneKhronosPBRNeutral(this.#redGPUContext);
                break;
            case TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ:
                this.#toneMapping = new ToneACESFilmicNarkowicz(this.#redGPUContext);
                break;
            case TONE_MAPPING_MODE.ACES_FILMIC_HILL:
                this.#toneMapping = new ToneACESFilmicHill(this.#redGPUContext);
                break;
            default:
                this.#toneMapping = new ToneKhronosPBRNeutral(this.#redGPUContext);
                break;
        }

        if (this.#toneMapping) {
            this.#toneMapping.exposure = this.#exposure;
            this.#toneMapping.contrast = this.#contrast;
            this.#toneMapping.brightness = this.#brightness;
        }
    }
}

export default ToneMappingManager;

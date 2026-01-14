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

/**
 * 톤 매핑, 노출, 대비, 밝기를 통합 관리하는 클래스입니다.
 */
class ToneMappingManager {
    readonly #redGPUContext: RedGPUContext;
    readonly #view: View3D;
    #toneMapping?: AToneMappingEffect;
    #mode: TONE_MAPPING_MODE = TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;

    #exposure: number = 1.0;
    #contrast: number = 1.0;
    #brightness: number = 0.0;

    constructor(view: View3D) {
        this.#redGPUContext = view.redGPUContext;
        this.#view = view;
    }

    get toneMapping(): AToneMappingEffect | undefined {
        this.#createToneMapping();
        return this.#toneMapping;
    }

    get mode(): TONE_MAPPING_MODE {
        return this.#mode;
    }

    set mode(value: TONE_MAPPING_MODE) {
        if (this.#mode === value) return;
        this.#mode = value;
        if (this.#toneMapping) {
            this.#toneMapping.clear();
            this.#toneMapping = undefined;
        }
    }

    get exposure(): number {
        return this.#exposure;
    }

    set exposure(value: number) {
        validatePositiveNumberRange(value, 0)
        this.#exposure = value;
        if (this.#toneMapping) this.#toneMapping.exposure = value;
    }

    get contrast(): number {
        return this.#contrast;
    }

    set contrast(value: number) {
        validatePositiveNumberRange(value, 0, 1)
        this.#contrast = value;
        if (this.#toneMapping) this.#toneMapping.contrast = value;
    }

    get brightness(): number {
        return this.#brightness;
    }

    set brightness(value: number) {
        validatePositiveNumberRange(value, -1, 1)
        this.#brightness = value;
        if (this.#toneMapping) this.#toneMapping.brightness = value;
    }

    render(width: number, height: number, currentTextureView: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        const effect = this.toneMapping;
        return effect ? effect.render(this.#view, width, height, currentTextureView) : currentTextureView;
    }

    /**
     * 인스턴스 생성 시 현재 관리 중인 모든 파라미터를 동기화합니다.
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

        // 새로운 이펙트 객체에 현재 설정된 모든 값 주입
        if (this.#toneMapping) {
            this.#toneMapping.exposure = this.#exposure;
            this.#toneMapping.contrast = this.#contrast;
            this.#toneMapping.brightness = this.#brightness;
        }
    }
}

export default ToneMappingManager;
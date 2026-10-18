import View3D from "../display/view/View3D";
import RedGPUObject from "../base/RedGPUObject";
import RedGPUContext from "../context/RedGPUContext";
import AToneMappingEffect from "./core/AToneMappingEffect";
import TONE_MAPPING_MODE from "./TONE_MAPPING_MODE";
import ToneLinear from "./linearToneMapping/ToneLinear";
import ToneKhronosPBRNeutral from "./khronosPbrNeutral/ToneKhronosPBRNeutral";
import ToneACESFilmicNarkowicz from "./ACESFilmicNarkowicz/ToneACESFilmicNarkowicz";
import ToneACESFilmicHill from "./ACESFilmicHill/ToneACESFilmicHill";
import {IPostEffectResult} from "../postEffect/core/types";

/**
 * [KO] 톤 매핑, 대비, 밝기 설정을 통합 관리하는 클래스입니다.
 * [EN] Class that integrates and manages tone mapping, contrast, and brightness settings.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D를 통해 접근합니다.
 * // [EN] Access through View3D.
 * const toneMappingManager = view.toneMappingManager;
 * toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
 * ```
 *
 * @category ToneMapping
 */
class ToneMappingManager extends RedGPUObject {
    #toneMapping?: AToneMappingEffect;
    #mode: TONE_MAPPING_MODE = TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;

    #contrast: number = 1.0;
    #brightness: number = 0.0;

    /**
     * [KO] ToneMappingManager 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ToneMappingManager instance. (Internal system only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 현재 활성화된 톤 매핑 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the currently active tone mapping effect instance.
     *
     * @returns
     * [KO] 활성화된 톤 매핑 이펙트 인스턴스
     * [EN] Active tone mapping effect instance
     */
    get toneMapping(): AToneMappingEffect | undefined {
        this.#createToneMapping();
        return this.#toneMapping;
    }

    /**
     * [KO] 현재 적용된 톤 매핑 모드를 반환하거나 설정합니다.
     * [EN] Returns or sets the currently applied tone mapping mode.
     *
     * @returns
     * [KO] 현재 톤 매핑 모드
     * [EN] Current tone mapping mode
     */
    get mode(): TONE_MAPPING_MODE {
        return this.#mode;
    }

    set mode(value: TONE_MAPPING_MODE) {
        if (this.#mode === value) return;
        this.#mode = value;
        this.clear();
    }

    /**
     * [KO] 명암 대비(Contrast)를 반환하거나 설정합니다. (0.0 ~ 2.0, 기본값: 1.0)
     * [EN] Returns or sets the contrast. (0.0 to 2.0, Default: 1.0)
     *
     * @returns
     * [KO] 명암 대비 값
     * [EN] Contrast value
     */
    get contrast(): number {
        return this.#contrast;
    }

    set contrast(value: number) {
        this.#contrast = value;
        if (this.#toneMapping) this.#toneMapping.contrast = value;
    }

    /**
     * [KO] 밝기(Brightness)를 반환하거나 설정합니다. (-1.0 ~ 1.0, 기본값: 0.0)
     * [EN] Returns or sets the brightness. (-1.0 to 1.0, Default: 0.0)
     *
     * @returns
     * [KO] 밝기 값
     * [EN] Brightness value
     */
    get brightness(): number {
        return this.#brightness;
    }

    set brightness(value: number) {
        this.#brightness = value;
        if (this.#toneMapping) this.#toneMapping.brightness = value;
    }

    /**
     * [KO] 현재 톤 매핑 이펙트 리소스를 해제합니다.
     * [EN] Releases the current tone mapping effect resources.
     */
    clear() {
        if (this.#toneMapping) {
            this.#toneMapping.destroy();
            this.#toneMapping = undefined;
        }
    }

    /**
     * [KO] 톤 매핑을 렌더링합니다.
     * [EN] Renders tone mapping.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param currentTextureView -
     * [KO] 현재 텍스처 뷰 결과 정보
     * [EN] Current texture view result information
     * @returns
     * [KO] 톤 매핑이 적용된 렌더링 결과
     * [EN] Rendering result with tone mapping applied
     */
    render(view: View3D, width: number, height: number, currentTextureView: IPostEffectResult): IPostEffectResult {
        const effect = this.toneMapping;
        return effect ? effect.render(view, width, height, currentTextureView) : currentTextureView;
    }

    /**
     * [KO] ToneMappingManager 인스턴스를 파기하고 관련 리소스를 해제합니다.
     * [EN] Destroys the ToneMappingManager instance and releases related resources.
     */
    destroy() {
        this.clear();
        console.log("🧹 ToneMappingManager destroy 완료");
    }

    #createToneMapping(): void {
        if (this.#toneMapping) return;
        const {redGPUContext} = this;
        switch (this.#mode) {
            case TONE_MAPPING_MODE.LINEAR:
                this.#toneMapping = new ToneLinear(redGPUContext);
                break;
            case TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL:
                this.#toneMapping = new ToneKhronosPBRNeutral(redGPUContext);
                break;
            case TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ:
                this.#toneMapping = new ToneACESFilmicNarkowicz(redGPUContext);
                break;
            case TONE_MAPPING_MODE.ACES_FILMIC_HILL:
                this.#toneMapping = new ToneACESFilmicHill(redGPUContext);
                break;
            default:
                this.#toneMapping = new ToneKhronosPBRNeutral(redGPUContext);
                break;
        }

        if (this.#toneMapping) {
            this.#toneMapping.contrast = this.#contrast;
            this.#toneMapping.brightness = this.#brightness;
        }
    }
}

Object.freeze(ToneMappingManager);
export default ToneMappingManager;

import View3D from "../display/view/View3D";
import RedGPUContext from "../context/RedGPUContext";
import AToneMappingEffect from "./core/AToneMappingEffect";
import TONE_MAPPING_MODE from "./TONE_MAPPING_MODE";
import ToneLinear from "./linearToneMapping/ToneLinear";
import ToneKhronosPBRNeutral from "./khronosPbrNeutral/ToneKhronosPBRNeutral";
import ToneACESFilmicNarkowicz from "./ACESFilmicNarkowicz/ToneACESFilmicNarkowicz";
import ToneACESFilmicHill from "./ACESFilmicHill/ToneACESFilmicHill";
import {ASinglePassPostEffectResult} from "../postEffect/core/ASinglePassPostEffect";

/**
 * 톤 매핑(Tone Mapping)을 관리하는 클래스입니다.
 * HDR(High Dynamic Range) 색상 값을 디스플레이 가능한 LDR(Low Dynamic Range) 범위로 변환하는 다양한 알고리즘을 제공합니다.
 *
 * @example
 * ```typescript
 * // View3D 생성 시 내부적으로 자동 생성됩니다.
 * const toneManager = view.toneMappingManager;
 *
 * // 톤 매핑 모드 변경
 * toneManager.mode = TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ;
 * ```
 */
class ToneMappingManager {
    /** @private @readonly */
    readonly #redGPUContext: RedGPUContext;
    /** @private @readonly */
    readonly #view: View3D;
    /** @private */
    #toneMapping: AToneMappingEffect;
    /** @private */
    #mode: TONE_MAPPING_MODE = TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL;

    /**
     * ToneMappingManager 인스턴스를 생성합니다.
     * @param view - 이 매니저가 소속된 View3D 인스턴스
     */
    constructor(view: View3D) {
        this.#redGPUContext = view.redGPUContext;
        this.#view = view;
    }

    /**
     * 현재 설정된 모드에 따라 톤 매핑 이펙트 인스턴스를 생성합니다.
     * 이미 인스턴스가 존재하면 새로 생성하지 않습니다.
     * @private
     */
    #createToneMapping(): void {
        if (!this.#toneMapping) {
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
            }
        }
    }

    /**
     * 현재 활성화된 톤 매핑 이펙트 인스턴스를 가져옵니다.
     * @returns 현재 사용 중인 AToneMappingEffect 상속 객체
     */
    get toneMapping(): AToneMappingEffect {
        this.#createToneMapping();
        return this.#toneMapping;
    }

    /**
     * 현재 적용된 톤 매핑 모드를 가져옵니다.
     * @returns TONE_MAPPING_MODE 상수 값 (0.0~1.0 범위의 가시성 결과에 영향)
     */
    get mode(): TONE_MAPPING_MODE {
        return this.#mode;
    }

    /**
     * 톤 매핑 모드를 설정합니다.
     * 설정 시 기존 리소스는 해제(clear)되고 새로운 모드에 맞는 인스턴스가 생성됩니다.
     * @param value - 변경할 TONE_MAPPING_MODE 값
     */
    set mode(value: TONE_MAPPING_MODE) {
        if (this.#mode === value) return;
        this.#mode = value;
        if (this.#toneMapping) {
            this.#toneMapping.clear();
            this.#toneMapping = undefined;
        }
        this.#createToneMapping();
    }

    /**
     * 톤 매핑 과정을 렌더링합니다.
     * 톤 매핑이 설정되어 있지 않으면 입력받은 텍스처 뷰를 그대로 반환합니다.
     *
     * @param width - 렌더링 타겟의 너비 (pixel 단위)
     * @param height - 렌더링 타겟의 높이 (pixel 단위)
     * @param currentTextureView - 톤 매핑을 적용할 원본 입력 텍스처 결과
     * @returns 톤 매핑이 적용된 후의 ASinglePassPostEffectResult
     *
     * @remarks
     * 이 메서드는 렌더 루프의 마지막 단계(Post-processing)에서 호출되어야 합니다.
     */
    render(width: number, height: number, currentTextureView: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        if (this.toneMapping) {
            return this.toneMapping.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        } else {
            return currentTextureView;
        }
    }
}

export default ToneMappingManager;
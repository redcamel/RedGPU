import RedGPUContext from "../../context/RedGPUContext";
import AToneMappingEffect from "../core/AToneMappingEffect";
/**
 * [KO] ACES Filmic(Narkowicz 근사) 곡선으로 HDR 색상을 LDR 범위로 압축하는 톤 매핑 이펙트입니다.
 * [EN] Tone mapping effect that compresses HDR color into LDR range using the ACES Filmic (Narkowicz approximation) curve.
 *
 * [KO] `ToneMappingManager`의 모드가 `ACES_FILMIC_NARKOWICZ`일 때 내부적으로 자동 생성됩니다.
 * [EN] Automatically created internally when the `ToneMappingManager` mode is `ACES_FILMIC_NARKOWICZ`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ;
 * ```
 *
 * @category ToneMapping
 */
declare class ToneACESFilmicNarkowicz extends AToneMappingEffect {
    /**
     * [KO] ToneACESFilmicNarkowicz 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ToneACESFilmicNarkowicz instance. (Internal system only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default ToneACESFilmicNarkowicz;

/**
 * [KO] 사용 가능한 톤 매핑 모드 상수 정의입니다.
 * [EN] Constants for available tone mapping modes.
 * @category ToneMapping
 */
export declare const TONE_MAPPING_MODE: {
    /** [KO] 선형 톤 매핑 [EN] Linear tone mapping */
    readonly LINEAR: "linear";
    /** [KO] Khronos PBR Neutral 톤 매핑 [EN] Khronos PBR Neutral tone mapping */
    readonly KHRONOS_PBR_NEUTRAL: "khronosPBRNeutral";
    /** [KO] ACES Filmic (Hill 근사) 톤 매핑 [EN] ACES Filmic (Hill approximation) tone mapping */
    readonly ACES_FILMIC_HILL: "ACESFilmicHill";
    /** [KO] ACES Filmic (Narkowicz 근사) 톤 매핑 [EN] ACES Filmic (Narkowicz approximation) tone mapping */
    readonly ACES_FILMIC_NARKOWICZ: "ACESFilmicNarkowicz";
};
/** [KO] TONE_MAPPING_MODE 타입 [EN] TONE_MAPPING_MODE type */
export type TONE_MAPPING_MODE = typeof TONE_MAPPING_MODE[keyof typeof TONE_MAPPING_MODE];
export default TONE_MAPPING_MODE;

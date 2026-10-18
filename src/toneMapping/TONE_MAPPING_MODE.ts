/**
 * [KO] 사용 가능한 톤 매핑 모드 상수 정의입니다.
 * [EN] Constants for available tone mapping modes.
 *
 * ### Example
 * ```typescript
 * view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
 * ```
 *
 * @category ToneMapping
 */
export const TONE_MAPPING_MODE = {
    /**
     * [KO] 선형 톤 매핑
     * [EN] Linear tone mapping
     */
    LINEAR: 'linear',
    /**
     * [KO] Khronos PBR Neutral 톤 매핑
     * [EN] Khronos PBR Neutral tone mapping
     */
    KHRONOS_PBR_NEUTRAL: 'khronosPBRNeutral',
    /**
     * [KO] ACES Filmic (Hill 근사) 톤 매핑
     * [EN] ACES Filmic (Hill approximation) tone mapping
     */
    ACES_FILMIC_HILL: 'ACESFilmicHill',
    /**
     * [KO] ACES Filmic (Narkowicz 근사) 톤 매핑
     * [EN] ACES Filmic (Narkowicz approximation) tone mapping
     */
    ACES_FILMIC_NARKOWICZ: 'ACESFilmicNarkowicz',
} as const;

/**
 * [KO] 톤 매핑 모드 유니온 타입입니다.
 * [EN] Tone mapping mode union type.
 *
 * @category ToneMapping
 */
export type TONE_MAPPING_MODE = (typeof TONE_MAPPING_MODE)[keyof typeof TONE_MAPPING_MODE];

Object.freeze(TONE_MAPPING_MODE);
export default TONE_MAPPING_MODE;
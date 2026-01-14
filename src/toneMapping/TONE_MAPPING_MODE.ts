export const TONE_MAPPING_MODE = {
    LINEAR: 'linear',
    KHRONOS_PBR_NEUTRAL: 'khronosPBRNeutral',
    ACES_FILMIC_HILL: 'ACESFilmicHill',
    ACES_FILMIC_NARKOWICZ: 'ACESFilmicNarkowicz',
} as const;
export type TONE_MAPPING_MODE = typeof TONE_MAPPING_MODE[keyof typeof TONE_MAPPING_MODE];
export default TONE_MAPPING_MODE;




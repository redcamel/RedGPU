export declare const TONE_MAPPING_MODE: {
    readonly LINEAR: "linear";
    readonly KHRONOS_PBR_NEUTRAL: "khronosPBRNeutral";
    readonly ACES_FILMIC_HILL: "ACESFilmicHill";
    readonly ACES_FILMIC_NARKOWICZ: "ACESFilmicNarkowicz";
};
export type TONE_MAPPING_MODE = typeof TONE_MAPPING_MODE[keyof typeof TONE_MAPPING_MODE];
export default TONE_MAPPING_MODE;

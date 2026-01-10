export const TONE_MAPPING_MODE = {
    LINEAR : 'linear',
    KHRONOS_PBR_NEUTRAL : 'khronosPbrNeutral',
} as const;
export type TONE_MAPPING_MODE = typeof TONE_MAPPING_MODE[keyof typeof TONE_MAPPING_MODE];
export default TONE_MAPPING_MODE;

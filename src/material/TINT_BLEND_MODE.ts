/**
 * [KO] 틴트 블렌드 모드 상수
 * [EN] Tint blend mode constants
 * @category Constant
 */
export const TINT_BLEND_MODE = {
    NORMAL: 0,
    MULTIPLY: 1,
    LIGHTEN: 2,
    SCREEN: 3,
    LINEAR_DODGE: 4,
    SUBTRACT: 5,
    DARKEN: 6,
    OVERLAY: 7,
    COLOR_DODGE: 8,
    COLOR_BURN: 9,
    HARD_LIGHT: 10,
    SOFT_LIGHT: 11,
    DIFFERENCE: 12,
    EXCLUSION: 13,
    DIVIDE: 14,
    VIVID_LIGHT: 15,
    LINEAR_BURN: 16,
    PIN_LIGHT: 17,
    SATURATION: 18,
    HUE: 19,
    LUMINOSITY: 20,
    COLOR: 21,
    NEGATION: 22,
} as const;
export type TINT_BLEND_MODE = typeof TINT_BLEND_MODE[keyof typeof TINT_BLEND_MODE];
export default TINT_BLEND_MODE;

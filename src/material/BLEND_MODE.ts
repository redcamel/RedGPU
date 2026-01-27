/**
 * [KO] 블렌드 모드 상수
 * [EN] Blend mode constants
 * @category Constant
 */
export const BLEND_MODE = {
    NORMAL: 0,
    MULTIPLY: 1,
    LIGHTEN: 2,
    SCREEN: 3,
    LINEAR_DODGE: 4,
    SUBTRACT: 5,
    DIFFERENCE: 6,
    EXCLUSION: 7,
} as const;
export type BLEND_MODE = typeof BLEND_MODE[keyof typeof BLEND_MODE];
export default BLEND_MODE;

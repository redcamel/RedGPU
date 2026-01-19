/**
 * [KO] 틴트 블렌드 모드 상수
 * [EN] Tint blend mode constants
 * @category Constant
 */
export declare const TINT_BLEND_MODE: {
    readonly NORMAL: 0;
    readonly MULTIPLY: 1;
    readonly LIGHTEN: 2;
    readonly SCREEN: 3;
    readonly LINEAR_DODGE: 4;
    readonly SUBTRACT: 5;
    readonly DARKEN: 6;
    readonly OVERLAY: 7;
    readonly COLOR_DODGE: 8;
    readonly COLOR_BURN: 9;
    readonly HARD_LIGHT: 10;
    readonly SOFT_LIGHT: 11;
    readonly DIFFERENCE: 12;
    readonly EXCLUSION: 13;
    readonly DIVIDE: 14;
    readonly VIVID_LIGHT: 15;
    readonly LINEAR_BURN: 16;
    readonly PIN_LIGHT: 17;
    readonly SATURATION: 18;
    readonly HUE: 19;
    readonly LUMINOSITY: 20;
    readonly COLOR: 21;
    readonly NEGATION: 22;
};
export type TINT_BLEND_MODE = typeof TINT_BLEND_MODE[keyof typeof TINT_BLEND_MODE];
export default TINT_BLEND_MODE;

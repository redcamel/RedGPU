/**
 * [KO] 블렌드 모드 상수
 * [EN] Blend mode constants
 * @category Constant
 */
export declare const BLEND_MODE: {
    readonly NORMAL: 0;
    readonly MULTIPLY: 1;
    readonly LIGHTEN: 2;
    readonly SCREEN: 3;
    readonly LINEAR_DODGE: 4;
    readonly SUBTRACT: 5;
    readonly DIFFERENCE: 6;
    readonly EXCLUSION: 7;
};
export type BLEND_MODE = typeof BLEND_MODE[keyof typeof BLEND_MODE];
export default BLEND_MODE;

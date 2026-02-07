/**
 * [KO] 틴트 블렌드 모드(Tint Blend Mode) 정의 객체입니다.
 * [EN] Object defining tint blend modes.
 *
 * [KO] 머티리얼의 베이스 색상과 틴트 색상이 결합되는 방식을 정의하는 다양한 혼합 옵션을 제공합니다.
 * [EN] Provides various mixing options that define how the material's base color and tint color are combined.
 *
 * ### Example
 * ```typescript
 * material.tintBlendMode = RedGPU.Material.TINT_BLEND_MODE.OVERLAY;
 * ```
 * @category Constant
 */
export const TINT_BLEND_MODE = {
    /** [KO] 일반 혼합 [EN] Normal */
    NORMAL: 0,
    /** [KO] 곱하기 혼합 [EN] Multiply */
    MULTIPLY: 1,
    /** [KO] 밝게 하기 혼합 [EN] Lighten */
    LIGHTEN: 2,
    /** [KO] 스크린 혼합 [EN] Screen */
    SCREEN: 3,
    /** [KO] 선형 닷지 혼합 [EN] Linear Dodge */
    LINEAR_DODGE: 4,
    /** [KO] 빼기 혼합 [EN] Subtract */
    SUBTRACT: 5,
    /** [KO] 어둡게 하기 혼합 [EN] Darken */
    DARKEN: 6,
    /** [KO] 오버레이 혼합 [EN] Overlay */
    OVERLAY: 7,
    /** [KO] 컬러 닷지 혼합 [EN] Color Dodge */
    COLOR_DODGE: 8,
    /** [KO] 컬러 번 혼합 [EN] Color Burn */
    COLOR_BURN: 9,
    /** [KO] 하드 라이트 혼합 [EN] Hard Light */
    HARD_LIGHT: 10,
    /** [KO] 소프트 라이트 혼합 [EN] Soft Light */
    SOFT_LIGHT: 11,
    /** [KO] 차이 혼합 [EN] Difference */
    DIFFERENCE: 12,
    /** [KO] 제외 혼합 [EN] Exclusion */
    EXCLUSION: 13,
    /** [KO] 나누기 혼합 [EN] Divide */
    DIVIDE: 14,
    /** [KO] 비비드 라이트 혼합 [EN] Vivid Light */
    VIVID_LIGHT: 15,
    /** [KO] 선형 번 혼합 [EN] Linear Burn */
    LINEAR_BURN: 16,
    /** [KO] 핀 라이트 혼합 [EN] Pin Light */
    PIN_LIGHT: 17,
    /** [KO] 채도 혼합 [EN] Saturation */
    SATURATION: 18,
    /** [KO] 색조 혼합 [EN] Hue */
    HUE: 19,
    /** [KO] 광도 혼합 [EN] Luminosity */
    LUMINOSITY: 20,
    /** [KO] 색상 혼합 [EN] Color */
    COLOR: 21,
    /** [KO] 반전 혼합 [EN] Negation */
    NEGATION: 22,
} as const;
export type TINT_BLEND_MODE = typeof TINT_BLEND_MODE[keyof typeof TINT_BLEND_MODE];
export default TINT_BLEND_MODE;

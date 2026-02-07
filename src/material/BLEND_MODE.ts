/**
 * [KO] 블렌드 모드 정의 객체입니다.
 * [EN] Object defining blend modes.
 *
 * [KO] 머티리얼의 색상이 배경과 혼합되는 방식을 결정하는 다양한 블렌딩 옵션을 제공합니다.
 * [EN] Provides various blending options that determine how material colors are mixed with the background.
 *
 * ### Example
 * ```typescript
 * material.blendMode = RedGPU.Material.BLEND_MODE.MULTIPLY;
 * ```
 * @category Constant
 */
export const BLEND_MODE = {
    /**
     * [KO] 일반 블렌딩 (기본값)
     * [EN] Normal blending (Default)
     */
    NORMAL: 0,
    /**
     * [KO] 곱하기 블렌딩
     * [EN] Multiply blending
     */
    MULTIPLY: 1,
    /**
     * [KO] 밝게 하기 블렌딩
     * [EN] Lighten blending
     */
    LIGHTEN: 2,
    /**
     * [KO] 스크린 블렌딩
     * [EN] Screen blending
     */
    SCREEN: 3,
    /**
     * [KO] 선형 닷지 (더하기) 블렌딩
     * [EN] Linear Dodge (Add) blending
     */
    LINEAR_DODGE: 4,
    /**
     * [KO] 빼기 블렌딩
     * [EN] Subtract blending
     */
    SUBTRACT: 5,
    /**
     * [KO] 차이 블렌딩
     * [EN] Difference blending
     */
    DIFFERENCE: 6,
    /**
     * [KO] 제외 블렌딩
     * [EN] Exclusion blending
     */
    EXCLUSION: 7,
} as const;
export type BLEND_MODE = typeof BLEND_MODE[keyof typeof BLEND_MODE];
export default BLEND_MODE;

/**
 * [KO] 머티리얼의 틴트(Tint) 색상을 원본 색상과 합성할 때 사용하는 블렌드 모드 상수입니다.
 * [EN] Blend mode constants used when compositing material tint colors with base colors.
 *
 * ### Example
 * ```typescript
 * material.useTint = true;
 * material.tintBlendMode = RedGPU.Material.TINT_BLEND_MODE.MULTIPLY;
 * ```
 *
 * @see [2D Tint basic example](/RedGPU/examples/2d/tint/basic/)
 * @see [3D Tint basic example](/RedGPU/examples/3d/tint/basic/)
 * @category Material
 */
export const TINT_BLEND_MODE = {
    /**
     * [KO] 기본(Normal) 틴트 블렌드 모드 (0)
     * [EN] Normal tint blend mode (0)
     */
    NORMAL: 0,
    /**
     * [KO] 곱하기(Multiply) 틴트 블렌드 모드 (1)
     * [EN] Multiply tint blend mode (1)
     */
    MULTIPLY: 1,
    /**
     * [KO] 밝게(Lighten) 틴트 블렌드 모드 (2)
     * [EN] Lighten tint blend mode (2)
     */
    LIGHTEN: 2,
    /**
     * [KO] 스크린(Screen) 틴트 블렌드 모드 (3)
     * [EN] Screen tint blend mode (3)
     */
    SCREEN: 3,
    /**
     * [KO] 선형 닷지(Linear Dodge) 틴트 블렌드 모드 (4)
     * [EN] Linear Dodge tint blend mode (4)
     */
    LINEAR_DODGE: 4,
    /**
     * [KO] 빼기(Subtract) 틴트 블렌드 모드 (5)
     * [EN] Subtract tint blend mode (5)
     */
    SUBTRACT: 5,
    /**
     * [KO] 어둡게(Darken) 틴트 블렌드 모드 (6)
     * [EN] Darken tint blend mode (6)
     */
    DARKEN: 6,
    /**
     * [KO] 오버레이(Overlay) 틴트 블렌드 모드 (7)
     * [EN] Overlay tint blend mode (7)
     */
    OVERLAY: 7,
    /**
     * [KO] 컬러 닷지(Color Dodge) 틴트 블렌드 모드 (8)
     * [EN] Color Dodge tint blend mode (8)
     */
    COLOR_DODGE: 8,
    /**
     * [KO] 컬러 번(Color Burn) 틴트 블렌드 모드 (9)
     * [EN] Color Burn tint blend mode (9)
     */
    COLOR_BURN: 9,
    /**
     * [KO] 하드 라이트(Hard Light) 틴트 블렌드 모드 (10)
     * [EN] Hard Light tint blend mode (10)
     */
    HARD_LIGHT: 10,
    /**
     * [KO] 소프트 라이트(Soft Light) 틴트 블렌드 모드 (11)
     * [EN] Soft Light tint blend mode (11)
     */
    SOFT_LIGHT: 11,
    /**
     * [KO] 차이(Difference) 틴트 블렌드 모드 (12)
     * [EN] Difference tint blend mode (12)
     */
    DIFFERENCE: 12,
    /**
     * [KO] 제외(Exclusion) 틴트 블렌드 모드 (13)
     * [EN] Exclusion tint blend mode (13)
     */
    EXCLUSION: 13,
    /**
     * [KO] 나누기(Divide) 틴트 블렌드 모드 (14)
     * [EN] Divide tint blend mode (14)
     */
    DIVIDE: 14,
    /**
     * [KO] 비비드 라이트(Vivid Light) 틴트 블렌드 모드 (15)
     * [EN] Vivid Light tint blend mode (15)
     */
    VIVID_LIGHT: 15,
    /**
     * [KO] 선형 번(Linear Burn) 틴트 블렌드 모드 (16)
     * [EN] Linear Burn tint blend mode (16)
     */
    LINEAR_BURN: 16,
    /**
     * [KO] 핀 라이트(Pin Light) 틴트 블렌드 모드 (17)
     * [EN] Pin Light tint blend mode (17)
     */
    PIN_LIGHT: 17,
    /**
     * [KO] 채도(Saturation) 틴트 블렌드 모드 (18)
     * [EN] Saturation tint blend mode (18)
     */
    SATURATION: 18,
    /**
     * [KO] 색조(Hue) 틴트 블렌드 모드 (19)
     * [EN] Hue tint blend mode (19)
     */
    HUE: 19,
    /**
     * [KO] 광도(Luminosity) 틴트 블렌드 모드 (20)
     * [EN] Luminosity tint blend mode (20)
     */
    LUMINOSITY: 20,
    /**
     * [KO] 색상(Color) 틴트 블렌드 모드 (21)
     * [EN] Color tint blend mode (21)
     */
    COLOR: 21,
    /**
     * [KO] 반전(Negation) 틴트 블렌드 모드 (22)
     * [EN] Negation tint blend mode (22)
     */
    NEGATION: 22,
} as const;

/**
 * [KO] TINT_BLEND_MODE 상수 값의 유니온 타입입니다.
 * [EN] Union type of TINT_BLEND_MODE constant values.
 * @category Material
 */
export type TINT_BLEND_MODE = typeof TINT_BLEND_MODE[keyof typeof TINT_BLEND_MODE];
export default TINT_BLEND_MODE;

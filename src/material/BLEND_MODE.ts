/**
 * [KO] 2D 객체 및 머티리얼 합성 시 사용되는 블렌드 모드 상수입니다.
 * [EN] Blend mode constants used when compositing 2D objects and materials.
 *
 * ### Example
 * ```typescript
 * sprite2D.blendMode = RedGPU.Material.BLEND_MODE.MULTIPLY;
 * ```
 *
 * @see [2D BlendMode basic example](/RedGPU/examples/2d/blendMode/basic/)
 * @category Material
 */
export const BLEND_MODE = {
    /**
     * [KO] 기본 블렌드 모드 (0)
     * [EN] Normal blend mode (0)
     */
    NORMAL: 0,
    /**
     * [KO] 곱하기(Multiply) 블렌드 모드 (1)
     * [EN] Multiply blend mode (1)
     */
    MULTIPLY: 1,
    /**
     * [KO] 밝게(Lighten) 블렌드 모드 (2)
     * [EN] Lighten blend mode (2)
     */
    LIGHTEN: 2,
    /**
     * [KO] 스크린(Screen) 블렌드 모드 (3)
     * [EN] Screen blend mode (3)
     */
    SCREEN: 3,
    /**
     * [KO] 선형 닷지(Linear Dodge) 블렌드 모드 (4)
     * [EN] Linear Dodge blend mode (4)
     */
    LINEAR_DODGE: 4,
    /**
     * [KO] 빼기(Subtract) 블렌드 모드 (5)
     * [EN] Subtract blend mode (5)
     */
    SUBTRACT: 5,
    /**
     * [KO] 차이(Difference) 블렌드 모드 (6)
     * [EN] Difference blend mode (6)
     */
    DIFFERENCE: 6,
    /**
     * [KO] 제외(Exclusion) 블렌드 모드 (7)
     * [EN] Exclusion blend mode (7)
     */
    EXCLUSION: 7,
} as const;

/**
 * [KO] BLEND_MODE 상수 값의 유니온 타입입니다.
 * [EN] Union type of BLEND_MODE constant values.
 * @category Material
 */
export type BLEND_MODE = typeof BLEND_MODE[keyof typeof BLEND_MODE];
export default BLEND_MODE;

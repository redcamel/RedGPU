/**
 * [KO] 합성 모드(Composite Mode) 정의 객체입니다.
 * [EN] Object defining composite modes.
 *
 * [KO] 2D 렌더링 시 소스와 대상 픽셀이 합성되는 방식을 정의하는 Canvas-style 합성 옵션을 제공합니다.
 * [EN] Provides Canvas-style composite options that define how source and destination pixels are mixed during 2D rendering.
 *
 * ### Example
 * ```typescript
 * material.compositeMode = RedGPU.Material.COMPOSITE_MODE.SOURCE_IN;
 * ```
 * @category Constant
 */
export const COMPOSITE_MODE = {
    /**
     * [KO] 더하기 합성
     * [EN] Additive composition
     */
    ADDITIVE: "additive",
    /**
     * [KO] 소스를 대상 위에 그립니다. (기본값)
     * [EN] Draws the source over the destination. (Default)
     */
    SOURCE_OVER: "source-over",
    /**
     * [KO] 대상과 겹치는 부분에만 소스를 그립니다.
     * [EN] Draws the source only where it overlaps the destination.
     */
    SOURCE_IN: "source-in",
    /**
     * [KO] 대상과 겹치지 않는 부분에만 소스를 그립니다.
     * [EN] Draws the source only where it does not overlap the destination.
     */
    SOURCE_OUT: "source-out",
    /**
     * [KO] 대상과 겹치는 부분에만 소스를 그리고, 그 외에는 대상을 유지합니다.
     * [EN] Draws the source only where it overlaps the destination, keeping the destination elsewhere.
     */
    SOURCE_ATOP: "source-atop",
    /**
     * [KO] 대상을 소스 위에 그립니다.
     * [EN] Draws the destination over the source.
     */
    DESTINATION_OVER: "destination-over",
    /**
     * [KO] 소스와 겹치는 부분에만 대상을 유지합니다.
     * [EN] Keeps the destination only where it overlaps the source.
     */
    DESTINATION_IN: "destination-in",
    /**
     * [KO] 소스와 겹치지 않는 부분에만 대상을 유지합니다.
     * [EN] Keeps the destination only where it does not overlap the source.
     */
    DESTINATION_OUT: "destination-out",
    /**
     * [KO] 소스와 겹치는 부분에만 대상을 그리고, 그 외에는 소스를 유지합니다.
     * [EN] Draws the destination only where it overlaps the source, keeping the source elsewhere.
     */
    DESTINATION_ATOP: "destination-atop"
} as const;
export type COMPOSITE_MODE = typeof COMPOSITE_MODE[keyof typeof COMPOSITE_MODE];
export default COMPOSITE_MODE;

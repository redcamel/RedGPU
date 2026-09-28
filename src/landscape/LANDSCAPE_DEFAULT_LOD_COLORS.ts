/**
 * [KO] 지형 LOD 단계별 디버그 시각화에 사용되는 기본 색상 배열(`[r, g, b, a]`)입니다.
 * [EN] Default color array in `[r, g, b, a]` format used for terrain LOD level debug visualization.
 *
 * [KO] LOD 0부터 LOD 7까지 각 단계별 지형 타일을 화면에서 쉽게 식별할 수 있도록 8개의 고유한 색상(0.0~1.0 정규화 범위)을 정의합니다.
 * [EN] Defines 8 distinct colors (normalized 0.0 to 1.0 range) to easily identify terrain tiles at each level from LOD 0 to LOD 7.
 *
 * | Level | Normalized RGBA | Hex | Color | Description |
 * | :--- | :--- | :--- | :--- | :--- |
 * | `0` (LOD 0) | `[0.23, 0.51, 0.96, 1.0]` | `#3a82f4` | Blue | [KO] 최고 해상도 타일 (카메라 최근접) [EN] Highest resolution tile (closest to camera) |
 * | `1` (LOD 1) | `[0.06, 0.72, 0.51, 1.0]` | `#0fb782` | Green | [KO] 고해상도 타일 [EN] High resolution tile |
 * | `2` (LOD 2) | `[0.92, 0.70, 0.03, 1.0]` | `#eab207` | Yellow | [KO] 중상위 해상도 타일 [EN] Medium-high resolution tile |
 * | `3` (LOD 3) | `[0.98, 0.45, 0.09, 1.0]` | `#f97216` | Orange | [KO] 중간 해상도 타일 [EN] Medium resolution tile |
 * | `4` (LOD 4) | `[0.94, 0.27, 0.27, 1.0]` | `#ef4444` | Red | [KO] 중하위 해상도 타일 [EN] Medium-low resolution tile |
 * | `5` (LOD 5) | `[0.66, 0.33, 0.97, 1.0]` | `#a854f7` | Purple | [KO] 저해상도 타일 [EN] Low resolution tile |
 * | `6` (LOD 6) | `[0.93, 0.28, 0.60, 1.0]` | `#ed4799` | Pink | [KO] 초저해상도 타일 [EN] Ultra-low resolution tile |
 * | `7` (LOD 7) | `[0.58, 0.64, 0.72, 1.0]` | `#93a3b7` | Slate | [KO] 최저 해상도 타일 (최원거리) [EN] Lowest resolution tile (farthest from camera) |
 *
 * ### Example
 * ```typescript
 * // LOD 레벨 0의 기본 색상 ([r, g, b, a])
 * const lod0Color = RedGPU.Landscape.LANDSCAPE_DEFAULT_LOD_COLORS[0];
 * ```
 *
 * @internal
 */
export const LANDSCAPE_DEFAULT_LOD_COLORS: [number, number, number, number][] = Object.freeze([
    // LOD 0: Blue (최고 해상도 / 카메라 최근접)
    [0.23, 0.51, 0.96, 1.0],
    // LOD 1: Green
    [0.06, 0.72, 0.51, 1.0],
    // LOD 2: Yellow
    [0.92, 0.70, 0.03, 1.0],
    // LOD 3: Orange
    [0.98, 0.45, 0.09, 1.0],
    // LOD 4: Red
    [0.94, 0.27, 0.27, 1.0],
    // LOD 5: Purple
    [0.66, 0.33, 0.97, 1.0],
    // LOD 6: Pink
    [0.93, 0.28, 0.60, 1.0],
    // LOD 7: Slate Gray (최저 해상도 / 최원거리)
    [0.58, 0.64, 0.72, 1.0]
]) as [number, number, number, number][];

/**
 * [KO] 지형 기본 LOD 색상의 CSS RGBA 문자열 배열(`rgba(r, g, b, 0.75)`)입니다.
 * [EN] Array of CSS RGBA strings (`rgba(r, g, b, 0.75)`) for default terrain LOD colors.
 *
 * [KO] UI나 2D 디버그 오버레이, 범례(Legend) 등 웹 렌더링에 바로 사용할 수 있도록 0.75 알파값이 적용된 RGBA 문자열을 제공합니다.
 * [EN] Provides RGBA color strings with 0.75 alpha for immediate use in web UI, 2D debug overlays, or LOD legends.
 *
 * ### Example
 * ```typescript
 * const rgbaString = RedGPU.Landscape.LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS[0]; // "rgba(59, 130, 245, 0.75)"
 * ```
 *
 * @internal
 */
export const LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS: string[] = Object.freeze(
    LANDSCAPE_DEFAULT_LOD_COLORS.map(c =>
        `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, 0.75)`
    )
) as string[];

export default LANDSCAPE_DEFAULT_LOD_COLORS;

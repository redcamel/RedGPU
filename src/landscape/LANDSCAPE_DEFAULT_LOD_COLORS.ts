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
export const LANDSCAPE_DEFAULT_LOD_COLORS: readonly [number, number, number, number][] = Object.freeze([
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
]);

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
export const LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS: readonly string[] = Object.freeze(
    LANDSCAPE_DEFAULT_LOD_COLORS.map(c =>
        `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, 0.75)`
    )
);

/**
 * [KO] 지형 기본 LOD 색상의 16진수 HEX 문자열(`#RRGGBB`) 배열입니다.
 * [EN] Array of hex color strings (`#RRGGBB`) for default terrain LOD colors.
 *
 * [KO] HTML 요소 스타일링, 컬러 피커 및 디버그 UI 컨트롤 패널과의 연동에 유용합니다.
 * [EN] Useful for HTML element styling, color pickers, and integration with debug UI control panels.
 *
 * ### Example
 * ```typescript
 * const hexString = RedGPU.Landscape.LANDSCAPE_DEFAULT_LOD_HEX_STRINGS[0]; // "#3a82f4"
 * ```
 *
 * @internal
 */
export const LANDSCAPE_DEFAULT_LOD_HEX_STRINGS: readonly string[] = Object.freeze(
    LANDSCAPE_DEFAULT_LOD_COLORS.map(c =>
        `#${Math.floor(c[0] * 255).toString(16).padStart(2, '0')}${Math.floor(c[1] * 255).toString(16).padStart(2, '0')}${Math.floor(c[2] * 255).toString(16).padStart(2, '0')}`
    )
);

/**
 * [KO] `[r, g, b, a]` 색상 배열을 CSS `rgba(...)` 문자열로 변환합니다.
 * [EN] Converts an `[r, g, b, a]` color array to a CSS `rgba(...)` string.
 *
 * ### Example
 * ```typescript
 * const rgba = RedGPU.Landscape.formatLODColorRGBA([0.23, 0.51, 0.96, 1.0], 0.8);
 * ```
 *
 * @param color -
 * [KO] 변환할 `[r, g, b, a]` 정규화 색상 배열 (각 요소 범위: 0.0 ~ 1.0)
 * [EN] Normalized `[r, g, b, a]` color array to convert (each element range: 0.0 to 1.0)
 * @param alpha -
 * [KO] 적용할 투명도 (기본값: 0.75)
 * [EN] Alpha opacity to apply (default: 0.75)
 * @returns
 * [KO] 포맷된 CSS `rgba(...)` 문자열
 * [EN] Formatted CSS `rgba(...)` string
 * @internal
 */
export function formatLODColorRGBA(color: readonly [number, number, number, number] | [number, number, number, number], alpha: number = 0.75): string {
    return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${alpha})`;
}

/**
 * [KO] `[r, g, b, a]` 색상 배열을 16진수 HEX 문자열(`#RRGGBB`)로 변환합니다.
 * [EN] Converts an `[r, g, b, a]` color array to a hex string (`#RRGGBB`).
 *
 * ### Example
 * ```typescript
 * const hex = RedGPU.Landscape.formatLODColorHex([0.23, 0.51, 0.96, 1.0]); // "#3a82f4"
 * ```
 *
 * @param color -
 * [KO] 변환할 `[r, g, b, a]` 정규화 색상 배열 (각 요소 범위: 0.0 ~ 1.0)
 * [EN] Normalized `[r, g, b, a]` color array to convert (each element range: 0.0 to 1.0)
 * @returns
 * [KO] 16진수 HEX 문자열 (`#RRGGBB`)
 * [EN] Hex color string (`#RRGGBB`)
 * @internal
 */
export function formatLODColorHex(color: readonly [number, number, number, number] | [number, number, number, number]): string {
    const r = Math.floor(color[0] * 255).toString(16).padStart(2, '0');
    const g = Math.floor(color[1] * 255).toString(16).padStart(2, '0');
    const b = Math.floor(color[2] * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

export default LANDSCAPE_DEFAULT_LOD_COLORS;

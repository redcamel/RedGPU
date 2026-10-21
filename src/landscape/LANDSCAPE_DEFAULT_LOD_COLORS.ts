/**
 * [KO] 지형 LOD 레벨(0~7) 디버그 시각화에 사용되는 기본 RGBA 색상(`0.0 ~ 1.0`) 배열입니다.
 * [EN] Default RGBA color (`0.0 to 1.0`) array used for landscape LOD level (0 to 7) debug visualization.
 *
 * @category Landscape
 */
export const LANDSCAPE_DEFAULT_LOD_COLORS: [number, number, number, number][] = Object.freeze([
    [0.23, 0.51, 0.96, 1.0],
    [0.06, 0.72, 0.51, 1.0],
    [0.92, 0.70, 0.03, 1.0],
    [0.98, 0.45, 0.09, 1.0],
    [0.94, 0.27, 0.27, 1.0],
    [0.66, 0.33, 0.97, 1.0],
    [0.93, 0.28, 0.60, 1.0],
    [0.58, 0.64, 0.72, 1.0]
]) as [number, number, number, number][];

export default LANDSCAPE_DEFAULT_LOD_COLORS;

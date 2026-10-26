import LinePointWithInOut from "./LinePointWithInOut";
/**
 * [KO] Catmull-Rom 스플라인 보간을 위해 각 정점의 진입(in) 및 진출(out) 제어점 좌표를 장력(`tension`)에 따라 계산합니다.
 * [EN] Calculates the incoming (in) and outgoing (out) control point coordinates of each vertex according to the `tension` for Catmull-Rom spline interpolation.
 *
 * @param points -
 * [KO] 제어점을 계산할 `LinePointWithInOut` 배열
 * [EN] Array of `LinePointWithInOut` for which to calculate control points
 * @param tension -
 * [KO] 스플라인 곡선의 장력 (기본값: 1)
 * [EN] Tension of the spline curve (default: 1)
 * @returns
 * [KO] 제어점 좌표가 갱신된 `LinePointWithInOut` 배열
 * [EN] Array of `LinePointWithInOut` with updated control point coordinates
 * @category Line
 */
declare const lineSolveCatmullRomPoint: (points: LinePointWithInOut[], tension?: number) => LinePointWithInOut[];
export default lineSolveCatmullRomPoint;

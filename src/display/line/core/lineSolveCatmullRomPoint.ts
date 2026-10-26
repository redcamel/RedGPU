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
const lineSolveCatmullRomPoint = (points: LinePointWithInOut[], tension: number = 1): LinePointWithInOut[] => {
    const size = points.length;
    const last = size - 2;
    for (let i = 0; i < size - 1; i++) {
        const p0 = i ? points[i - 1].linePoint.position : points[i].linePoint.position;
        const p1 = points[i].linePoint.position;
        const p2 = points[i + 1].linePoint.position;
        const p3 = i === last ? p2 : points[i + 2].linePoint.position;
        points[i].outLinePoint.position = [
            p1[0] + ((p2[0] - p0[0]) / 6) * tension,
            p1[1] + ((p2[1] - p0[1]) / 6) * tension,
            p1[2] + ((p2[2] - p0[2]) / 6) * tension,
        ];
        points[i + 1].inLinePoint.position = [
            p2[0] - ((p3[0] - p1[0]) / 6) * tension,
            p2[1] - ((p3[1] - p1[1]) / 6) * tension,
            p2[2] - ((p3[2] - p1[2]) / 6) * tension,
        ];
    }
    return points;
};
export default lineSolveCatmullRomPoint;

import LinePoint from "./LinePoint";
import LinePointWithInOut from "./LinePointWithInOut";

/**
 * [KO] 진입/진출 제어점이 포함된 정점 배열을 곡선 계산을 위한 순차적인 `LinePoint` 배열로 직렬화합니다.
 * [EN] Serializes an array of vertices containing incoming/outgoing control points into a sequential `LinePoint` array for curve calculation.
 *
 * @param points -
 * [KO] 직렬화할 `LinePointWithInOut` 배열
 * [EN] Array of `LinePointWithInOut` to serialize
 * @returns
 * [KO] 직렬화된 `LinePoint` 배열
 * [EN] Serialized array of `LinePoint`
 * @category Line
 */
const lineSerializePoints = (points: LinePointWithInOut[]): LinePoint[] => {
    let newPointList: LinePoint[] = [];
    let i = 0;
    let index = 0;
    let targetPoint: LinePointWithInOut;
    const len = points.length;
    for (i; i < len; i++) {
        targetPoint = points[i];
        const {inLinePoint, linePoint, outLinePoint} = targetPoint
        if (index === 0) {
            newPointList[index++] = linePoint;
            newPointList[index++] = outLinePoint;
        } else {
            newPointList[index++] = inLinePoint;
            newPointList[index++] = linePoint;
            if (points[i + 1]) newPointList[index++] = outLinePoint;
        }
    }
    return newPointList;
};
export default lineSerializePoints

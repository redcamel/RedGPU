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
declare const lineSerializePoints: (points: LinePointWithInOut[]) => LinePoint[];
export default lineSerializePoints;

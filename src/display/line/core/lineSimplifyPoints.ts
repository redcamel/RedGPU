import LinePoint from "./LinePoint";
import lineVec2DistanceToSegmentSq from "./lineVec2DistanceToSegmentSq";

/**
 * [KO] 라머-더글라스-포이커(Ramer-Douglas-Peucker) 알고리즘을 사용하여 허용 오차(`epsilon`)에 따라 선 정점 배열을 단순화합니다.
 * [EN] Simplifies an array of line vertices according to the tolerance (`epsilon`) using the Ramer-Douglas-Peucker algorithm.
 *
 * @param points -
 * [KO] 대상 `LinePoint` 배열
 * [EN] Target array of `LinePoint`
 * @param start -
 * [KO] 검사 시작 인덱스
 * [EN] Start index for inspection
 * @param end -
 * [KO] 검사 종료 인덱스
 * [EN] End index for inspection
 * @param epsilon -
 * [KO] 단순화 허용 오차 거리
 * [EN] Simplification tolerance distance
 * @param newPoints -
 * [KO] 결과를 누적할 출력 배열 (선택)
 * [EN] Output array to accumulate results (optional)
 * @returns
 * [KO] 단순화된 `LinePoint` 배열
 * [EN] Simplified array of `LinePoint`
 * @category Line
 */
const lineSimplifyPoints = (points: LinePoint[], start: number, end: number, epsilon: number, newPoints?: LinePoint[]) => {
    let outPoints = newPoints || [];
    let s = points[start];
    let e = points[end - 1];
    let maxDistSq = 0;
    let maxNdx = 1;
    let i = start + 1;
    for (i; i < end - 1; ++i) {
        let distSq = lineVec2DistanceToSegmentSq(points[i].position, s.position, e.position);
        if (distSq > maxDistSq) {
            maxDistSq = distSq;
            maxNdx = i;
        }
    }
    if (Math.sqrt(maxDistSq) > epsilon) {
        lineSimplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
        lineSimplifyPoints(points, maxNdx, end, epsilon, outPoints);
    } else outPoints.push(s, e);
    return outPoints;
};
export default lineSimplifyPoints

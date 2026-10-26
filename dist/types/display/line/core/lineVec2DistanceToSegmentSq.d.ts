/**
 * [KO] 2차원 평면상에서 특정 점(`p`)과 선분(`iP` ~ `oP`) 사이의 최단 거리 제곱값을 계산합니다.
 * [EN] Calculates the squared shortest distance between a point (`p`) and a line segment (`iP` to `oP`) on a 2D plane.
 *
 * @param p -
 * [KO] 거리를 측정할 대상 점 좌표
 * [EN] Target point coordinates to measure distance from
 * @param iP -
 * [KO] 선분의 시작점 좌표
 * [EN] Start point coordinates of the line segment
 * @param oP -
 * [KO] 선분의 끝점 좌표
 * [EN] End point coordinates of the line segment
 * @returns
 * [KO] 점과 선분 사이의 최단 거리 제곱값
 * [EN] Squared shortest distance between the point and the line segment
 * @category Line
 */
declare const lineVec2DistanceToSegmentSq: (p: any, iP: any, oP: any) => number;
export default lineVec2DistanceToSegmentSq;

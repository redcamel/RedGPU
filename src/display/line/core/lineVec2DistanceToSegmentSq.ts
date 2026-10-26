import {vec2} from "gl-matrix";

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
const lineVec2DistanceToSegmentSq = function (p, iP, oP) {
    p = [p[0], p[1]]
    iP = [iP[0], iP[1]]
    oP = [oP[0], oP[1]]
    let l2 = vec2.sqrDist(iP, oP);
    if (l2 === 0) return vec2.sqrDist(p, iP);
    let t = ((p[0] - iP[0]) * (oP[0] - iP[0]) + (p[1] - iP[1]) * (oP[1] - iP[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return vec2.sqrDist(p, vec2.lerp([0, 0], iP, oP, t));
};
export default lineVec2DistanceToSegmentSq

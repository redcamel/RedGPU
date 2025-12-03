import {vec2} from "gl-matrix";

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

import lineVec2DistanceToSegmentSq from "./lineVec2DistanceToSegmentSq";
const lineSimplifyPoints = (points, start, end, epsilon, newPoints) => {
    let outPoints = newPoints || [];
    // find the most distant point from the line formed by the endpoints
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
    // if that point is too far
    if (Math.sqrt(maxDistSq) > epsilon) {
        // split
        lineSimplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
        lineSimplifyPoints(points, maxNdx, end, epsilon, outPoints);
    }
    else
        outPoints.push(s, e); // add the 2 end points
    return outPoints;
};
export default lineSimplifyPoints;

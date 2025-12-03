import {vec3} from "gl-matrix";
import LinePoint from "./LinePoint";

const flatness = (points: LinePoint[], offset: number) => {
    let p1 = points[offset].position;
    let c1 = points[offset + 1].position;
    let c2 = points[offset + 2].position;
    let p4 = points[offset + 3].position;
    let ux = 3 * c1[0] - 2 * p1[0] - p4[0];
    let uy = 3 * c1[1] - 2 * p1[1] - p4[1];
    let vx = 3 * c2[0] - 2 * p4[0] - p1[0];
    let vy = 3 * c2[1] - 2 * p4[1] - p1[1];
    ux *= ux
    uy *= uy
    vx *= vx
    vy *= vy;
    if (ux < vx) ux = vx;
    if (uy < vy) uy = vy;
    return ux + uy;
};
const getPointsOnBezierCurveWithSplitting = (points: LinePoint[], offset: number, tolerance: number, newPoints: LinePoint[]): LinePoint[] => {
    let outPoints = newPoints || [];
    if (flatness(points, offset) < tolerance) outPoints.push(points[offset], points[offset + 3]);
    else {
        // subdivide
        let t = .5;
        let p1 = points[offset];
        let c1 = points[offset + 1];
        let c2 = points[offset + 2];
        let p2 = points[offset + 3];/**/
        let q1: any = vec3.lerp(vec3.create(), p1.position, c1.position, t);
        let q2 = vec3.lerp(vec3.create(), c1.position, c2.position, t);
        let q3: any = vec3.lerp(vec3.create(), c2.position, p2.position, t);/**/
        let r1: any = vec3.lerp(vec3.create(), q1, q2, t);
        let r2: any = vec3.lerp(vec3.create(), q2, q3, t);/**/
        let red: any = vec3.lerp(vec3.create(), r1, r2, t);
        red = new LinePoint(
            red[0], red[1], red[2],
            p1.colorRGBA
        )
        q1 = new LinePoint(
            q1[0], q1[1], q1[2],
            q1.colorRGBA
        )
        q3 = new LinePoint(
            q3[0], q3[1], q3[2],
            q3.colorRGBA
        )
        r1 = new LinePoint(
            r1[0], r1[1], r1[2],
            r1.colorRGBA
        )
        r2 = new LinePoint(
            r2[0], r2[1], r2[2],
            r2.colorRGBA
        )
        // console.log([p1, q1, r1, red])
        // do 1st half
        getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
        // do 2nd half
        getPointsOnBezierCurveWithSplitting([red, r2, q3, p2], 0, tolerance, outPoints);
    }
    return outPoints;
};
const lineGetPointsOnBezierCurves = (points: LinePoint[], tolerance: number) => {
    let newPoints = [];
    let numSegments = (points.length - 1) / 3;
    numSegments = Math.floor(numSegments);
    let i = 0;
    let offset: number;
    for (i; i < numSegments; ++i) {
        offset = i * 3;
        getPointsOnBezierCurveWithSplitting(points, offset, tolerance, newPoints);
    }
    return newPoints;
};
export default lineGetPointsOnBezierCurves

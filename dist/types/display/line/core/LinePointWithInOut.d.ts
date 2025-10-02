import LinePoint from "./LinePoint";
declare class LinePointWithInOut {
    inLinePoint: LinePoint;
    linePoint: LinePoint;
    outLinePoint: LinePoint;
    constructor(x: number, y: number, z: number, inX: number, inY: number, inZ: number, outX: number, outY: number, outZ: number, color: any, colorAlpha: any);
}
export default LinePointWithInOut;

import convertHexToRgb from "../../../utils/convertColor/convertHexToRgb";
import LinePoint from "./LinePoint";

class LinePointWithInOut {
    inLinePoint: LinePoint
    linePoint: LinePoint
    outLinePoint: LinePoint

    constructor(
        x = 0, y = 0, z = 0,
        inX = 0, inY = 0, inZ = 0,
        outX = 0, outY = 0, outZ = 0,
        color,
        colorAlpha
    ) {
        let t0: any = [...convertHexToRgb(color, true)];
        t0 = [t0[0] / 255, t0[1] / 255, t0[2] / 255, colorAlpha];
        console.log('t0', t0)
        this.inLinePoint = new LinePoint(inX, inY, inZ, t0);
        this.linePoint = new LinePoint(x, y, z, t0);
        this.outLinePoint = new LinePoint(outX, outY, outZ, t0);
    }
}

// Object.freeze(LinePointWithInOut)
export default LinePointWithInOut

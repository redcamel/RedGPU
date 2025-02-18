import LinePoint from "./LinePoint";
import LinePointWithInOut from "./LinePointWithInOut";

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
            //
        } else {
            newPointList[index++] = inLinePoint;
            newPointList[index++] = linePoint;
            if (points[i + 1]) newPointList[index++] = outLinePoint;
        }
    }
    return newPointList;
};
export default lineSerializePoints

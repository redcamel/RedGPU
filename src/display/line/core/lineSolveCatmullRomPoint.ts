import LinePointWithInOut from "./LinePointWithInOut";

const lineSolveCatmullRomPoint = (points: LinePointWithInOut[], tension: number = 1): LinePointWithInOut[] => {
    const size = points.length;
    const last = size - 2;
    for (let i = 0; i < size - 1; i++) {
        const p0 = i ? points[i - 1].linePoint.position : points[i].linePoint.position;
        const p1 = points[i].linePoint.position;
        const p2 = points[i + 1].linePoint.position;
        const p3 = i === last ? p2 : points[i + 2].linePoint.position;
        points[i].outLinePoint.position = [
            p1[0] + ((p2[0] - p0[0]) / 6) * tension,
            p1[1] + ((p2[1] - p0[1]) / 6) * tension,
            p1[2] + ((p2[2] - p0[2]) / 6) * tension,
        ];
        points[i + 1].inLinePoint.position = [
            p2[0] - ((p3[0] - p1[0]) / 6) * tension,
            p2[1] - ((p3[1] - p1[1]) / 6) * tension,
            p2[2] - ((p3[2] - p1[2]) / 6) * tension,
        ];
    }
    return points;
};
export default lineSolveCatmullRomPoint;

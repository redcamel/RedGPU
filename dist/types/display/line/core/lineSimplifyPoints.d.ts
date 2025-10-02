import LinePoint from "./LinePoint";
declare const lineSimplifyPoints: (points: LinePoint[], start: number, end: number, epsilon: number, newPoints?: LinePoint[]) => LinePoint[];
export default lineSimplifyPoints;

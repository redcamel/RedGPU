import LinePoint from "./LinePoint";
/**
 * [KO] 직렬화된 베지어 제어점 배열을 허용 오차(`tolerance`) 기준으로 재귀 분할하여 곡선 상의 샘플 정점 배열을 생성합니다.
 * [EN] Recursively subdivides a serialized Bezier control point array based on `tolerance` to generate sampled points along the curve.
 *
 * @param points -
 * [KO] 직렬화된 베지어 제어점(`LinePoint`) 배열
 * [EN] Array of serialized Bezier control points (`LinePoint`)
 * @param tolerance -
 * [KO] 곡선 평탄도 분할 허용 오차
 * [EN] Curve flatness subdivision tolerance
 * @returns
 * [KO] 샘플링된 `LinePoint` 배열
 * [EN] Sampled `LinePoint` array
 * @category Line
 */
declare const lineGetPointsOnBezierCurves: (points: LinePoint[], tolerance: number) => any[];
export default lineGetPointsOnBezierCurves;

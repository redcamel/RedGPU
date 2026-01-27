/**
 * [KO] 3D 및 2D 공간에서 직선과 곡선을 표현할 수 있는 라인 시스템을 제공합니다.
 * [EN] Provides a line system capable of representing straight lines and curves in 3D and 2D space.
 *
 * [KO] 점들의 집합을 통해 경로를 구성하며, 베지어(Bezier) 및 캣멀-롬(Catmull-Rom) 곡선 보간과 단순화 알고리즘을 지원합니다.
 * [EN] It constructs paths through sets of points and supports Bezier and Catmull-Rom curve interpolation along with simplification algorithms.
 *
 * @packageDocumentation
 */
import Line2D from "./Line2D";
import Line3D from "./Line3D";
import LINE_TYPE from "./LINE_TYPE";
export { Line2D, Line3D, LINE_TYPE };

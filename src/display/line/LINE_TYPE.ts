/**
 * [KO] `Line2D` 및 `Line3D`에서 지원하는 라인 보간 방식 상수입니다.
 * [EN] Constants for line interpolation types supported by `Line2D` and `Line3D`.
 *
 * ### Example
 * ```typescript
 * const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.CATMULL_ROM);
 * ```
 *
 * @category Line
 */
const LINE_TYPE = {
    /**
     * [KO] 정점 사이를 직선으로 연결하는 선형 보간
     * [EN] Linear interpolation connecting points with straight lines
     */
    LINEAR: 'linear',
    /**
     * [KO] 정점들을 부드럽게 통과하는 캣멀-롬(Catmull-Rom) 스플라인 곡선 보간
     * [EN] Catmull-Rom spline curve interpolation passing smoothly through points
     */
    CATMULL_ROM: 'catmullRom',
    /**
     * [KO] 진입/진출 탄젠트 제어점을 사용하는 3차 베지어(Cubic Bezier) 곡선 보간
     * [EN] Cubic Bezier curve interpolation using in/out tangent control points
     */
    BEZIER: 'bezier'
} as const
/**
 * [KO] 라인 보간 타입 유니온 타입입니다.
 * [EN] Union type representing line interpolation types.
 *
 * @category Line
 */
type LINE_TYPE = typeof LINE_TYPE[keyof typeof LINE_TYPE];
Object.freeze(LINE_TYPE)
export default LINE_TYPE

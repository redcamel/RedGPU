import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] TorusKnot(매듭 토러스) 기본 도형 클래스입니다.
 * [EN] TorusKnot primitive geometry class.
 *
 * ### Example
 * ```typescript
 * // [KO] p=2, q=3 매듭 토러스 생성
 * // [EN] Create a torus knot with p=2, q=3
 * const torusKnot = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 128, 16, 2, 3);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/torusKnot/" style="width:100%; height:500px;"></iframe>
 *
 * @see [TorusKnot Basic Example](/RedGPU/examples/3d/primitive/torusKnot/)
 * @see [Primitives Overview Example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
class TorusKnot extends Primitive {
    /**
     * [KO] TorusKnot 인스턴스를 생성합니다.
     * [EN] Creates a TorusKnot instance.
     *
     * ### Example
     * ```typescript
     * const torusKnot = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 64, 8, 2, 3);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 전체 반지름 (기본값: 1)
     * [EN] Overall radius (default: 1)
     * @param tubeRadius -
     * [KO] 튜브 단면 반지름 (기본값: 0.4)
     * [EN] Tube cross-section radius (default: 0.4)
     * @param tubularSegments -
     * [KO] 둘레 방향 세그먼트 수 (기본값: 64, 최소: 3)
     * [EN] Number of tubular segments (default: 64, min: 3)
     * @param radialSegments -
     * [KO] 단면 방향 세그먼트 수 (기본값: 8, 최소: 3)
     * [EN] Number of radial segments (default: 8, min: 3)
     * @param windingsAroundAxis -
     * [KO] 중심축 기준 회전 횟수 p (기본값: 2)
     * [EN] Number of windings around the central axis p (default: 2)
     * @param windingsAroundCircle -
     * [KO] 토러스 내부 원 기준 회전 횟수 q (기본값: 3)
     * [EN] Number of windings around the interior circle q (default: 3)
     */
    constructor(redGPUContext: RedGPUContext,
                radius: number = 1,
                tubeRadius: number = 0.4,
                tubularSegments: number = 64,
                radialSegments: number = 8,
                windingsAroundAxis: number = 2,
                windingsAroundCircle: number = 3
    ) {
        const uniqueKey = Primitive.generateUniqueKey('TORUS_KNOT', {
            radius,
            tubeRadius,
            tubularSegments,
            radialSegments,
            windingsAroundAxis,
            windingsAroundCircle
        });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateTorusKnotData(
            redGPUContext, radius, tubeRadius, tubularSegments, radialSegments,
            windingsAroundAxis, windingsAroundCircle, uniqueKey
        ));
    }
}

export default TorusKnot;

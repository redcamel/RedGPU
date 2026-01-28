import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] TorusKnot(토러스-노트, 매듭 토러스) 기본 도형 클래스입니다.
 * [EN] TorusKnot primitive geometry class.
 *
 * [KO] 반지름, 튜브 두께, 매듭 파라미터 등을 기반으로 3D 매듭형 도넛 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D torus knot data based on radius, tube thickness, knot parameters, etc.
 *
 * * ### Example
 * ```typescript
 * // p=2, q=3 매듭 토러스 생성
 * const torusKnot = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 128, 16, 2, 3);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torusNut/"></iframe>
 * @category Primitive
 */
declare class TorusKnot extends Primitive {
    #private;
    /**
     * [KO] TorusKnot 인스턴스를 생성합니다.
     * [EN] Creates an instance of TorusKnot.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 전체 반지름 (기본값 1)
     * [EN] Overall radius (default 1)
     * @param tube -
     * [KO] 튜브(단면) 반지름 (기본값 0.4)
     * [EN] Tube radius (default 0.4)
     * @param tubularSegments -
     * [KO] 둘레 세그먼트 수 (기본값 64, 최소 3)
     * [EN] Tubular segments (default 64, min 3)
     * @param radialSegments -
     * [KO] 단면 세그먼트 수 (기본값 8, 최소 3)
     * [EN] Radial segments (default 8, min 3)
     * @param p -
     * [KO] 매듭 파라미터 p (기본값 2)
     * [EN] Knot parameter p (default 2)
     * @param q -
     * [KO] 매듭 파라미터 q (기본값 3)
     * [EN] Knot parameter q (default 3)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, tube?: number, tubularSegments?: number, radialSegments?: number, p?: number, q?: number);
}
export default TorusKnot;

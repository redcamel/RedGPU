import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * TorusKnot(토러스-노트, 매듭 토러스) 기본 도형 클래스입니다.
 * 반지름, 튜브 두께, 세그먼트, 매듭 파라미터(p, q) 등 다양한 파라미터로 3D 매듭형 도넛 메시를 생성합니다.
 *
 * @example
 * ```javascript
 * // 반지름 1, 튜브 0.4, 128x16 세그먼트, p=2, q=3 토러스-노트 생성 및 씬에 추가
 * const torusKnot = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 128, 16, 2, 3);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torusNut/"></iframe>
 */
declare class TorusKnot extends Primitive {
    #private;
    /**
     * TorusKnot 인스턴스를 생성합니다.
     * @param redGPUContext RedGPUContext 인스턴스
     * @param radius 중심 원 반지름 (기본값 1)
     * @param tube 튜브(단면) 반지름 (기본값 0.4)
     * @param tubularSegments 둘레 세그먼트 수 (기본값 64, 최소 3)
     * @param radialSegments 단면 세그먼트 수 (기본값 8, 최소 3)
     * @param p 매듭 파라미터 p (기본값 2)
     * @param q 매듭 파라미터 q (기본값 3)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, tube?: number, tubularSegments?: number, radialSegments?: number, p?: number, q?: number);
}
export default TorusKnot;

import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * Box(박스) 기본 도형 클래스입니다.
 * 6면체 박스의 정점/인덱스 데이터를 생성하여 Primitive으로 관리합니다. Mesh의 geometry로 사용됩니다.
 *
 * @example
 * ```javascript
 * const boxGeometry = new RedGPU.Primitive.Box(redGPUContext);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/box/"></iframe>
 */
declare class Box extends Primitive {
    #private;
    /**
     * Box 생성자
     * @param redGPUContext RedGPUContext 인스턴스
     * @param width 박스 너비 (기본값 1)
     * @param height 박스 높이 (기본값 1)
     * @param depth 박스 깊이 (기본값 1)
     * @param wSegments X축 세그먼트 수 (기본값 1)
     * @param hSegments Y축 세그먼트 수 (기본값 1)
     * @param dSegments Z축 세그먼트 수 (기본값 1)
     * @param uvSize UV 스케일 (기본값 1)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, depth?: number, wSegments?: number, hSegments?: number, dSegments?: number, uvSize?: number);
}
export default Box;

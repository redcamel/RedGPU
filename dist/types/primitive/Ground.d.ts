import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * Ground(그라운드) 기본 도형 클래스입니다.
 * XZ 평면에 배치된 평면 메시로, 세그먼트, UV 스케일, Y축 뒤집기 등 다양한 파라미터를 지원합니다.
 *
 * @example
 * ```javascript
 * // 10x10 크기, 10x10 세그먼트, UV 2배, Y축 뒤집기 없이 생성 및 씬에 추가
 * const ground = new RedGPU.Primitive.Ground(redGPUContext, 10, 10, 10, 10, 2, false);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/ground/"></iframe>
 */
declare class Ground extends Primitive {
    #private;
    /**
     * Ground 생성자
     * @param redGPUContext RedGPUContext 인스턴스
     * @param width 가로 길이 (기본값 1)
     * @param height 세로 길이 (기본값 1)
     * @param wSegments X축 세그먼트 수 (기본값 1)
     * @param hSegments Z축 세그먼트 수 (기본값 1)
     * @param uvSize UV 스케일 (기본값 1)
     * @param flipY Y축 UV 뒤집기 여부 (기본값 false)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, wSegments?: number, hSegments?: number, uvSize?: number, flipY?: boolean);
}
export default Ground;

import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] Plane(평면) 기본 도형 클래스입니다.
 * [EN] Plane primitive geometry class.
 *
 * [KO] XY 평면에 배치된 평면 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages planar data placed on the XY plane.
 *
 * ### Example
 * ```typescript
 * // 5x5 크기의 평면 생성
 * const plane = new RedGPU.Plane(redGPUContext, 5, 5);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/plane/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
declare class Plane extends Primitive {
    #private;
    /**
     * [KO] Plane 인스턴스를 생성합니다.
     * [EN] Creates an instance of Plane.
     *
     * ### Example
     * ```typescript
     * const plane = new RedGPU.Plane(redGPUContext, 1, 1, 1, 1, 1, false);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로 길이 (기본값 1)
     * [EN] Width (default 1)
     * @param height -
     * [KO] 세로 길이 (기본값 1)
     * [EN] Height (default 1)
     * @param wSegments -
     * [KO] 가로(X축) 세그먼트 수 (기본값 1)
     * [EN] Width (X-axis) segments (default 1)
     * @param hSegments -
     * [KO] 세로(Y축) 세그먼트 수 (기본값 1)
     * [EN] Height (Y-axis) segments (default 1)
     * @param uvSize -
     * [KO] UV 스케일 (기본값 1)
     * [EN] UV scale (default 1)
     * @param flipY -
     * [KO] Y축 UV 뒤집기 여부 (기본값 false)
     * [EN] Whether to flip UV on the Y-axis (default false)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, wSegments?: number, hSegments?: number, uvSize?: number, flipY?: boolean);
}
export default Plane;

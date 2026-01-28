import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] Ground(그라운드) 기본 도형 클래스입니다.
 * [EN] Ground primitive geometry class.
 *
 * [KO] XZ 평면에 배치된 평면 데이터를 생성하여 관리합니다. 주로 바닥이나 지형의 기반으로 사용됩니다.
 * [EN] Generates and manages planar data placed on the XZ plane. Primarily used as a base for floors or terrain.
 *
 * * ### Example
 * ```typescript
 * // 10x10 크기의 그라운드 생성
 * const ground = new RedGPU.Primitive.Ground(redGPUContext, 10, 10);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/ground/"></iframe>
 * @category Primitive
 */
declare class Ground extends Primitive {
    #private;
    /**
     * [KO] Ground 인스턴스를 생성합니다.
     * [EN] Creates an instance of Ground.
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
     * [KO] 세로(Z축) 세그먼트 수 (기본값 1)
     * [EN] Height (Z-axis) segments (default 1)
     * @param uvSize -
     * [KO] UV 스케일 (기본값 1)
     * [EN] UV scale (default 1)
     * @param flipY -
     * [KO] Y축 UV 뒤집기 여부 (기본값 false)
     * [EN] Whether to flip UV on the Y-axis (default false)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, wSegments?: number, hSegments?: number, uvSize?: number, flipY?: boolean);
}
export default Ground;

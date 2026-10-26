import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] XZ 평면(수평면)에 배치된 바닥 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a horizontal plane placed on the XZ plane.
 *
 * ### Example
 * ```typescript
 * const ground = new RedGPU.Primitive.Ground(redGPUContext, 10, 10, 1, 1, false);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/ground/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Ground example](/RedGPU/examples/3d/primitive/ground/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
declare class Ground extends Primitive {
    /**
     * [KO] Ground 인스턴스를 생성합니다.
     * [EN] Creates an instance of Ground.
     *
     * ### Example
     * ```typescript
     * const ground = new RedGPU.Primitive.Ground(redGPUContext, 10, 10, 1, 1, false);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로(X축) 길이 (기본값: 1)
     * [EN] Width along the X-axis (default: 1)
     * @param height -
     * [KO] 세로(Z축) 길이 (기본값: 1)
     * [EN] Depth along the Z-axis (default: 1)
     * @param widthSegments -
     * [KO] 가로(X축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the X-axis (default: 1)
     * @param heightSegments -
     * [KO] 세로(Z축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the Z-axis (default: 1)
     * @param flipY -
     * [KO] Y축 UV 좌표 반전 여부 (기본값: false)
     * [EN] Whether to flip UV coordinates along the Y-axis (default: false)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, widthSegments?: number, heightSegments?: number, flipY?: boolean);
}
export default Ground;

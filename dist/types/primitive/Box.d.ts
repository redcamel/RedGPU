import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] 6면체 박스 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a hexahedral box.
 *
 * ### Example
 * ```typescript
 * const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1, 1, 1, 1);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/box/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Box example](/RedGPU/examples/3d/primitive/box/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
declare class Box extends Primitive {
    /**
     * [KO] Box 인스턴스를 생성합니다.
     * [EN] Creates an instance of Box.
     *
     * ### Example
     * ```typescript
     * const box = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1, 1, 1, 1);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로(X축) 길이 (기본값: 1)
     * [EN] Width along the X-axis (default: 1)
     * @param height -
     * [KO] 세로(Y축) 길이 (기본값: 1)
     * [EN] Height along the Y-axis (default: 1)
     * @param depth -
     * [KO] 깊이(Z축) 길이 (기본값: 1)
     * [EN] Depth along the Z-axis (default: 1)
     * @param widthSegments -
     * [KO] 가로(X축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the X-axis (default: 1)
     * @param heightSegments -
     * [KO] 세로(Y축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the Y-axis (default: 1)
     * @param depthSegments -
     * [KO] 깊이(Z축) 분할 수 (기본값: 1)
     * [EN] Number of segments along the Z-axis (default: 1)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number);
}
export default Box;

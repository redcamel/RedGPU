import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] Box(박스) 기본 도형 클래스입니다.
 * [EN] Box primitive geometry class.
 *
 * [KO] 6면체 박스의 정점 및 인덱스 데이터를 생성하여 관리하며, Mesh의 geometry로 사용됩니다.
 * [EN] Generates and manages vertex and index data for a hexahedral box, used as geometry for a Mesh.
 *
 * ### Example
 * ```typescript
 * const boxGeometry = new RedGPU.Box(redGPUContext);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/box/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
declare class Box extends Primitive {
    /**
     * [KO] Box 인스턴스를 생성합니다.
     * [EN] Creates an instance of Box.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 박스 너비 (기본값 1) [EN] Box width (default 1)
     * @param height - [KO] 박스 높이 (기본값 1) [EN] Box height (default 1)
     * @param depth - [KO] 박스 깊이 (기본값 1) [EN] Box depth (default 1)
     * @param widthSegments - [KO] 가로(X축) 세그먼트 수 (기본값 1) [EN] Width (X-axis) segments (default 1)
     * @param heightSegments - [KO] 세로(Y축) 세그먼트 수 (기본값 1) [EN] Height (Y-axis) segments (default 1)
     * @param depthSegments - [KO] 깊이(Z축) 세그먼트 수 (기본값 1) [EN] Depth (Z-axis) segments (default 1)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number);
}
export default Box;

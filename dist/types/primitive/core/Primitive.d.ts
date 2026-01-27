import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import AABB from "../../bound/AABB";
/**
 * [KO] 모든 기본 도형(Primitive)의 기반이 되는 베이스 클래스입니다.
 * [EN] Base class for all primitive geometries.
 *
 * [KO] 정점 버퍼, 인덱스 버퍼, GPU 렌더 레이아웃 정보 및 AABB 바운딩 박스를 관리합니다.
 * [EN] Manages vertex buffers, index buffers, GPU render layout information, and AABB bounding boxes.
 *
 * * ### Example
 * ```typescript
 * const primitive = new RedGPU.Primitive.Core.Primitive(redGPUContext);
 * ```
 * @category Core
 */
declare class Primitive {
    #private;
    /**
     * [KO] Primitive 인스턴스를 생성합니다.
     * [EN] Creates an instance of Primitive.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 기본 정점 레이아웃 구조(Position, Normal, UV)를 반환합니다.
     * [EN] Returns the default vertex layout structure (Position, Normal, UV).
     *
     * @returns
     * [KO] 정점 인터리브 구조 객체
     * [EN] Vertex interleaved struct object
     */
    static get primitiveInterleaveStruct(): VertexInterleavedStruct;
    /**
     * [KO] GPU 렌더 정보를 반환합니다.
     * [EN] Returns the GPU render information.
     *
     * @returns
     * [KO] 버퍼 레이아웃 배열을 포함한 객체
     * [EN] Object containing buffer layouts array
     */
    get gpuRenderInfo(): {
        buffers: GPUVertexBufferLayout[];
    };
    /**
     * [KO] 현재 정점 버퍼를 반환합니다.
     * [EN] Returns the current vertex buffer.
     *
     * @returns
     * [KO] VertexBuffer 인스턴스
     * [EN] VertexBuffer instance
     */
    get vertexBuffer(): VertexBuffer;
    /**
     * [KO] 현재 인덱스 버퍼를 반환합니다.
     * [EN] Returns the current index buffer.
     *
     * @returns
     * [KO] IndexBuffer 인스턴스
     * [EN] IndexBuffer instance
     */
    get indexBuffer(): IndexBuffer;
    /**
     * [KO] 지오메트리의 AABB 바운딩 볼륨을 반환합니다.
     * [EN] Returns the AABB bounding volume of the geometry.
     *
     * @returns
     * [KO] AABB 인스턴스
     * [EN] AABB instance
     */
    get volume(): AABB;
    /**
     * [KO] 지오메트리 데이터를 통해 내부 버퍼와 렌더 정보를 설정합니다.
     * [EN] Sets internal buffers and render information using geometry data.
     *
     * @param geometry -
     * [KO] 설정할 Geometry 인스턴스
     * [EN] Geometry instance to set
     * @internal
     */
    _setData(geometry: Geometry): void;
}
export default Primitive;

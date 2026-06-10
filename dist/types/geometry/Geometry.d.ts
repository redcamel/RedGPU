import RedGPUContext from "../context/RedGPUContext";
import GeometryGPURenderInfo from "../primitive/core/GeometryGPURenderInfo";
import IndexBuffer from "../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../resources/buffer/vertexBuffer/VertexBuffer";
import ResourceBase from "../resources/core/ResourceBase";
import AABB from "../bound/AABB";
/**
 * [KO] 정점 버퍼(VertexBuffer)와 인덱스 버퍼(IndexBuffer)를 관리하며, GPU 렌더링에 필요한 정보를 제공하는 클래스입니다.
 * [EN] A class that manages vertex buffers (VertexBuffer) and index buffers (IndexBuffer) and provides information required for GPU rendering.
 *
 * [KO] 정점 데이터와 인덱스 데이터를 결합하여 하나의 지오메트리 단위를 형성하며, GPU 파이프라인에 필요한 레이아웃 정보와 객체의 AABB(경계 상자) 정보를 캡슐화합니다.
 * [EN] Forms a single geometry unit by combining vertex and index data, encapsulating layout information required for the GPU pipeline and AABB (Bounding Box) information of the object.
 *
 * * ### Example
 * ```typescript
 * const geometry = new RedGPU.Geometry(redGPUContext, vertexBuffer, indexBuffer);
 * const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
 * ```
 * @extends ResourceBase
 * @category Geometry
 */
declare class Geometry extends ResourceBase {
    #private;
    /**
     * [KO] GPU 파이프라인에 필요한 레이아웃 정보
     * [EN] Layout information required for GPU pipeline
     */
    gpuRenderInfo: GeometryGPURenderInfo;
    /**
     * [KO] Geometry 인스턴스를 생성합니다.
     * [EN] Creates a Geometry instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param vertexBuffer -
     * [KO] 정점 버퍼
     * [EN] Vertex buffer
     * @param indexBuffer -
     * [KO] 인덱스 버퍼 (선택)
     * [EN] Index buffer (optional)
     */
    constructor(redGPUContext: RedGPUContext, vertexBuffer: VertexBuffer, indexBuffer?: IndexBuffer);
    /**
     * [KO] 정점 버퍼를 반환합니다.
     * [EN] Returns the vertex buffer.
     */
    get vertexBuffer(): VertexBuffer;
    /**
     * [KO] 인덱스 버퍼를 반환합니다.
     * [EN] Returns the index buffer.
     */
    get indexBuffer(): IndexBuffer;
    /**
     * [KO] 정점 버퍼 기준 AABB(경계 상자) 정보를 반환합니다. 최초 접근 시 계산 후 캐싱됩니다.
     * [EN] Returns the AABB (Axis-Aligned Bounding Box) information based on the vertex buffer. It is calculated and cached on the first access.
     *
     * @returns
     * [KO] AABB 정보
     * [EN] AABB information
     */
    get volume(): AABB;
}
export default Geometry;

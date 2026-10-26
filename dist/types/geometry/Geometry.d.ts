import RedGPUContext from "../context/RedGPUContext";
import GeometryGPURenderInfo from "../primitive/core/GeometryGPURenderInfo";
import IndexBuffer from "../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../resources/buffer/vertexBuffer/VertexBuffer";
import ResourceBase from "../resources/core/ResourceBase";
import AABB from "../bound/AABB";
/**
 * [KO] 정점 버퍼(`VertexBuffer`)와 인덱스 버퍼(`IndexBuffer`)를 결합하여 GPU 렌더링 레이아웃 및 AABB 경계 상자 정보를 관리하는 지오메트리 클래스입니다.
 * [EN] Geometry class that combines a vertex buffer (`VertexBuffer`) and an index buffer (`IndexBuffer`) to manage GPU rendering layout and AABB bounding box information.
 *
 * ### Example
 * ```typescript
 * const geometry = new RedGPU.Geometry(redGPUContext, vertexBuffer, indexBuffer);
 * const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
 * ```
 *
 * @category Geometry
 */
declare class Geometry extends ResourceBase {
    #private;
    /**
     * [KO] GPU 파이프라인 구성에 필요한 정점 버퍼 레이아웃 정보
     * [EN] Vertex buffer layout information required for GPU pipeline configuration
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
     *
     * @returns
     * [KO] 정점 버퍼 인스턴스
     * [EN] VertexBuffer instance
     */
    get vertexBuffer(): VertexBuffer;
    /**
     * [KO] 인덱스 버퍼를 반환합니다.
     * [EN] Returns the index buffer.
     *
     * @returns
     * [KO] 인덱스 버퍼 인스턴스
     * [EN] IndexBuffer instance
     */
    get indexBuffer(): IndexBuffer;
    /**
     * [KO] 정점 버퍼 기준 AABB(축 정렬 경계 상자) 정보를 반환합니다. 최초 접근 시 계산 후 캐싱됩니다.
     * [EN] Returns the AABB (Axis-Aligned Bounding Box) information based on the vertex buffer. Calculated and cached upon first access.
     *
     * @returns
     * [KO] 계산된 AABB 인스턴스
     * [EN] Calculated AABB instance
     */
    get volume(): AABB;
    /**
     * [KO] Geometry 인스턴스를 파기하고 할당된 정점 및 인덱스 GPU 버퍼를 해제합니다.
     * [EN] Destroys the Geometry instance and releases the allocated vertex and index GPU buffers.
     */
    destroy(): void;
}
export default Geometry;

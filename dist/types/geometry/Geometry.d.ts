import RedGPUContext from "../context/RedGPUContext";
import GeometryGPURenderInfo from "../primitive/core/GeometryGPURenderInfo";
import IndexBuffer from "../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../resources/buffer/vertexBuffer/VertexBuffer";
import ResourceBase from "../resources/core/ResourceBase";
import AABB from "../utils/math/bound/AABB";
/**
 * Geometry 클래스는 정점 버퍼(VertexBuffer)와 인덱스 버퍼(IndexBuffer)를 관리하며,
 * GPU 렌더링에 필요한 정보를 제공하는 역할을 합니다.
 *
 * - 정점 버퍼, 인덱스 버퍼, AABB(경계 상자) 정보를 캡슐화합니다.
 * - 버퍼 변경 시 AABB를 자동으로 갱신합니다.
 * - GeometryGPURenderInfo를 통해 GPU 파이프라인에 필요한 레이아웃 정보를 제공합니다.
 *
 * @extends ResourceBase
 */
declare class Geometry extends ResourceBase {
    #private;
    /** GPU 파이프라인에 필요한 레이아웃 정보 */
    gpuRenderInfo: GeometryGPURenderInfo;
    /**
     * Geometry 인스턴스를 생성합니다.
     * @param redGPUContext RedGPUContext 인스턴스
     * @param vertexBuffer 정점 버퍼
     * @param indexBuffer 인덱스 버퍼(선택)
     */
    constructor(redGPUContext: RedGPUContext, vertexBuffer: VertexBuffer, indexBuffer?: IndexBuffer);
    /** 정점 버퍼 반환 */
    get vertexBuffer(): VertexBuffer;
    /** 인덱스 버퍼 반환 */
    get indexBuffer(): IndexBuffer;
    /**
     * 정점 버퍼 기준 AABB(경계 상자) 반환
     * 최초 접근 시 계산 후 캐싱, 버퍼 변경 시 자동 갱신
     */
    get volume(): AABB;
}
export default Geometry;

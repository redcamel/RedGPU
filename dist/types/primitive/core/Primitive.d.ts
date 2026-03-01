import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import AABB from "../../bound/AABB";
/**
 * [KO] 모든 기본 도형(Primitive)의 기반이 되는 베이스 클래스입니다.
 * [EN] Base class for all primitive geometries.
 */
declare class Primitive {
    #private;
    static generateUniqueKey(name: string, params: Record<string, any>): string;
    constructor(redGPUContext: RedGPUContext, uniqueKey: string, makeData: () => Geometry);
    /**
     * [KO] 캐싱된 정점 인터리브 구조를 반환합니다.
     */
    static get primitiveInterleaveStruct(): VertexInterleavedStruct;
    get gpuRenderInfo(): {
        buffers: GPUVertexBufferLayout[];
    };
    get vertexBuffer(): VertexBuffer;
    get indexBuffer(): IndexBuffer;
    get volume(): AABB;
}
export default Primitive;

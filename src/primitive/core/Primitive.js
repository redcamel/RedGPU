import GeometryGPURenderInfo from "./GeometryGPURenderInfo";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import calculateGeometryAABB from "../../utils/math/bound/calculateGeometryAABB";
/**
 * 기본 도형(Primitive) 클래스입니다.
 * 정점 버퍼, 인덱스 버퍼, GPU 렌더 정보, AABB(바운딩 박스) 등을 관리합니다.
 *
 * @category Primitive
 *
 * @example
 * ```javascript
 * const primitive = new RedGPU.Primitive.Primitive(redGPUContext);
 * primitive._setData(geometry);
 * const vb = primitive.vertexBuffer;
 * const ib = primitive.indexBuffer;
 * const aabb = primitive.volume;
 * ```
 */
class Primitive {
    /** GPU 렌더 정보 */
    #gpuRenderInfo;
    /** 정점 버퍼 */
    #vertexBuffer;
    /** 인덱스 버퍼 */
    #indexBuffer;
    /** AABB(바운딩 박스) */
    #volume;
    /**
     * Primitive 인스턴스 생성
     * @param redGPUContext RedGPUContext 인스턴스
     */
    constructor(redGPUContext) {
        validateRedGPUContext(redGPUContext);
    }
    /**
     * 기본 정점 레이아웃 구조 반환
     */
    static get primitiveInterleaveStruct() {
        return new VertexInterleavedStruct({
            vertexPosition: VertexInterleaveType.float32x3,
            vertexNormal: VertexInterleaveType.float32x3,
            texcoord: VertexInterleaveType.float32x2,
        }, `primitiveInterleaveStruct`);
    }
    /** GPU 렌더 정보 반환 */
    get gpuRenderInfo() {
        return this.#gpuRenderInfo;
    }
    /** 정점 버퍼 반환 */
    get vertexBuffer() {
        return this.#vertexBuffer;
    }
    /** 인덱스 버퍼 반환 */
    get indexBuffer() {
        return this.#indexBuffer;
    }
    /** AABB(바운딩 박스) 반환 */
    get volume() {
        if (!this.#volume) {
            this.#volume = calculateGeometryAABB(this.#vertexBuffer);
        }
        return this.#volume;
    }
    /**
     * Geometry 데이터로 내부 버퍼/정보를 설정합니다.
     * @param geometry Geometry 인스턴스
     */
    _setData(geometry) {
        this.#vertexBuffer = geometry.vertexBuffer;
        this.#indexBuffer = geometry.indexBuffer;
        if (this.#vertexBuffer) {
            const { interleavedStruct } = this.#vertexBuffer;
            this.#gpuRenderInfo = new GeometryGPURenderInfo([
                {
                    arrayStride: interleavedStruct.arrayStride,
                    attributes: interleavedStruct.attributes
                }
            ]);
        }
    }
}
Object.freeze(Primitive);
export default Primitive;

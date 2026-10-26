import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";
import AABB from "../../bound/AABB";
import calculateGeometryAABB from "../../bound/math/calculateGeometryAABB";
import GeometryGPURenderInfo from "./GeometryGPURenderInfo";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] 모든 기본 도형(Primitive)의 기반이 되는 상위 클래스입니다.
 * [EN] Base class for all primitive geometries.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
class Primitive extends RedGPUObject {

    static readonly #INTERLEAVE_STRUCT = new VertexInterleavedStruct(
        {
            vertexPosition: VertexInterleaveType.float32x3,
            vertexNormal: VertexInterleaveType.float32x3,
            texcoord: VertexInterleaveType.float32x2,
            vertexTangent: VertexInterleaveType.float32x4,
        },
        `primitiveInterleaveStruct`
    );
    #gpuRenderInfo: GeometryGPURenderInfo;
    #vertexBuffer: VertexBuffer;
    #indexBuffer: IndexBuffer;
    #volume: AABB;

    /**
     * [KO] Primitive 인스턴스를 생성합니다.
     * [EN] Creates a Primitive instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param uniqueKey -
     * [KO] 지오메트리 캐싱을 위한 고유 키
     * [EN] Unique key for geometry caching
     * @param makeData -
     * [KO] 캐시 미스 시 지오메트리 데이터를 생성하는 팩토리 함수
     * [EN] Factory function that generates geometry data on cache miss
     */
    constructor(redGPUContext: RedGPUContext, uniqueKey: string, makeData: () => Geometry) {
        super(redGPUContext)
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
        let geometry = cachedBufferState[uniqueKey]
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = makeData()
        }
        this.#setData(geometry)
    }

    /**
     * [KO] 기본 도형에서 공통으로 사용하는 정점 인터리브 구조체를 반환합니다.
     * [EN] Returns the vertex interleaved structure shared across primitive geometries.
     *
     * @returns
     * [KO] 정점 인터리브 구조체 (`VertexInterleavedStruct`)
     * [EN] Vertex interleaved structure (`VertexInterleavedStruct`)
     */
    static get primitiveInterleaveStruct(): VertexInterleavedStruct {
        return this.#INTERLEAVE_STRUCT;
    }

    /**
     * [KO] GPU 렌더링 파이프라인 구성에 필요한 버퍼 레이아웃 정보를 반환합니다.
     * [EN] Returns buffer layout information required for GPU render pipeline configuration.
     *
     * @returns
     * [KO] GPU 정점 버퍼 레이아웃 객체
     * [EN] GPU vertex buffer layout object
     */
    get gpuRenderInfo(): { buffers: GPUVertexBufferLayout[] } {
        return this.#gpuRenderInfo;
    }

    /**
     * [KO] 정점 버퍼를 반환합니다.
     * [EN] Returns the vertex buffer.
     *
     * @returns
     * [KO] `VertexBuffer` 인스턴스
     * [EN] `VertexBuffer` instance
     */
    get vertexBuffer(): VertexBuffer {
        return this.#vertexBuffer;
    }

    /**
     * [KO] 인덱스 버퍼를 반환합니다.
     * [EN] Returns the index buffer.
     *
     * @returns
     * [KO] `IndexBuffer` 인스턴스
     * [EN] `IndexBuffer` instance
     */
    get indexBuffer(): IndexBuffer {
        return this.#indexBuffer;
    }

    /**
     * [KO] 정점 데이터를 기반으로 계산된 로컬 축 정렬 바운딩 박스(AABB)를 반환합니다.
     * [EN] Returns the local axis-aligned bounding box (AABB) calculated from the vertex data.
     *
     * @returns
     * [KO] `AABB` 인스턴스
     * [EN] `AABB` instance
     */
    get volume(): AABB {
        if (!this.#volume) this.#volume = calculateGeometryAABB(this.#vertexBuffer);
        return this.#volume;
    }

    /**
     * [KO] 도형 이름과 생성 파라미터 조합으로부터 캐싱용 고유 키 문자열을 생성합니다.
     * [EN] Generates a unique key string for caching from the primitive name and creation parameters.
     *
     * @param name -
     * [KO] 기본 도형 타입 이름
     * [EN] Primitive type name
     * @param params -
     * [KO] 도형 생성 파라미터 객체 (`Record<string, any>`)
     * [EN] Primitive creation parameter object (`Record<string, any>`)
     * @returns
     * [KO] 생성된 고유 키 문자열
     * [EN] Generated unique key string
     */
    static generateUniqueKey(name: string, params: Record<string, any>): string {
        let uniqueKey = 'PRIMITIVE_' + name.toUpperCase();
        for (const key in params) {
            const value = params[key];
            if (value !== undefined) {
                uniqueKey += '_' + key.toUpperCase() + value;
            }
        }
        return uniqueKey;
    }

    #setData(geometry: Geometry) {
        this.#vertexBuffer = geometry.vertexBuffer
        this.#indexBuffer = geometry.indexBuffer
        if (this.#vertexBuffer) {
            const {interleavedStruct} = this.#vertexBuffer
            this.#gpuRenderInfo = new GeometryGPURenderInfo(
                [
                    {
                        arrayStride: interleavedStruct.arrayStride,
                        attributes: interleavedStruct.attributes
                    }
                ]
            )
        }
    }
}

Object.freeze(Primitive)
export default Primitive

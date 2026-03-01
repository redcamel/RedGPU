import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import AABB from "../../bound/AABB";
import calculateGeometryAABB from "../../bound/math/calculateGeometryAABB";
import GeometryGPURenderInfo from "./GeometryGPURenderInfo";

/**
 * [KO] 모든 기본 도형(Primitive)의 기반이 되는 베이스 클래스입니다.
 * [EN] Base class for all primitive geometries.
 */
class Primitive {
    /**
     * [KO] 기본 정점 레이아웃 구조를 정적 상수로 캐싱합니다. (메모리 할당 최적화)
     */
    static readonly #INTERLEAVE_STRUCT = new VertexInterleavedStruct(
        {
            vertexPosition: VertexInterleaveType.float32x3,
            vertexNormal: VertexInterleaveType.float32x3,
            texcoord: VertexInterleaveType.float32x2,
            tangent: VertexInterleaveType.float32x4,
        },
        `primitiveInterleaveStruct`
    );

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

    #gpuRenderInfo: GeometryGPURenderInfo;
    #vertexBuffer: VertexBuffer;
    #indexBuffer: IndexBuffer;
    #volume: AABB;

    constructor(redGPUContext: RedGPUContext, uniqueKey: string, makeData: () => Geometry) {
        validateRedGPUContext(redGPUContext)
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
        let geometry = cachedBufferState[uniqueKey]
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = makeData()
        }
        this.#setData(geometry)
    }

    /**
     * [KO] 캐싱된 정점 인터리브 구조를 반환합니다.
     */
    static get primitiveInterleaveStruct(): VertexInterleavedStruct {
        return this.#INTERLEAVE_STRUCT;
    }

    get gpuRenderInfo(): { buffers: GPUVertexBufferLayout[] } { return this.#gpuRenderInfo; }
    get vertexBuffer(): VertexBuffer { return this.#vertexBuffer; }
    get indexBuffer(): IndexBuffer { return this.#indexBuffer; }
    get volume(): AABB {
        if (!this.#volume) this.#volume = calculateGeometryAABB(this.#vertexBuffer);
        return this.#volume;
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

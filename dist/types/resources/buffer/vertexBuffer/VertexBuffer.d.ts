import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, { GPU_BUFFER_DATA_SYMBOL } from "../core/ABaseBuffer";
import VertexInterleavedStruct from "./VertexInterleavedStruct";
/**
 * [KO] 정점(Vertex) 버퍼를 관리하는 클래스입니다.
 * [EN] Class that manages vertex buffers.
 *
 * * ### Example
 * ```typescript
 * const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct);
 * ```
 * @category Buffer
 */
declare class VertexBuffer extends ABaseBuffer {
    #private;
    /**
     * [KO] 버텍스 데이터가 저장되는 내부 버퍼입니다.
     * [EN] Internal buffer where vertex data is stored.
     */
    [GPU_BUFFER_DATA_SYMBOL]: Float32Array;
    /**
     * [KO] VertexBuffer 인스턴스를 생성합니다.
     * [EN] Creates a VertexBuffer instance.
     *
     * * ### Example
     * ```typescript
     * const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct, GPUBufferUsage.VERTEX);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param data -
     * [KO] 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)
     * [EN] Vertex data (`Array<number>` or `Float32Array`)
     * @param interleavedStruct -
     * [KO] 버텍스 데이터 구조 정의
     * [EN] Vertex data structure definition
     * @param usage -
     * [KO] GPUBufferUsageFlags (기본값: `VERTEX | COPY_DST | STORAGE`)
     * [EN] GPUBufferUsageFlags (default: `VERTEX | COPY_DST | STORAGE`)
     * @param cacheKey -
     * [KO] 버퍼 캐시 키 (선택)
     * [EN] Buffer cache key (optional)
     */
    constructor(redGPUContext: RedGPUContext, data: Array<number> | Float32Array, interleavedStruct: VertexInterleavedStruct, usage?: GPUBufferUsageFlags, cacheKey?: string);
    /**
     * [KO] 버텍스 데이터를 반환합니다.
     * [EN] Returns the vertex data.
     */
    get data(): Float32Array;
    /**
     * [KO] stride(버텍스 당 바이트 수)를 반환합니다.
     * [EN] Returns the stride (number of bytes per vertex).
     */
    get stride(): number;
    /**
     * [KO] 버텍스 데이터 구조를 반환합니다.
     * [EN] Returns the vertex data structure.
     */
    get interleavedStruct(): VertexInterleavedStruct;
    /**
     * [KO] 버텍스 개수를 반환합니다.
     * [EN] Returns the number of vertices.
     */
    get vertexCount(): number;
    /**
     * [KO] 삼각형 개수를 반환합니다.
     * [EN] Returns the number of triangles.
     */
    get triangleCount(): number;
    /**
     * [KO] 버텍스 버퍼의 데이터를 변경합니다.
     * [EN] Changes the data of the vertex buffer.
     *
     * * ### Example
     * ```typescript
     * vertexBuffer.changeData(newData);
     * ```
     *
     * @param data -
     * [KO] 새로운 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)
     * [EN] New vertex data (`Array<number>` or `Float32Array`)
     * @param interleavedStruct -
     * [KO] 버텍스 데이터 구조 정의 (선택)
     * [EN] Vertex data structure definition (optional)
     */
    changeData(data: Array<number> | Float32Array, interleavedStruct?: VertexInterleavedStruct): void;
    /**
     * [KO] 버텍스 버퍼의 일부 데이터를 오프셋부터 업데이트합니다.
     * [EN] Updates part of the vertex buffer data starting from the offset.
     *
     * * ### Example
     * ```typescript
     * vertexBuffer.updateData(partialData, 1024);
     * ```
     *
     * @param data -
     * [KO] 새로운 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)
     * [EN] New vertex data (`Array<number>` or `Float32Array`)
     * @param offset -
     * [KO] 업데이트 시작 오프셋 (기본값: 0)
     * [EN] Update start offset (default: 0)
     */
    updateData(data: Array<number> | Float32Array, offset?: number): void;
    /**
     * [KO] 버텍스 버퍼의 전체 데이터를 GPU에 다시 업로드합니다.
     * [EN] Re-uploads the entire data of the vertex buffer to the GPU.
     *
     * * ### Example
     * ```typescript
     * vertexBuffer.updateAllData(fullData);
     * ```
     *
     * @param data -
     * [KO] 새로운 버텍스 데이터 (`Array<number>` 또는 `Float32Array`)
     * [EN] New vertex data (`Array<number>` or `Float32Array`)
     */
    updateAllData(data: Array<number> | Float32Array): void;
}
export default VertexBuffer;

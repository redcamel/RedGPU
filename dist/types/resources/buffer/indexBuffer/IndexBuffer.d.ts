import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, { GPU_BUFFER_DATA_SYMBOL } from "../core/ABaseBuffer";
type NumberArray = Array<number> | Uint32Array;
/**
 * [KO] 인덱스 버퍼를 관리하는 클래스입니다.
 * [EN] Class that manages index buffers.
 *
 * * ### Example
 * ```typescript
 * const indexBuffer = new RedGPU.Resource.IndexBuffer(redGPUContext, [0, 1, 2]);
 * ```
 * @category Buffer
 */
declare class IndexBuffer extends ABaseBuffer {
    #private;
    /**
     * [KO] 인덱스 데이터가 저장되는 내부 버퍼입니다.
     * [EN] Internal buffer where index data is stored.
     */
    [GPU_BUFFER_DATA_SYMBOL]: Uint32Array;
    /**
     * [KO] IndexBuffer 인스턴스를 생성합니다.
     * [EN] Creates an IndexBuffer instance.
     *
     * * ### Example
     * ```typescript
     * const indexBuffer = new RedGPU.Resource.IndexBuffer(redGPUContext, [0, 1, 2], GPUBufferUsage.INDEX, 'MyIndexBuffer');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param data -
     * [KO] 인덱스 데이터 (`Array<number>` 또는 `Uint32Array`)
     * [EN] Index data (`Array<number>` or `Uint32Array`)
     * @param usage -
     * [KO] GPUBufferUsageFlags (기본값: `GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST`)
     * [EN] GPUBufferUsageFlags (default: `GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST`)
     * @param cacheKey -
     * [KO] 버퍼 캐시 키 (옵션)
     * [EN] Buffer cache key (optional)
     */
    constructor(redGPUContext: RedGPUContext, data: NumberArray, usage?: GPUBufferUsageFlags, cacheKey?: string);
    /**
     * [KO] GPU 인덱스 형식을 반환합니다.
     * [EN] Returns the GPU index format.
     */
    get format(): GPUIndexFormat;
    /**
     * [KO] 삼각형 개수를 반환합니다.
     * [EN] Returns the number of triangles.
     */
    get triangleCount(): number;
    /**
     * [KO] 인덱스 개수를 반환합니다.
     * [EN] Returns the number of indices.
     */
    get indexCount(): number;
    /**
     * [KO] 인덱스 데이터를 반환합니다.
     * [EN] Returns the index data.
     */
    get data(): NumberArray;
    /**
     * [KO] 인덱스 버퍼의 데이터를 변경합니다.
     * [EN] Changes the data of the index buffer.
     *
     * * ### Example
     * ```typescript
     * indexBuffer.changeData([3, 4, 5]);
     * ```
     *
     * @param data -
     * [KO] 새로운 인덱스 데이터 (`Array<number>` 또는 `Uint32Array`)
     * [EN] New index data (`Array<number>` or `Uint32Array`)
     */
    changeData(data: NumberArray): void;
}
export default IndexBuffer;

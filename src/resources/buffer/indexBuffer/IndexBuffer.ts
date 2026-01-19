import RedGPUContext from "../../../context/RedGPUContext";
import GPU_INDEX_FORMAT from "../../../gpuConst/GPU_INDEX_FORMAT";
import ResourceStateIndexBuffer from "../../core/resourceManager/resourceState/ResourceStateIndexBuffer";
import ABaseBuffer, {GPU_BUFFER_CACHE_KEY, GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL} from "../core/ABaseBuffer";

const MANAGED_STATE_KEY = 'managedIndexBufferState'
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
class IndexBuffer extends ABaseBuffer {
    /**
     * [KO] 인덱스 데이터가 저장되는 내부 버퍼입니다.
     * [EN] Internal buffer where index data is stored.
     */
    [GPU_BUFFER_DATA_SYMBOL]: Uint32Array
    /**
     * [KO] 인덱스 개수입니다.
     * [EN] Number of indices.
     */
    #indexCount: number = 0
    /**
     * [KO] 삼각형 개수입니다.
     * [EN] Number of triangles.
     */
    #triangleCount: number = 0
    #format: GPUIndexFormat = GPU_INDEX_FORMAT.UINT32

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
    constructor(
        redGPUContext: RedGPUContext,
        data: NumberArray,
        usage: GPUBufferUsageFlags = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        cacheKey: string = ''
    ) {
        super(redGPUContext, MANAGED_STATE_KEY, usage)
        const {table} = this.targetResourceManagedState
        const cacheBuffer = table.get(cacheKey)
        if (cacheBuffer) {
            return cacheBuffer.buffer
        } else {
            if (cacheKey) {
                this.name = cacheKey
                this[GPU_BUFFER_CACHE_KEY] = cacheKey
            }
            this.changeData(data)
            this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateIndexBuffer(this));
        }
    }

    /**
     * [KO] GPU 인덱스 형식을 반환합니다.
     * [EN] Returns the GPU index format.
     */
    get format(): GPUIndexFormat {
        return this.#format;
    }

    /**
     * [KO] 삼각형 개수를 반환합니다.
     * [EN] Returns the number of triangles.
     */
    get triangleCount(): number {
        return this.#triangleCount;
    }

    /**
     * [KO] 인덱스 개수를 반환합니다.
     * [EN] Returns the number of indices.
     */
    get indexCount(): number {
        return this.#indexCount;
    }

    /**
     * [KO] 인덱스 데이터를 반환합니다.
     * [EN] Returns the index data.
     */
    get data(): NumberArray {
        return this[GPU_BUFFER_DATA_SYMBOL];
    }

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
    changeData(data: NumberArray) {
        const {gpuDevice} = this;
        if (Array.isArray(data)) {
            data = new Uint32Array(data);
        }
        if (this[GPU_BUFFER_SYMBOL]) {
            this.targetResourceManagedState.videoMemory -= this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
            let temp = this[GPU_BUFFER_SYMBOL]
            requestAnimationFrame(() => {
                temp.destroy();
            })
            this[GPU_BUFFER_SYMBOL] = null;
        }
        this[GPU_BUFFER_DATA_SYMBOL] = data;
        this.#indexCount = data.length;
        const bufferDescriptor: GPUBufferDescriptor = {
            size: this[GPU_BUFFER_DATA_SYMBOL].byteLength,
            usage: this.usage,
            label: this.name
        }
        this[GPU_BUFFER_SYMBOL] = gpuDevice.createBuffer(bufferDescriptor);
        this.targetResourceManagedState.videoMemory += this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
        this.#triangleCount = this.#indexCount / 3;
        gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, this[GPU_BUFFER_DATA_SYMBOL]);
    }
}

Object.freeze(IndexBuffer)
export default IndexBuffer

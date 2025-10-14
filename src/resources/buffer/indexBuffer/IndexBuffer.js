import GPU_INDEX_FORMAT from "../../../gpuConst/GPU_INDEX_FORMAT";
import ResourceStateIndexBuffer from "../../core/resourceManager/resourceState/ResourceStateIndexBuffer";
import ABaseBuffer, { GPU_BUFFER_CACHE_KEY, GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL } from "../core/ABaseBuffer";
const MANAGED_STATE_KEY = 'managedIndexBufferState';
/**
 * IndexBuffer
 * @category Buffer
 */
class IndexBuffer extends ABaseBuffer {
    /**
     * 인덱스 데이터가 저장되는 내부 버퍼입니다.

     */
    [GPU_BUFFER_DATA_SYMBOL];
    /**
     * 인덱스 개수입니다.

     */
    #indexCount = 0;
    /**
     * 삼각형 개수입니다.

     */
    #triangleCount = 0;
    #format = GPU_INDEX_FORMAT.UINT32;
    /**
     * IndexBuffer 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param data - 인덱스 데이터 (Array<number> 또는 Uint32Array)
     * @param usage - GPUBufferUsageFlags (기본값: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST)
     * @param cacheKey - 버퍼 캐시 키 (옵션)
     */
    constructor(redGPUContext, data, usage = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST, cacheKey = '') {
        super(redGPUContext, MANAGED_STATE_KEY, usage);
        const { table } = this.targetResourceManagedState;
        const cacheBuffer = table.get(cacheKey);
        if (cacheBuffer) {
            return cacheBuffer.buffer;
        }
        else {
            if (cacheKey) {
                this.name = cacheKey;
                this[GPU_BUFFER_CACHE_KEY] = cacheKey;
            }
            this.changeData(data);
            this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateIndexBuffer(this));
        }
    }
    get format() {
        return this.#format;
    }
    /**
     * 삼각형 개수를 반환합니다.
     * @category Buffer
     */
    get triangleCount() {
        return this.#triangleCount;
    }
    /**
     * 인덱스 개수를 반환합니다.
     * @category Buffer
     */
    get indexCount() {
        return this.#indexCount;
    }
    /**
     * 인덱스 버퍼의 데이터를 변경합니다.
     *
     * @param data - 새로운 인덱스 데이터 (Array<number> 또는 Uint32Array)
     * @category Buffer
     */
    changeData(data) {
        const { gpuDevice } = this;
        if (Array.isArray(data)) {
            data = new Uint32Array(data);
        }
        if (this[GPU_BUFFER_SYMBOL]) {
            this.targetResourceManagedState.videoMemory -= this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
            let temp = this[GPU_BUFFER_SYMBOL];
            requestAnimationFrame(() => {
                temp.destroy();
            });
            this[GPU_BUFFER_SYMBOL] = null;
        }
        this[GPU_BUFFER_DATA_SYMBOL] = data;
        this.#indexCount = data.length;
        const bufferDescriptor = {
            size: this[GPU_BUFFER_DATA_SYMBOL].byteLength,
            usage: this.usage,
            label: this.name
        };
        this[GPU_BUFFER_SYMBOL] = gpuDevice.createBuffer(bufferDescriptor);
        this.targetResourceManagedState.videoMemory += this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
        this.#triangleCount = this.#indexCount / 3;
        gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, this[GPU_BUFFER_DATA_SYMBOL]);
    }
}
Object.freeze(IndexBuffer);
export default IndexBuffer;

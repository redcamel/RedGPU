import ResourceStateVertexBuffer from "../../core/resourceManager/resourceState/ResourceStateVertexBuffer";
import ABaseBuffer, { GPU_BUFFER_CACHE_KEY, GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL } from "../core/ABaseBuffer";
const MANAGED_STATE_KEY = 'managedVertexBufferState';
/**
 * VertexBuffer
 * @category Buffer
 */
class VertexBuffer extends ABaseBuffer {
    /**
     * 버텍스 데이터가 저장되는 내부 버퍼입니다.
     * @category Buffer
     */
    [GPU_BUFFER_DATA_SYMBOL];
    /**
     * 버텍스 개수입니다.
     * @category Buffer
     */
    #vertexCount = 0;
    /**
     * stride(버텍스 당 바이트 수)입니다.
     * @category Buffer
     */
    #stride = 0;
    /**
     * 버텍스 데이터의 구조를 정의하는 객체입니다.
     * @category Buffer
     */
    #interleavedStruct;
    /**
     * 삼각형 개수입니다.
     * @category Buffer
     */
    #triangleCount = 0;
    /**
     * VertexBuffer 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param data - 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @param interleavedStruct - 버텍스 데이터 구조 정의
     * @param usage - GPUBufferUsageFlags (기본값: VERTEX | COPY_DST | STORAGE)
     * @param cacheKey - 버퍼 캐시 키(옵션)
     */
    constructor(redGPUContext, data, interleavedStruct, usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE, cacheKey = '') {
        super(redGPUContext, MANAGED_STATE_KEY, usage);
        const { table } = this.targetResourceManagedState;
        const cacheBuffer = table.get(cacheKey);
        // keepLog(this.targetResourceManagedState)
        if (cacheBuffer) {
            return cacheBuffer.buffer;
        }
        else {
            this.#interleavedStruct = interleavedStruct;
            if (cacheKey) {
                this.name = cacheKey;
                this[GPU_BUFFER_CACHE_KEY] = cacheKey;
            }
            this.changeData(data, this.#interleavedStruct);
            this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateVertexBuffer(this));
        }
    }
    /**
     * stride(버텍스 당 바이트 수)를 반환합니다.
     * @category Buffer
     */
    get stride() {
        return this.#stride;
    }
    /**
     * 버텍스 데이터 구조를 반환합니다.
     * @category Buffer
     */
    get interleavedStruct() {
        return this.#interleavedStruct;
    }
    /**
     * 버텍스 개수를 반환합니다.
     * @category Buffer
     */
    get vertexCount() {
        return this.#vertexCount;
    }
    /**
     * 삼각형 개수를 반환합니다.
     * @category Buffer
     */
    get triangleCount() {
        return this.#triangleCount;
    }
    /**
     * 버텍스 버퍼의 데이터를 변경합니다.
     * @param data - 새로운 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @param interleavedStruct - 버텍스 데이터 구조 정의(옵션)
     * @category Buffer
     */
    changeData(data, interleavedStruct) {
        const { gpuDevice } = this;
        if (Array.isArray(data)) {
            data = new Float32Array(data);
        }
        this[GPU_BUFFER_DATA_SYMBOL] = data;
        if (interleavedStruct) {
            this.#updateInterleavedStruct(interleavedStruct);
        }
        if (this[GPU_BUFFER_SYMBOL]) {
            this.targetResourceManagedState.videoMemory -= this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
            let temp = this[GPU_BUFFER_SYMBOL];
            requestAnimationFrame(() => {
                temp.destroy();
            });
            this[GPU_BUFFER_SYMBOL] = null;
        }
        const bufferDescriptor = {
            size: this[GPU_BUFFER_DATA_SYMBOL].byteLength,
            usage: this.usage,
            label: this.name
        };
        this[GPU_BUFFER_SYMBOL] = gpuDevice.createBuffer(bufferDescriptor);
        this.targetResourceManagedState.videoMemory += this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
        this.#triangleCount = this[GPU_BUFFER_DATA_SYMBOL].length / this.#stride;
        gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, this[GPU_BUFFER_DATA_SYMBOL]);
    }
    /**
     * 버텍스 버퍼의 일부 데이터를 오프셋부터 업데이트합니다.
     * @param data - 새로운 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @param offset - 업데이트 시작 오프셋(기본값: 0)
     * @category Buffer
     */
    updateData(data, offset = 0) {
        if (data instanceof Array)
            data = new Float32Array(data);
        const { gpuDevice } = this;
        gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], offset, data);
    }
    /**
     * 버텍스 버퍼의 전체 데이터를 GPU에 다시 업로드합니다.
     * @param data - 새로운 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @category Buffer
     */
    updateAllData(data) {
        const { gpuDevice } = this;
        gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, this[GPU_BUFFER_DATA_SYMBOL]);
    }
    /**
     * 버텍스 데이터 구조를 내부적으로 갱신합니다.
     * @param interleavedStruct - 버텍스 데이터 구조 정의
     * @category Buffer
     */
    #updateInterleavedStruct(interleavedStruct) {
        this.#interleavedStruct = interleavedStruct;
        this.#vertexCount = 0;
        this.#stride = 0;
        for (const k in this.#interleavedStruct.define) {
            const value = this.#interleavedStruct.define[k];
            const elementCount = value.attributeStride / Float32Array.BYTES_PER_ELEMENT;
            this.#vertexCount += elementCount;
            this.#stride += elementCount;
        }
        this.#vertexCount = this[GPU_BUFFER_DATA_SYMBOL].length / this.#vertexCount;
    }
}
Object.freeze(VertexBuffer);
export default VertexBuffer;

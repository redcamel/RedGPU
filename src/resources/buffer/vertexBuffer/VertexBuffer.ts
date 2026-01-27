import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateVertexBuffer from "../../core/resourceManager/resourceState/ResourceStateVertexBuffer";
import ABaseBuffer, {GPU_BUFFER_CACHE_KEY, GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL} from "../core/ABaseBuffer";
import VertexInterleavedStructElement from "./core/VertexInterleavedStructElement";
import VertexInterleavedStruct from "./VertexInterleavedStruct";

const MANAGED_STATE_KEY = 'managedVertexBufferState'

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
class VertexBuffer extends ABaseBuffer {
    /**
     * [KO] 버텍스 데이터가 저장되는 내부 버퍼입니다.
     * [EN] Internal buffer where vertex data is stored.
     */
    [GPU_BUFFER_DATA_SYMBOL]: Float32Array
    /**
     * [KO] 버텍스 개수입니다.
     * [EN] Number of vertices.
     */
    #vertexCount: number = 0
    /**
     * [KO] stride(버텍스 당 바이트 수)입니다.
     * [EN] Stride (number of bytes per vertex).
     */
    #stride: number = 0
    /**
     * [KO] 버텍스 데이터의 구조를 정의하는 객체입니다.
     * [EN] Object that defines the structure of vertex data.
     */
    #interleavedStruct: VertexInterleavedStruct
    /**
     * [KO] 삼각형 개수입니다.
     * [EN] Number of triangles.
     */
    #triangleCount: number = 0

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
    constructor(
        redGPUContext: RedGPUContext,
        data: Array<number> | Float32Array,
        interleavedStruct: VertexInterleavedStruct,
        usage: GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
        cacheKey: string = ''
    ) {
        super(redGPUContext, MANAGED_STATE_KEY, usage)
        const {table} = this.targetResourceManagedState
        const cacheBuffer = table.get(cacheKey)
        if (cacheBuffer) {
            return cacheBuffer.buffer
        } else {
            this.#interleavedStruct = interleavedStruct
            if (cacheKey) {
                this.name = cacheKey
                this[GPU_BUFFER_CACHE_KEY] = cacheKey
            }
            this.changeData(data, this.#interleavedStruct)
            this.redGPUContext.resourceManager.registerManagementResource(
                this,
                new ResourceStateVertexBuffer(this)
            )
        }
    }

    /**
     * [KO] 버텍스 데이터를 반환합니다.
     * [EN] Returns the vertex data.
     */
    get data(): Float32Array {
        return this[GPU_BUFFER_DATA_SYMBOL];
    }

    /**
     * [KO] stride(버텍스 당 바이트 수)를 반환합니다.
     * [EN] Returns the stride (number of bytes per vertex).
     */
    get stride(): number {
        return this.#stride;
    }

    /**
     * [KO] 버텍스 데이터 구조를 반환합니다.
     * [EN] Returns the vertex data structure.
     */
    get interleavedStruct() {
        return this.#interleavedStruct
    }

    /**
     * [KO] 버텍스 개수를 반환합니다.
     * [EN] Returns the number of vertices.
     */
    get vertexCount(): number {
        return this.#vertexCount;
    }

    /**
     * [KO] 삼각형 개수를 반환합니다.
     * [EN] Returns the number of triangles.
     */
    get triangleCount(): number {
        return this.#triangleCount;
    }

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
    changeData(data: Array<number> | Float32Array, interleavedStruct?: VertexInterleavedStruct) {
        const {gpuDevice} = this;
        if (Array.isArray(data)) {
            data = new Float32Array(data);
        }
        this[GPU_BUFFER_DATA_SYMBOL] = data;
        if (interleavedStruct) {
            this.#updateInterleavedStruct(interleavedStruct);
        }
        if (this[GPU_BUFFER_SYMBOL]) {
            this.targetResourceManagedState.videoMemory -= this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
            let temp = this[GPU_BUFFER_SYMBOL]
            requestAnimationFrame(() => {
                temp.destroy();
            })
            this[GPU_BUFFER_SYMBOL] = null;
        }
        const bufferDescriptor: GPUBufferDescriptor = {
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
    updateData(data: Array<number> | Float32Array, offset: number = 0) {
        if (data instanceof Array) data = new Float32Array(data);
        const {gpuDevice} = this;
        gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], offset, data,);
    }

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
    updateAllData(data: Array<number> | Float32Array) {
        const {gpuDevice} = this;
        gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, this[GPU_BUFFER_DATA_SYMBOL]);
    }

    /**
     * [KO] 버텍스 데이터 구조를 내부적으로 갱신합니다.
     * [EN] Internally updates the vertex data structure.
     * @param interleavedStruct -
     * [KO] 버텍스 데이터 구조 정의
     * [EN] Vertex data structure definition
     */
    #updateInterleavedStruct(interleavedStruct: VertexInterleavedStruct) {
        this.#interleavedStruct = interleavedStruct;
        this.#vertexCount = 0;
        this.#stride = 0;
        for (const k in this.#interleavedStruct.define) {
            const value: VertexInterleavedStructElement = this.#interleavedStruct.define[k];
            const elementCount = value.attributeStride / Float32Array.BYTES_PER_ELEMENT;
            this.#vertexCount += elementCount;
            this.#stride += elementCount;
        }
        this.#vertexCount = this[GPU_BUFFER_DATA_SYMBOL].length / this.#vertexCount;
    }
}

Object.freeze(VertexBuffer)
export default VertexBuffer

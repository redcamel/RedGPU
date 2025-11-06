import RedGPUContext from "../../../context/RedGPUContext";
import GPU_INDEX_FORMAT from "../../../gpuConst/GPU_INDEX_FORMAT";
import ResourceStateIndexBuffer from "../../core/resourceManager/resourceState/ResourceStateIndexBuffer";
import ABaseBuffer, {GPU_BUFFER_CACHE_KEY, GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL} from "../core/ABaseBuffer";

const MANAGED_STATE_KEY = 'managedIndexBufferState'
type NumberArray = Array<number> | Uint32Array;

/**
 * IndexBuffer
 * @category Buffer
 */
class IndexBuffer extends ABaseBuffer {
	/**
	 * 인덱스 데이터가 저장되는 내부 버퍼입니다.

	 */
	[GPU_BUFFER_DATA_SYMBOL]: Uint32Array
	/**
	 * 인덱스 개수입니다.

	 */
	#indexCount: number = 0
	/**
	 * 삼각형 개수입니다.

	 */
	#triangleCount: number = 0
	#format: GPUIndexFormat = GPU_INDEX_FORMAT.UINT32

	/**
	 * IndexBuffer 생성자
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param data - 인덱스 데이터 (Array<number> 또는 Uint32Array)
	 * @param usage - GPUBufferUsageFlags (기본값: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST)
	 * @param cacheKey - 버퍼 캐시 키 (옵션)
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

	get format(): GPUIndexFormat {
		return this.#format;
	}

	/**
	 * 삼각형 개수를 반환합니다.
	 * @category Buffer
	 */
	get triangleCount(): number {
		return this.#triangleCount;
	}

	/**
	 * 인덱스 개수를 반환합니다.
	 * @category Buffer
	 */
	get indexCount(): number {
		return this.#indexCount;
	}

	get data(): NumberArray {
		return this[GPU_BUFFER_DATA_SYMBOL];
	}

	/**
	 * 인덱스 버퍼의 데이터를 변경합니다.
	 *
	 * @param data - 새로운 인덱스 데이터 (Array<number> 또는 Uint32Array)
	 * @category Buffer
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

	// /**
	//  * 인덱스 버퍼의 일부 데이터만 부분적으로 업데이트합니다.
	//  * @param dataStartIndex - 데이터 시작 인덱스
	//  * @param data - 새로운 인덱스 데이터 (Array<number> 또는 Uint32Array)
	//  * @category Buffer
	//  */
	// updatePartialData(dataStartIndex: number, data: NumberArray) {
	// 	const {gpuDevice} = this
	// 	if (dataStartIndex < 0 || dataStartIndex >= this[GPU_BUFFER_DATA_SYMBOL].length) {
	// 		consoleAndThrowError(`Offset value is out of data bounds. Tried to access index ${dataStartIndex} on data of length ${this[GPU_BUFFER_DATA_SYMBOL].length}`);
	// 	}
	// 	if (Array.isArray(data)) data = new Uint32Array(data)
	// 	this.#indexCount = data.length
	// 	gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], dataStartIndex, data)
	// }
}

Object.freeze(IndexBuffer)
export default IndexBuffer

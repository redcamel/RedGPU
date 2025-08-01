import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateIndexBuffer from "../../resourceManager/resourceState/ResourceStateIndexBuffer";
import ABaseBuffer, {GPU_BUFFER_CACHE_KEY, GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL} from "../core/ABaseBuffer";

const MANAGED_STATE_KEY = 'managedIndexBufferState'
type NumberArray = Array<number> | Uint32Array;

class IndexBuffer extends ABaseBuffer {
	[GPU_BUFFER_DATA_SYMBOL]: Uint32Array
	#indexNum: number = 0
	#triangleCount: number = 0

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

	get triangleCount(): number {
		return this.#triangleCount;
	}

	get indexNum(): number {
		return this.#indexNum;
	}



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
		this.#indexNum = data.length;
		const bufferDescriptor: GPUBufferDescriptor = {
			size: this[GPU_BUFFER_DATA_SYMBOL].byteLength,
			usage: this.usage,
			label: this.name
		}
		this[GPU_BUFFER_SYMBOL] = gpuDevice.createBuffer(bufferDescriptor);
		this.targetResourceManagedState.videoMemory += this[GPU_BUFFER_DATA_SYMBOL].byteLength || 0;
		this.#triangleCount = this.#indexNum / 3;
		gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, this[GPU_BUFFER_DATA_SYMBOL]);
	}

	// updatePartialData(dataStartIndex: number, data: NumberArray) {
	// 	const {gpuDevice} = this
	// 	if (dataStartIndex < 0 || dataStartIndex >= this[GPU_BUFFER_DATA_SYMBOL].length) {
	// 		consoleAndThrowError(`Offset value is out of data bounds. Tried to access index ${dataStartIndex} on data of length ${this[GPU_BUFFER_DATA_SYMBOL].length}`);
	// 	}
	// 	if (Array.isArray(data)) data = new Uint32Array(data)
	// 	this.#indexNum = data.length
	// 	gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], dataStartIndex, data)
	// }
}

Object.freeze(IndexBuffer)
export default IndexBuffer

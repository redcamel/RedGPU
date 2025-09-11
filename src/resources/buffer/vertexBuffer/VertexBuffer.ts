import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateVertexBuffer from "../../resourceManager/resourceState/ResourceStateVertexBuffer";
import ABaseBuffer, {GPU_BUFFER_CACHE_KEY, GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL} from "../core/ABaseBuffer";
import InterleavedStruct from "./InterleavedStruct";
import InterleavedStructElement from "./InterleavedStructElement";

const MANAGED_STATE_KEY = 'managedVertexBufferState'

class VertexBuffer extends ABaseBuffer {
	[GPU_BUFFER_DATA_SYMBOL]: Float32Array
	#vertexCount: number = 0
	#stride: number = 0
	#interleavedStruct: InterleavedStruct
	#triangleCount: number = 0

	constructor(
		redGPUContext: RedGPUContext,
		data: Array<number> | Float32Array,
		interleavedStruct: InterleavedStruct,
		usage: GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
		cacheKey: string = ''
	) {
		super(redGPUContext, MANAGED_STATE_KEY, usage)
		const {table} = this.targetResourceManagedState
		const cacheBuffer = table.get(cacheKey)
		// keepLog(this.targetResourceManagedState)
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

	get stride(): number {
		return this.#stride;
	}

	get interleavedStruct() {
		return this.#interleavedStruct
	}

	get vertexCount(): number {
		return this.#vertexCount;
	}

	get triangleCount(): number {
		return this.#triangleCount;
	}

	changeData(data: Array<number> | Float32Array, interleavedStruct?: InterleavedStruct) {
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

	updateData(data: Array<number> | Float32Array,offset:number=0) {
		//TODO 체크해야함
		if(data instanceof Array) data = new Float32Array(data);
		const {gpuDevice} = this;
		gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], offset, data,);
	}
	updateAllData(data: Array<number> | Float32Array) {
		//TODO 체크해야함
		const {gpuDevice} = this;
		gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, this[GPU_BUFFER_DATA_SYMBOL]);
	}

	#updateInterleavedStruct(interleavedStruct: InterleavedStruct) {
		this.#interleavedStruct = interleavedStruct;
		this.#vertexCount = 0;
		this.#stride = 0;
		for (const k in this.#interleavedStruct.define) {
			const value: InterleavedStructElement = this.#interleavedStruct.define[k];
			const elementCount = value.attributeStride / Float32Array.BYTES_PER_ELEMENT;
			this.#vertexCount += elementCount;
			this.#stride += elementCount;
		}
		this.#vertexCount = this[GPU_BUFFER_DATA_SYMBOL].length / this.#vertexCount;
	}
}

Object.freeze(VertexBuffer)
export default VertexBuffer

import RedGPUContext from "../../../context/RedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import basicRegisterResource from "../../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../../resourceManager/core/basicUnregisterResource";
import ResourceStateIndexBuffer from "../../resourceManager/resourceState/ResourceStateIndexBuffer";
import ABaseBuffer from "../core/ABaseBuffer";
import getCacheBufferFromResourceState from "../core/getCacheBufferFromResourceState";

const MANAGED_STATE_KEY = 'managedIndexBufferState'
type NumberArray = Array<number> | Uint32Array;

class IndexBuffer extends ABaseBuffer {
	#data: Uint32Array
	#indexNum: number = 0
	#triangleCount: number = 0
	#gpuBuffer: GPUBuffer

	constructor(
		redGPUContext: RedGPUContext,
		data: NumberArray,
		usage: GPUBufferUsageFlags = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
		cacheKey: string = ''
	) {
		super(redGPUContext, MANAGED_STATE_KEY, usage)
		const cacheBuffer = getCacheBufferFromResourceState(this, cacheKey) as IndexBuffer
		if (cacheBuffer) {
			return cacheBuffer
		} else {
			if (cacheKey) this.name = cacheKey
			this.changeData(data)
			basicRegisterResource(
				this,
				new ResourceStateIndexBuffer(this)
			)
		}
	}

	get gpuBuffer(): GPUBuffer {
		return this.#gpuBuffer;
	}

	get size(): number {
		return this.#data.byteLength || 0
	}

	get triangleCount(): number {
		return this.#triangleCount;
	}

	get indexNum(): number {
		return this.#indexNum;
	}

	destroy() {
		const temp = this.#gpuBuffer
		if (temp) {
			this.#gpuBuffer = null
			this.__fireListenerList(true)
			basicUnregisterResource(this)
			if (temp) temp.destroy()
		}
	}

	changeData(data: NumberArray) {
		const {gpuDevice} = this;
		if (Array.isArray(data)) {
			data = new Uint32Array(data);
		}
		if (this.#gpuBuffer) {
			this.targetResourceManagedState.videoMemory -= this.#data.byteLength || 0;
			let temp = this.#gpuBuffer
			requestAnimationFrame(() => {
				temp.destroy();
			})
			this.#gpuBuffer = null;
		}
		this.#data = data;
		this.#indexNum = data.length;
		this.targetResourceManagedState.videoMemory += this.#data.byteLength;
		const bufferDescriptor: GPUBufferDescriptor = {
			size: this.#data.byteLength,
			usage: this.usage,
			label: this.name
		}
		this.#gpuBuffer = gpuDevice.createBuffer(bufferDescriptor);
		this.#triangleCount = this.#indexNum / 3;
		gpuDevice.queue.writeBuffer(this.#gpuBuffer, 0, this.#data);
	}

	updatePartialData(dataStartIndex: number, data: NumberArray) {
		const {gpuDevice} = this
		if (dataStartIndex < 0 || dataStartIndex >= this.#data.length) {
			consoleAndThrowError(`Offset value is out of data bounds. Tried to access index ${dataStartIndex} on data of length ${this.#data.length}`);
		}
		if (Array.isArray(data)) data = new Uint32Array(data)
		this.#indexNum = data.length
		gpuDevice.queue.writeBuffer(this.#gpuBuffer, dataStartIndex, data)
	}
}

Object.freeze(IndexBuffer)
export default IndexBuffer

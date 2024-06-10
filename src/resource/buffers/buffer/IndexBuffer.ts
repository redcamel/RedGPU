import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUContextBase from "../../../context/RedGPUContextBase";

/**
 * IndexBuffer
 */
class IndexBuffer extends RedGPUContextBase {
	#gpuBuffer: GPUBuffer
	#indexNum: GPUSize64
	#byteLength: GPUSize64
	#descriptor: GPUBufferDescriptor
	#usage: GPUSize64

	/**
	 * IndexBuffer
	 */
	constructor(redGPUContext: RedGPUContext, data: Uint32Array, usage: GPUSize64 = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST) {
		super(redGPUContext)
		this.#indexNum = data.length
		this.#byteLength = data.byteLength
		this.#usage = usage
		this.#descriptor = {
			size: data.byteLength,
			usage: this.#usage
		};
		this.#gpuBuffer = this.redGPUContext.gpuDevice.createBuffer(this.#descriptor);
		this.update(0, data)
		// console.log(this)
	}

	get gpuBuffer(): GPUBuffer {
		return this.#gpuBuffer;
	}

	get indexNum(): GPUSize64 {
		return this.#indexNum;
	}

	get byteLength(): GPUSize64 {
		return this.#byteLength;
	}

	get descriptor(): GPUBufferDescriptor {
		return this.#descriptor;
	}

	get usage(): GPUSize64 {
		return this.#usage;
	}

	update(gpuBufferOffset: GPUSize64, data: | BufferSource | SharedArrayBuffer, dataOffset?: GPUSize64, size?: GPUSize64) {
		this.redGPUContext.gpuDevice.queue.writeBuffer(this.#gpuBuffer, gpuBufferOffset, data, dataOffset, size);
	}

	destroy() {
		//TODO
	}
}

export default IndexBuffer


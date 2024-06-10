import RedGPUContext from "../../../context/RedGPUContext";
// import VertexBufferDescriptor from "./VertexBufferDescriptor";
import RedGPUContextBase from "../../../context/RedGPUContextBase";
import InterleaveInfo from "../interleaveInfo/InterleaveInfo";

/**
 * VertexBuffer
 */
class VertexBuffer extends RedGPUContextBase {
	#gpuBuffer: GPUBuffer
	#byteLength: GPUSize64
	#descriptor: GPUBufferDescriptor
	#usage: GPUSize64
	#vertexCount = 0;
	#interleaveInfo: InterleaveInfo

	constructor(redGPUContext: RedGPUContext, data: Float32Array, interleaveInfo: InterleaveInfo, usage: GPUSize64 = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
		super(redGPUContext)
		this.#interleaveInfo = interleaveInfo;
		this.#vertexCount = data.length / this.#interleaveInfo.stride;
		this.#byteLength = data.byteLength
		this.#usage = usage
		this.#descriptor = {
			size: this.#byteLength,
			usage: usage
		};
		this.#gpuBuffer = this.redGPUContext.gpuDevice.createBuffer(this.#descriptor);
		this.update(0, data)
		// console.log(this)
	}

	get gpuBuffer(): GPUBuffer {
		return this.#gpuBuffer;
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

	get vertexCount() {
		return this.#vertexCount;
	}

	get interleaveInfo(): InterleaveInfo {
		return this.#interleaveInfo;
	}

	get arrayStride(): number {
		return this.#interleaveInfo.arrayStride;
	}

	get attributes(): any[] {
		return this.#interleaveInfo.attributes;
	}

	update(gpuBufferOffset: GPUSize64, data: | BufferSource | SharedArrayBuffer, dataOffset?: GPUSize64, size?: GPUSize64) {
		this.redGPUContext.gpuDevice.queue.writeBuffer(this.#gpuBuffer, gpuBufferOffset, data, dataOffset, size);
	}

	destroy() {
		//TODO
	}
}

export default VertexBuffer


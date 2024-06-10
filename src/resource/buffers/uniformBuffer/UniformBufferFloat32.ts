import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUContextBase from "../../../context/RedGPUContextBase";
import throwError from "../../../util/errorFunc/throwError";
import UniformBufferDescriptor from "./UniformBufferDescriptor";

/**
 * 유니폼 버퍼
 */
class UniformBufferFloat32 extends RedGPUContextBase {
	#gpuBuffer: GPUBuffer
	#typeArraySize: GPUSize64
	#gpuBufferSize: GPUSize64
	#descriptor: UniformBufferDescriptor
	#usage: GPUSize64
	#data: Float32Array

	constructor(
		redGPUContext: RedGPUContext,
		descriptor: UniformBufferDescriptor,
		usage: GPUSize64 = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
	) {
		super(redGPUContext)
		this.#descriptor = descriptor
		this.#typeArraySize = descriptor.typeArraySize
		this.#gpuBufferSize = descriptor.gpuBufferSize
		this.#usage = usage
		this.#data = new Float32Array(this.#typeArraySize)
		this.#gpuBuffer = this.redGPUContext.gpuDevice.createBuffer({
			size: this.#gpuBufferSize,
			usage: this.#usage,
		});
		// console.log(this)
	}

	get gpuBuffer(): GPUBuffer {
		return this.#gpuBuffer;
	}

	get typeArraySize(): GPUSize64 {
		return this.#typeArraySize;
	}

	get gpuBufferSize(): GPUSize64 {
		return this.#gpuBufferSize;
	}

	get descriptor(): UniformBufferDescriptor {
		return this.#descriptor;
	}

	get usage(): GPUSize64 {
		return this.#usage;
	}

	get data(): Float32Array {
		return this.#data;
	}

	set data(value: Float32Array) {
		this.#data = value;
	}

	update(data, gpuBufferOffset: GPUSize64 = 0, dataOffset?: GPUSize64, size?: GPUSize64) {
		if (!data) throwError('반드시 데이터가 있어야함')
		this.#data = data
		this.redGPUContext.gpuDevice.queue.writeBuffer(this.#gpuBuffer, gpuBufferOffset, data, dataOffset, size);
	}
}

export default UniformBufferFloat32

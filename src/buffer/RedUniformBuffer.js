"use strict";
export default class RedUniformBuffer {
	#redGPU;
	GPUBuffer;
	uniformBufferDescriptor;

	constructor(redGPU) {
		this.#redGPU = redGPU;
	}

	setBuffer(uniformBufferDescriptor) {
		if (this.GPUBuffer) this.GPUBuffer.destroy();
		this.GPUBuffer = this.#redGPU.device.createBuffer(uniformBufferDescriptor);
		this.uniformBufferDescriptor = uniformBufferDescriptor;
	};
}
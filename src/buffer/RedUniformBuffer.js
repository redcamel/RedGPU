/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 17:31:6
 *
 */

"use strict";
const TABLE = [];
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
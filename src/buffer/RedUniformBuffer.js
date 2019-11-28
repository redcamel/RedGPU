/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 11:53:2
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
		// if (this.GPUBuffer){
		// 	console.log(this.GPUBuffer)
		// 	this.GPUBuffer.destroy(); //TODO 이거 삭제하면 왜안되는지 알아내야함
		// }
		this.GPUBuffer = this.#redGPU.device.createBuffer(uniformBufferDescriptor);
		this.uniformBufferDescriptor = uniformBufferDescriptor;
	};
}
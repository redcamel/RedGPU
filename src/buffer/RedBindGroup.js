/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.30 16:32:22
 *
 */

"use strict";

export default class RedBindGroup {
	#redGPU;
	GPUBindGroup = null;

	constructor(redGPU) {
		this.#redGPU = redGPU;
	}

	setGPUBindGroup(uniformBindGroupDescriptor) {
		console.log('uniformBindGroupDescriptor', uniformBindGroupDescriptor);
		this.GPUBindGroup = this.#redGPU.device.createBindGroup(uniformBindGroupDescriptor);
	}

	clear() {
		this.GPUBindGroup = null;
	}
}
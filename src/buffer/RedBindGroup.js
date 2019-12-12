/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.12 21:19:8
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
		console.time('uniformBindGroupDescriptor')
		console.log('uniformBindGroupDescriptor', uniformBindGroupDescriptor);
		this.GPUBindGroup = this.#redGPU.device.createBindGroup(uniformBindGroupDescriptor);
		console.timeEnd('uniformBindGroupDescriptor')
	}

	clear() {
		this.GPUBindGroup = null;
	}
}
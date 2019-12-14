/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 13:16:40
 *
 */

"use strict";

export default class RedBindGroup {
	#redGPUContext;
	GPUBindGroup = null;

	constructor(redGPUContext) {
		this.#redGPUContext = redGPUContext;
	}

	setGPUBindGroup(uniformBindGroupDescriptor) {
		console.time('uniformBindGroupDescriptor')
		console.log('uniformBindGroupDescriptor', uniformBindGroupDescriptor);
		this.GPUBindGroup = this.#redGPUContext.device.createBindGroup(uniformBindGroupDescriptor);
		console.timeEnd('uniformBindGroupDescriptor')
	}

	clear() {
		this.GPUBindGroup = null;
	}
}
/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:27
 *
 */

"use strict";

import GPUContext from "../GPUContext.js";

export default class BindGroup {
	#redGPUContext;
	GPUBindGroup = null;

	constructor(redGPUContext) {
		this.#redGPUContext = redGPUContext;
	}

	setGPUBindGroup(uniformBindGroupDescriptor) {
		if (GPUContext.useDebugConsole) console.time('uniformBindGroupDescriptor');
		if (GPUContext.useDebugConsole) console.log('uniformBindGroupDescriptor', uniformBindGroupDescriptor);
		this.GPUBindGroup = this.#redGPUContext.device.createBindGroup(uniformBindGroupDescriptor);
		if (GPUContext.useDebugConsole) console.timeEnd('uniformBindGroupDescriptor')
	}

	clear() {
		this.GPUBindGroup = null;
	}
}
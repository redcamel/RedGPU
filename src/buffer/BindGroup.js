/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 13:27:33
 *
 */

"use strict";

import RedGPUContext from "../RedGPUContext.js";

export default class BindGroup {
	#redGPUContext;
	GPUBindGroup = null;

	constructor(redGPUContext) {
		this.#redGPUContext = redGPUContext;
	}

	setGPUBindGroup(uniformBindGroupDescriptor) {
		if (RedGPUContext.useDebugConsole) console.time('uniformBindGroupDescriptor');
		if (RedGPUContext.useDebugConsole) console.log('uniformBindGroupDescriptor', uniformBindGroupDescriptor);
		this.GPUBindGroup = this.#redGPUContext.device.createBindGroup(uniformBindGroupDescriptor);
		if (RedGPUContext.useDebugConsole) console.timeEnd('uniformBindGroupDescriptor')
	}

	clear() {
		this.GPUBindGroup = null;
	}
}
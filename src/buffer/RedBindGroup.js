/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 23:2:58
 *
 */

"use strict";

export default class RedBindGroup {
	#redGPU;
	GPUBindGroup = null;

	constructor(redGPU) {
		this.#redGPU = redGPU;
	}

	setGPUBindGroup(targetMesh, material) {
		material.bindings[0]['resource']['buffer'] = material.uniformBuffer_vertex.GPUBuffer;
		material.bindings[1]['resource']['buffer'] = material.uniformBuffer_fragment.GPUBuffer;
		this.GPUBindGroup = this.#redGPU.device.createBindGroup(material.uniformBindGroupDescriptor);
	}

	clear() {
		this.GPUBindGroup = null;
	}
}
/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
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
		material.bindings[0]['resource']['buffer'] = targetMesh.uniformBuffer_vertex.GPUBuffer;
		material.bindings[1]['resource']['buffer'] = targetMesh.uniformBuffer_fragment.GPUBuffer;
		this.GPUBindGroup = this.#redGPU.device.createBindGroup(material.uniformBindGroupDescriptor);
	}

	clear() {
		this.GPUBindGroup = null;
	}
}
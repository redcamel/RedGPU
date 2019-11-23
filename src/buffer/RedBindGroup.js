"use strict"

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
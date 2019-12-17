/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 11:18:30
 *
 */

"use strict";
import RedUniformBufferDescriptor from "./RedUniformBufferDescriptor.js";
import RedUTIL from "../util/RedUTIL.js";
import RedGPUContext from "../RedGPUContext.js";
import RedUUID from "../base/RedUUID.js";

export default class RedUniformBuffer extends RedUUID {
	#redGPUContext;
	GPUBuffer;
	uniformBufferDescriptor;

	constructor(redGPUContext) {
		super();
		if (!(redGPUContext instanceof RedGPUContext)) RedUTIL.throwFunc(`${this.constructor.name} - only allow redGPUContext Instance.- inputValue : ${redGPUContext} { type : ${typeof redGPUContext} }`);
		this.#redGPUContext = redGPUContext;
	}

	setBuffer(uniformBufferDescriptor) {
		if (!(uniformBufferDescriptor instanceof RedUniformBufferDescriptor)) RedUTIL.throwFunc(`${this.constructor.name} - only allow RedUniformBufferDescriptor Instance.- inputValue : ${uniformBufferDescriptor} { type : ${typeof uniformBufferDescriptor} }`);
		if (this.GPUBuffer) this.GPUBuffer.destroy();
		this.GPUBuffer = this.#redGPUContext.device.createBuffer(uniformBufferDescriptor);
		this.float32Array = new Float32Array(uniformBufferDescriptor.size / Float32Array.BYTES_PER_ELEMENT);
		this.uniformBufferDescriptor = uniformBufferDescriptor;
	};
}
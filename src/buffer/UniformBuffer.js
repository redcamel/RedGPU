/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */

"use strict";
import UniformBufferDescriptor from "./UniformBufferDescriptor.js";
import UTIL from "../util/UTIL.js";
import RedGPUContext from "../RedGPUContext.js";
import UUID from "../base/UUID.js";

export default class UniformBuffer extends UUID {
	#redGPUContext;
	GPUBuffer;
	uniformBufferDescriptor;

	constructor(redGPUContext) {
		super();
		if (!(redGPUContext instanceof RedGPUContext)) UTIL.throwFunc(`${this.constructor.name} - only allow redGPUContext Instance.- inputValue : ${redGPUContext} { type : ${typeof redGPUContext} }`);
		this.#redGPUContext = redGPUContext;
	}

	setBuffer(uniformBufferDescriptor) {
		if (!(uniformBufferDescriptor instanceof UniformBufferDescriptor)) UTIL.throwFunc(`${this.constructor.name} - only allow UniformBufferDescriptor Instance.- inputValue : ${uniformBufferDescriptor} { type : ${typeof uniformBufferDescriptor} }`);
		if (this.GPUBuffer) this.GPUBuffer.destroy();
		this.GPUBuffer = this.#redGPUContext.device.createBuffer(uniformBufferDescriptor);
		this.float32Array = new Float32Array(uniformBufferDescriptor.size / Float32Array.BYTES_PER_ELEMENT);
		this.uniformBufferDescriptor = uniformBufferDescriptor;
	};
}
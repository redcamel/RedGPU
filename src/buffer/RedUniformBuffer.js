/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.11 20:19:9
 *
 */

"use strict";
import RedUniformBufferDescriptor from "./RedUniformBufferDescriptor.js";
import RedUTIL from "../util/RedUTIL.js";
import RedGPU from "../RedGPU.js";
import RedUUID from "../base/RedUUID.js";

export default class RedUniformBuffer extends RedUUID{
	#redGPU;
	GPUBuffer;
	uniformBufferDescriptor;

	constructor(redGPU) {
		super()
		if (!(redGPU instanceof RedGPU)) RedUTIL.throwFunc(`${this.constructor.name} - only allow redGPU Instance.- inputValue : ${redGPU} { type : ${typeof redGPU} }`);
		this.#redGPU = redGPU;
	}

	setBuffer(uniformBufferDescriptor) {
		if (!(uniformBufferDescriptor instanceof RedUniformBufferDescriptor)) RedUTIL.throwFunc(`${this.constructor.name} - only allow RedUniformBufferDescriptor Instance.- inputValue : ${uniformBufferDescriptor} { type : ${typeof uniformBufferDescriptor} }`);
		if (this.GPUBuffer) this.GPUBuffer.destroy();
		this.GPUBuffer = this.#redGPU.device.createBuffer(uniformBufferDescriptor);
		this.uniformBufferDescriptor = uniformBufferDescriptor;
	};
}
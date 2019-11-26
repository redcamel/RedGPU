/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

"use strict";

import RedTypeSize from "../resources/RedTypeSize.js";

export default class RedUniformBufferDescriptor {
	constructor(redStruct, usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST) {
		this.redStruct = redStruct;
		let offset = 0;
		let FLOAT4_SIZE = RedTypeSize.float4;
		this.redStruct.map((v) => {
			v.offset = offset;
			if (v.size <= FLOAT4_SIZE) {
				let t0 = Math.floor(offset / FLOAT4_SIZE);
				let t1 = Math.floor((offset + v.size) / FLOAT4_SIZE);
				if (t0 == t1) offset += v.size;
				else {
					v.offset = offset += FLOAT4_SIZE - offset % FLOAT4_SIZE
				}
			} else {
				if (offset == 0) v.offset = 0;
				else {
					if (offset % 16) v.offset = offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
					else v.offset = offset
				}
				offset += RedTypeSize.mat4
			}
		});
		this.size = offset + this.redStruct[this.redStruct.length - 1].size;
		this.usage = usage;
		console.log(this)
	}
}
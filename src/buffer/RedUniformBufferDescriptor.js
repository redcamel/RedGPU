/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.30 19:22:30
 *
 */

"use strict";

import RedTypeSize from "../resources/RedTypeSize.js";
import RedUUID from "../base/RedUUID.js";

export default class RedUniformBufferDescriptor {
	constructor(redStruct, usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST) {
		this.redStruct = JSON.parse(JSON.stringify(redStruct));
		this.redStructOffsetMap = {};
		let size = 0;
		let offset = 0;
		let FLOAT4_SIZE = RedTypeSize.float4;
		this.redStruct.map((v) => {
			v.offset = offset;
			if (v.size <= FLOAT4_SIZE) {
				let t0 = Math.round(offset / FLOAT4_SIZE);
				let t1 = Math.round((offset + v.size) / FLOAT4_SIZE);
				if (t0 == t1) offset += v.size;
				else {
					offset += FLOAT4_SIZE - offset % FLOAT4_SIZE
				}
			} else {
				if (offset == 0) v.offset = 0;
				else {
					if (offset % 16) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;

				}
				offset += RedTypeSize.mat4
			}
			console.log(v);
			this.redStructOffsetMap[v['valueName']] = v.offset;
			v._UUID = v.valueName + '_' + RedUUID.makeUUID()
		});
		this.size = this.redStruct.length ? (offset + this.redStruct[this.redStruct.length - 1].size + (offset + this.redStruct[this.redStruct.length - 1].size) % 4) : FLOAT4_SIZE;
		this.usage = usage;
		console.log(this)
	}
}
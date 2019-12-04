/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.4 10:51:28
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
				let t0 = Math.floor(offset / FLOAT4_SIZE);
				let t1 = Math.floor((offset + v.size-1) / FLOAT4_SIZE);
				if (t0 == t1) offset += v.size;
				else {
					offset += FLOAT4_SIZE - offset % FLOAT4_SIZE
					offset += v.size
				}
			} else {
				if (offset % FLOAT4_SIZE) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
				offset += v.size
			}
			this.redStructOffsetMap[v['valueName']] = v.offset;
			v._UUID = v.valueName + '_' + RedUUID.makeUUID()
		});
		this.size = this.redStruct.length ? (offset + this.redStruct[this.redStruct.length - 1].size) : FLOAT4_SIZE;
		this.usage = usage;
		console.log(this)
	}
}
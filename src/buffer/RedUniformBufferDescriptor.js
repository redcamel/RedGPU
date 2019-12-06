/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";

import RedTypeSize from "../resources/RedTypeSize.js";
import RedUUID from "../base/RedUUID.js";

export default class RedUniformBufferDescriptor {
	constructor(redStruct, usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST) {
		this.redStruct = JSON.parse(JSON.stringify(redStruct));
		this.redStructOffsetMap = {};
		let offset = 0;
		let FLOAT4_SIZE = RedTypeSize.float4;
		this.redStruct.map((v) => {
			// console.log( v.valueName, '사이즈', v.size, '현재 오프셋',offset, offset % FLOAT4_SIZE, '빈공간', FLOAT4_SIZE - offset % FLOAT4_SIZE)
			if (v.size <= FLOAT4_SIZE) {
				let t0 = Math.floor(offset / FLOAT4_SIZE);
				let t1 = Math.floor((offset + v.size - 1) / FLOAT4_SIZE);
				if (t0 != t1) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
				v.offset = offset;
				// console.log(v.valueName, '결정된 오프셋', offset)
				offset += v.size
			} else {
				if (offset % FLOAT4_SIZE) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
				v.offset = offset;
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
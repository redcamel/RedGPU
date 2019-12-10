/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.10 14:18:48
 *
 */

"use strict";

import RedTypeSize from "../resources/RedTypeSize.js";
import RedUUID from "../base/RedUUID.js";
import RedUTIL from "../util/RedUTIL.js";

export default class RedUniformBufferDescriptor {
	constructor(redStruct = [], usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST) {
		if (!Array.isArray(redStruct)) RedUTIL.throwFunc(`${this.constructor.name} - only allow Array Instance. / inputValue : ${redStruct} { type : ${typeof redStruct} }`);
		this.redStruct = JSON.parse(JSON.stringify(redStruct));
		this.redStructOffsetMap = {};
		let offset = 0;
		let FLOAT4_SIZE = RedTypeSize.float4;
		this.redStruct.map((v) => {
			if (!v.valueName) RedUTIL.throwFunc(`${this.constructor.name} - need valueName / inputValue : ${v.valueName} { type : ${typeof v.valueName} }`);
			if (!v.hasOwnProperty('size')) RedUTIL.throwFunc(`${this.constructor.name} - need size / inputValue : ${v.size} { type : ${typeof v.size} }`);
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
		let t0 = offset % FLOAT4_SIZE
		this.size = this.redStruct.length ? (offset + (t0 ?(FLOAT4_SIZE - t0) :  0 )) : FLOAT4_SIZE;
		this.usage = usage;
		console.log(this)
	}
}
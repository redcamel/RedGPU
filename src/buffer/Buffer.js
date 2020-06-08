/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 20:56:47
 *
 */

"use strict";
import UUID from "../base/UUID.js";
import RedGPUContext from "../RedGPUContext.js";

export default class Buffer extends UUID {
	static TYPE_VERTEX = 'vertexBuffer';
	static TYPE_INDEX = 'indexBuffer';
	type;
	vertexCount;
	bufferDescriptor;
	GPUBuffer;
	redGPUContext;

	constructor(redGPUContext, typeKey, bufferType, data, interleaveInfo, usage) {
		super();
		if (redGPUContext.state.Buffer[bufferType].has(typeKey)) return redGPUContext.state.Buffer[bufferType].get(typeKey);
		this.redGPUContext = redGPUContext
		let tUsage;
		this.type = bufferType;
		this.vertexCount = 0;
		this.stride = 0;
		switch (bufferType) {
			case Buffer.TYPE_VERTEX :
				tUsage = usage || GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
				this.interleaveInfo = interleaveInfo;
				interleaveInfo.forEach(v => {
					this.vertexCount += v['stride'] / Float32Array.BYTES_PER_ELEMENT;
					this.stride += v['stride'] / Float32Array.BYTES_PER_ELEMENT
				});
				this.vertexCount = data.length / this.vertexCount;
				break;
			case Buffer.TYPE_INDEX :
				tUsage = usage || GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST;
				this.indexNum = data.length;
				break
		}
		// 실제 버퍼 생성
		this.bufferDescriptor = {
			size: data.byteLength,
			usage: tUsage
		};
		this.data = data;
		this.GPUBuffer = redGPUContext.device.createBuffer(this.bufferDescriptor);
		console.log(redGPUContext.device)
		redGPUContext.device.defaultQueue.writeBuffer(this.GPUBuffer,0,data)
		// this.GPUBuffer.setSubData(0, data);
		redGPUContext.state.Buffer[bufferType].set(typeKey, this);
		if (RedGPUContext.useDebugConsole) console.log(this);
	}
	update(data) {
		this.data = data;
		// this.GPUBuffer.setSubData(0, new Float32Array(data));
		this.redGPUContext.device.defaultQueue.writeBuffer(this.GPUBuffer,0, new Float32Array(data))
	}

	destroy() {
		if (this.GPUBuffer) this.GPUBuffer.destroy();
		this.GPUBuffer = null
	}
}
"use strict";
import RedUUID from "../base/RedUUID.js";

export default class RedBuffer extends RedUUID {
	static TYPE_VERTEX = 'vertexBuffer';
	static TYPE_INDEX = 'indexBuffer';

	constructor(redGPU, typeKey, bufferType, data, interleaveInfo, usage) {
		super()
		if (redGPU.state.RedBuffer[bufferType].has(typeKey)) return redGPU.state.RedBuffer[bufferType].get(typeKey);
		let tUsage;
		this.type = bufferType;
		switch (bufferType) {
			case RedBuffer.TYPE_VERTEX :
				tUsage = usage || GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
				this.interleaveInfo = interleaveInfo;
				break;
			case RedBuffer.TYPE_INDEX :
				tUsage = usage || GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST;
				this.indexNum = data.length;
				break
		}
		// 실제 버퍼 생성
		this.bufferDescriptor = {
			size: data.byteLength,
			usage: tUsage
		};
		this.originData = data;
		this.GPUBuffer =  redGPU.device.createBuffer(this.bufferDescriptor);
		this.GPUBuffer.setSubData(0, data);
		redGPU.state.RedBuffer[bufferType].set(typeKey, this);

		console.log(this);
	}
}
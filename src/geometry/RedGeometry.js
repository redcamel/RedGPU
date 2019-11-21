"use strict";
export default class RedGeometry {
	interleaveBuffer;
	indexBuffer;
	vertexState;

	constructor(redGPU, interleaveBuffer, indexBuffer) {
		this.interleaveBuffer = interleaveBuffer;
		this.indexBuffer = indexBuffer;
		console.log('interleaveBuffer.interleaveInfo', interleaveBuffer.interleaveInfo);
		let arrayStride = 0;
		let attributes = [];
		interleaveBuffer.interleaveInfo.forEach(function (v, idx) {
			attributes.push(
				{
					attributeHint: v['attributeHint'],
					shaderLocation: idx,
					offset: arrayStride,
					format: v['format']
				}
			);
			arrayStride += v['stride'];
		});
		this.vertexState = {
			indexFormat: 'uint32',
			vertexBuffers: [
				{
					arrayStride: arrayStride,
					attributes: attributes
				}
			]
		};
		console.log(this)
	}
}
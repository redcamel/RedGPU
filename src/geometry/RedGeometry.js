/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

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
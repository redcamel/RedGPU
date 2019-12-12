/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.12 18:13:13
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
		// attributes.forEach(function(v){console.log(v)});
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
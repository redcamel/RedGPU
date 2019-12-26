/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.26 15:24:22
 *
 */

"use strict";
import RedGPUContext from "../RedGPUContext.js";
import baseGeometry from "../base/baseGeometry.js";

export default class Geometry extends baseGeometry {
	interleaveBuffer;
	indexBuffer;
	vertexState;
	constructor(redGPUContext, interleaveBuffer, indexBuffer) {
		super();
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
		this.volumeCalculate()
		if (RedGPUContext.useDebugConsole) console.log(this)
	}
}
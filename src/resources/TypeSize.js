/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.11 18:20:56
 *
 */

"use strict";
let TypeSize = {
	'float': 1 * Float32Array.BYTES_PER_ELEMENT,
	'float2': 2 * Float32Array.BYTES_PER_ELEMENT,
	'float3': 3 * Float32Array.BYTES_PER_ELEMENT,
	'float4': 4 * Float32Array.BYTES_PER_ELEMENT,
	'mat2': 4 * Float32Array.BYTES_PER_ELEMENT,
	'mat3': 12 * Float32Array.BYTES_PER_ELEMENT, /* use 4*3 */
	'mat4': 16 * Float32Array.BYTES_PER_ELEMENT
};
export default TypeSize
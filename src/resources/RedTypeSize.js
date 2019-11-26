/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

"use strict";
let RedTypeSize = {
	'float': 1 * Float32Array.BYTES_PER_ELEMENT,
	'float2': 2 * Float32Array.BYTES_PER_ELEMENT,
	'float3': 3 * Float32Array.BYTES_PER_ELEMENT,
	'float4': 4 * Float32Array.BYTES_PER_ELEMENT,
	'mat2': 16 * Float32Array.BYTES_PER_ELEMENT,
	'mat3': 16 * Float32Array.BYTES_PER_ELEMENT,
	'mat4': 16 * Float32Array.BYTES_PER_ELEMENT
};
export default RedTypeSize
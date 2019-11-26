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
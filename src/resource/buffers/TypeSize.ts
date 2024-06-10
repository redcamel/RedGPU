"use strict";
let TypeSize = {
	'float32': Float32Array.BYTES_PER_ELEMENT,
	'float32x2': 2 * Float32Array.BYTES_PER_ELEMENT,
	"float32x3": 3 * Float32Array.BYTES_PER_ELEMENT,
	'float32x4': 4 * Float32Array.BYTES_PER_ELEMENT,
	'mat2': 4 * 2 * Float32Array.BYTES_PER_ELEMENT,
	'mat3': 4 * 3 * Float32Array.BYTES_PER_ELEMENT,
	'mat4': 4 * 4 * Float32Array.BYTES_PER_ELEMENT
};
export default TypeSize;

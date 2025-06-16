export type TypeInterleave = { numElements: number; stride: number, gpuVertexFormat: GPUVertexFormat, offset: number };

class InterleaveType {
	static get float32(): TypeInterleave {
		return {numElements: 1, stride: Float32Array.BYTES_PER_ELEMENT, gpuVertexFormat: 'float32', offset: 0};
	}

	static get float32x2(): TypeInterleave {
		return {numElements: 2, stride: Float32Array.BYTES_PER_ELEMENT * 2, gpuVertexFormat: 'float32x2', offset: 0}
	}

	static get float32x3(): TypeInterleave {
		return {numElements: 3, stride: Float32Array.BYTES_PER_ELEMENT * 3, gpuVertexFormat: 'float32x3', offset: 0}
	}

	static get float32x4(): TypeInterleave {
		return {numElements: 4, stride: Float32Array.BYTES_PER_ELEMENT * 4, gpuVertexFormat: 'float32x4', offset: 0}
	}
}

Object.freeze(InterleaveType)
export default InterleaveType

class GeometryGPURenderInfo {
	buffers: GPUVertexBufferLayout[]

	constructor(
		buffers: GPUVertexBufferLayout[],
	) {
		this.buffers = buffers;
	}
}

Object.freeze(GeometryGPURenderInfo)
export default GeometryGPURenderInfo

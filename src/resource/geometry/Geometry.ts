/**
 *
 */
import RedGPUContext from "../../context/RedGPUContext";
import RedGPUContextBase from "../../context/RedGPUContextBase";
import IndexBuffer from "../buffers/buffer/IndexBuffer";
import VertexBuffer from "../buffers/buffer/VertexBuffer";
import InterleaveInfo from "../buffers/interleaveInfo/InterleaveInfo";

class Geometry extends RedGPUContextBase {
	#data: Float32Array
	#indexData: Uint32Array
	#vertexGpuBuffer: GPUBuffer
	#vertexBuffer: VertexBuffer
	#indexGpuBuffer: GPUBuffer
	#indexBuffer: IndexBuffer
	//TODO - LOD Generator
	#volume;

	constructor(redGPUContext: RedGPUContext, data: Float32Array, interleaveInfo: InterleaveInfo, indexData?: Uint32Array) {
		super(redGPUContext)
		this.#data = data
		this.#indexData = indexData
		this.#vertexBuffer = new VertexBuffer(redGPUContext, data, interleaveInfo)
		this.#vertexGpuBuffer = this.#vertexBuffer.gpuBuffer
		// console.log('보자', this.#vertexBuffer.interleaveInfo)
		if (indexData) {
			this.#indexBuffer = new IndexBuffer(redGPUContext, indexData)
			this.#indexGpuBuffer = this.#indexBuffer.gpuBuffer
		}
		// console.log(this)
	}

	get data(): Float32Array {
		return this.#data;
	}

	get indexData(): Uint32Array {
		return this.#indexData;
	}

	get vertexGpuBuffer(): GPUBuffer {
		return this.#vertexGpuBuffer;
	}

	get vertexBuffer(): VertexBuffer {
		return this.#vertexBuffer;
	}

	get indexGpuBuffer(): GPUBuffer {
		return this.#indexGpuBuffer;
	}

	get indexBuffer(): IndexBuffer {
		return this.#indexBuffer;
	}

	get volume() {
		if (!this.#volume) this.volumeCalculate();
		return this.#volume;
	}

	volumeCalculate() {
		// console.time('volumeCalculate');
		let minX, minY, minZ, maxX, maxY, maxZ, t0, t1, t2, t, i, len;
		let stride = this.#vertexBuffer.interleaveInfo.stride
		// console.log('stride',this.#vertexBuffer.interleaveInfo)
		// if (!volume[this]) {
		minX = minY = minZ = maxX = maxY = maxZ = 0;
		t = this.#data;
		i = 0;
		len = this.#vertexBuffer['vertexCount'];
		for (i; i < len; i++) {
			t0 = i * stride , t1 = t0 + 1, t2 = t0 + 2,
				minX = t[t0] < minX ? t[t0] : minX,
				maxX = t[t0] > maxX ? t[t0] : maxX,
				minY = t[t1] < minY ? t[t1] : minY,
				maxY = t[t1] > maxY ? t[t1] : maxY,
				minZ = t[t2] < minZ ? t[t2] : minZ,
				maxZ = t[t2] > maxZ ? t[t2] : maxZ;
		}
		this.#volume = {};
		this.#volume.volume = [maxX - minX, maxY - minY, maxZ - minZ];
		this.#volume.minX = minX;
		this.#volume.maxX = maxX;
		this.#volume.minY = minY;
		this.#volume.maxY = maxY;
		this.#volume.minZ = minZ;
		this.#volume.maxZ = maxZ;
		this.#volume.xSize = Math.max(Math.abs(minX), Math.abs(maxX));
		this.#volume.ySize = Math.max(Math.abs(minY), Math.abs(maxY));
		this.#volume.zSize = Math.max(Math.abs(minZ), Math.abs(maxZ));
		// this.#volume.xSize = Math.max(Math.abs(minX), Math.abs(maxX)) - Math.min(Math.abs(minX), Math.abs(maxX)) ;
		// this.#volume.ySize = Math.max(Math.abs(minY), Math.abs(maxY)) - Math.min(Math.abs(minY), Math.abs(maxY));
		// this.#volume.zSize = Math.max(Math.abs(minZ), Math.abs(maxZ)) - Math.min(Math.abs(minZ), Math.abs(maxZ));
		this.#volume.geometryRadius = Math.max(
			this.#volume.xSize,
			this.#volume.ySize,
			this.#volume.zSize
		);
		// }
		// console.timeEnd('volumeCalculate');
		return this.#volume;
	}
}

export default Geometry

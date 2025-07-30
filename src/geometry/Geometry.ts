import RedGPUContext from "../context/RedGPUContext";
import GeometryGPURenderInfo from "../renderInfos/GeometryGPURenderInfo";
import IndexBuffer from "../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../resources/buffer/vertexBuffer/VertexBuffer";
import ResourceBase from "../resources/ResourceBase";
import {keepLog} from "../utils";
import AABB from "../utils/math/bound/AABB";
import calculateGeometryAABB from "../utils/math/bound/calculateGeometryAABB";

class Geometry extends ResourceBase {
	gpuRenderInfo: GeometryGPURenderInfo
	#vertexBuffer: VertexBuffer
	#indexBuffer: IndexBuffer
	#volume: AABB;

	constructor(redGPUContext: RedGPUContext, vertexBuffer: VertexBuffer, indexBuffer?: IndexBuffer) {
		super(redGPUContext)
		this.#updateVertexBuffer(vertexBuffer)
		this.#updateIndexBuffer(indexBuffer)
		const {interleavedStruct} = this.#vertexBuffer
		this.gpuRenderInfo = new GeometryGPURenderInfo(
			[
				{
					arrayStride: interleavedStruct.arrayStride,
					attributes: interleavedStruct.attributes,
				}
			]
		)
	}

	get vertexBuffer(): VertexBuffer {
		return this.#vertexBuffer;
	}

	get indexBuffer(): IndexBuffer {
		return this.#indexBuffer;
	}

	get volume(): AABB {
		if (!this.#volume) {
			this.#volume = calculateGeometryAABB(this.#vertexBuffer);
		}
		return this.#volume;
	}

	#updateVertexBuffer(vertexBuffer: VertexBuffer) {
		const prevBuffer = this.#vertexBuffer
		this.#vertexBuffer = vertexBuffer
		if (prevBuffer) prevBuffer.__removeDirtyPipelineListener(this.#updateVertexBufferState);
		if (vertexBuffer) vertexBuffer.__addDirtyPipelineListener(this.#updateVertexBufferState);
		this.#volume = null
	}

	#updateIndexBuffer(indexBuffer: IndexBuffer) {
		const prevBuffer = this.#indexBuffer
		this.#indexBuffer = indexBuffer
		if (prevBuffer) prevBuffer.__removeDirtyPipelineListener(this.#updateIndexBufferState);
		if (indexBuffer) indexBuffer.__addDirtyPipelineListener(this.#updateIndexBufferState);
	}

	#updateVertexBufferState() {
		this.__fireListenerList();
	}

	#updateIndexBufferState() {
		this.__fireListenerList();
	}
}

Object.freeze(Geometry)
export default Geometry

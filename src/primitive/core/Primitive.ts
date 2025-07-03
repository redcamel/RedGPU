import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import GeometryGPURenderInfo from "../../renderInfos/GeometryGPURenderInfo";
import InterleaveType from "../../resources/buffer/core/type/InterleaveType";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import InterleavedStruct from "../../resources/buffer/vertexBuffer/InterleavedStruct";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import AABB from "../../utils/math/bound/AABB";
import calculateGeometryAABB from "../../utils/math/bound/calculateGeometryAABB";

/**
 * Class representing a primitive geometry.
 *
 * @class Primitive
 */
class Primitive {
	#gpuRenderInfo: GeometryGPURenderInfo
	#vertexBuffer: VertexBuffer
	#indexBuffer: IndexBuffer
	#volume: AABB;

	constructor(redGPUContext: RedGPUContext) {
		validateRedGPUContext(redGPUContext)
	}

	static get primitiveInterleaveStruct(): InterleavedStruct {
		return new InterleavedStruct(
			{
				vertexPosition: InterleaveType.float32x3,
				vertexNormal: InterleaveType.float32x3,
				texcoord: InterleaveType.float32x2,
			},
			`primitiveInterleaveStruct`
		)
	}

	get gpuRenderInfo(): { buffers: GPUVertexBufferLayout[] } {
		return this.#gpuRenderInfo;
	}

	get vertexBuffer(): VertexBuffer {
		return this.#vertexBuffer;
	}

	get indexBuffer(): IndexBuffer {
		return this.#indexBuffer;
	}

	get volume(): AABB {
		if (!this.#volume) {
			//TODO vertexBuffer 내용이 변경될떄  재계산해야함
			this.#volume = calculateGeometryAABB(this.#vertexBuffer);
		}
		return this.#volume;
	}

	_setData(geometry: Geometry) {
		this.#vertexBuffer = geometry.vertexBuffer
		this.#indexBuffer = geometry.indexBuffer
		if (this.#vertexBuffer) {
			const {interleavedStruct} = this.#vertexBuffer
			this.#gpuRenderInfo = new GeometryGPURenderInfo(
				[
					{
						arrayStride: interleavedStruct.arrayStride,
						attributes: interleavedStruct.attributes
					}
				]
			)
		}
	}
}

Object.freeze(Primitive)
export default Primitive

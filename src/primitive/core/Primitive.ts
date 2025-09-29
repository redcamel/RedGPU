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
 * 기본 도형(Primitive) 클래스입니다.
 * 정점 버퍼, 인덱스 버퍼, GPU 렌더 정보, AABB(바운딩 박스) 등을 관리합니다.
 *
 * @category Primitive
 *
 * @example
 * ```javascript
 * const primitive = new RedGPU.Primitive.Primitive(redGPUContext);
 * primitive._setData(geometry);
 * const vb = primitive.vertexBuffer;
 * const ib = primitive.indexBuffer;
 * const aabb = primitive.volume;
 * ```
 */
class Primitive {
	/** GPU 렌더 정보 */
	#gpuRenderInfo: GeometryGPURenderInfo
	/** 정점 버퍼 */
	#vertexBuffer: VertexBuffer
	/** 인덱스 버퍼 */
	#indexBuffer: IndexBuffer
	/** AABB(바운딩 박스) */
	#volume: AABB;

	/**
	 * Primitive 인스턴스 생성
	 * @param redGPUContext RedGPUContext 인스턴스
	 */
	constructor(redGPUContext: RedGPUContext) {
		validateRedGPUContext(redGPUContext)
	}

	/**
	 * 기본 정점 레이아웃 구조 반환
	 */
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

	/** GPU 렌더 정보 반환 */
	get gpuRenderInfo(): { buffers: GPUVertexBufferLayout[] } {
		return this.#gpuRenderInfo;
	}

	/** 정점 버퍼 반환 */
	get vertexBuffer(): VertexBuffer {
		return this.#vertexBuffer;
	}

	/** 인덱스 버퍼 반환 */
	get indexBuffer(): IndexBuffer {
		return this.#indexBuffer;
	}

	/** AABB(바운딩 박스) 반환 */
	get volume(): AABB {
		if (!this.#volume) {
			this.#volume = calculateGeometryAABB(this.#vertexBuffer);
		}
		return this.#volume;
	}

	/**
	 * Geometry 데이터로 내부 버퍼/정보를 설정합니다.
	 * @param geometry Geometry 인스턴스
	 */
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

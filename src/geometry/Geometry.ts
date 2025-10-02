import RedGPUContext from "../context/RedGPUContext";
import GeometryGPURenderInfo from "../primitive/core/GeometryGPURenderInfo";
import IndexBuffer from "../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../resources/buffer/vertexBuffer/VertexBuffer";
import ResourceBase from "../resources/core/ResourceBase";
import AABB from "../utils/math/bound/AABB";
import calculateGeometryAABB from "../utils/math/bound/calculateGeometryAABB";

/**
 * Geometry 클래스는 정점 버퍼(VertexBuffer)와 인덱스 버퍼(IndexBuffer)를 관리하며,
 * GPU 렌더링에 필요한 정보를 제공하는 역할을 합니다.
 *
 * - 정점 버퍼, 인덱스 버퍼, AABB(경계 상자) 정보를 캡슐화합니다.
 * - 버퍼 변경 시 AABB를 자동으로 갱신합니다.
 * - GeometryGPURenderInfo를 통해 GPU 파이프라인에 필요한 레이아웃 정보를 제공합니다.
 *
 * @extends ResourceBase
 */
class Geometry extends ResourceBase {
	/** GPU 파이프라인에 필요한 레이아웃 정보 */
	gpuRenderInfo: GeometryGPURenderInfo
	/** 정점 버퍼 */
	#vertexBuffer: VertexBuffer
	/** 인덱스 버퍼 */
	#indexBuffer: IndexBuffer
	/** AABB(경계 상자) 정보 */
	#volume: AABB;

	/**
	 * Geometry 인스턴스를 생성합니다.
	 * @param redGPUContext RedGPUContext 인스턴스
	 * @param vertexBuffer 정점 버퍼
	 * @param indexBuffer 인덱스 버퍼(선택)
	 */
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

	/** 정점 버퍼 반환 */
	get vertexBuffer(): VertexBuffer {
		return this.#vertexBuffer;
	}

	/** 인덱스 버퍼 반환 */
	get indexBuffer(): IndexBuffer {
		return this.#indexBuffer;
	}

	/**
	 * 정점 버퍼 기준 AABB(경계 상자) 반환
	 * 최초 접근 시 계산 후 캐싱, 버퍼 변경 시 자동 갱신
	 */
	get volume(): AABB {
		if (!this.#volume) {
			this.#volume = calculateGeometryAABB(this.#vertexBuffer);
		}
		return this.#volume;
	}

	/**
	 * 정점 버퍼를 갱신하고, AABB 캐시를 초기화합니다.
	 * @param vertexBuffer 새 정점 버퍼
	 * @private
	 */
	#updateVertexBuffer(vertexBuffer: VertexBuffer) {
		const prevBuffer = this.#vertexBuffer
		this.#vertexBuffer = vertexBuffer
		if (prevBuffer) prevBuffer.__removeDirtyPipelineListener(this.#updateVertexBufferState);
		if (vertexBuffer) vertexBuffer.__addDirtyPipelineListener(this.#updateVertexBufferState);
		this.#volume = null
	}

	/**
	 * 인덱스 버퍼를 갱신합니다.
	 * @param indexBuffer 새 인덱스 버퍼
	 * @private
	 */
	#updateIndexBuffer(indexBuffer: IndexBuffer) {
		const prevBuffer = this.#indexBuffer
		this.#indexBuffer = indexBuffer
		if (prevBuffer) prevBuffer.__removeDirtyPipelineListener(this.#updateIndexBufferState);
		if (indexBuffer) indexBuffer.__addDirtyPipelineListener(this.#updateIndexBufferState);
	}

	/**
	 * 정점 버퍼 변경 시 호출되는 내부 상태 갱신 함수
	 * @private
	 */
	#updateVertexBufferState() {
		this.__fireListenerList();
	}

	/**
	 * 인덱스 버퍼 변경 시 호출되는 내부 상태 갱신 함수
	 * @private
	 */
	#updateIndexBufferState() {
		this.__fireListenerList();
	}
}

Object.freeze(Geometry)
export default Geometry

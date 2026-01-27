/**
 * [KO] 지오메트리의 GPU 렌더링 레이아웃 정보를 저장하는 클래스입니다.
 * [EN] Class that stores GPU rendering layout information for geometry.
 * 
 * @category Core
 */
class GeometryGPURenderInfo {
	/**
	 * [KO] 정점 버퍼 레이아웃 배열
	 * [EN] Array of vertex buffer layouts
	 */
	buffers: GPUVertexBufferLayout[]

	/**
	 * [KO] GeometryGPURenderInfo 인스턴스를 생성합니다.
	 * [EN] Creates an instance of GeometryGPURenderInfo.
	 * 
	 * @param buffers - 
	 * [KO] 설정할 버퍼 레이아웃 배열 
	 * [EN] Array of buffer layouts to set
	 */
	constructor(
		buffers: GPUVertexBufferLayout[],
	) {
		this.buffers = buffers;
	}
}

Object.freeze(GeometryGPURenderInfo)
export default GeometryGPURenderInfo
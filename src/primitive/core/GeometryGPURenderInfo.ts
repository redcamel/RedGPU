/**
 * [KO] 지오메트리의 GPU 정점 버퍼 레이아웃 정보를 보관하는 클래스입니다.
 * [EN] Class that holds GPU vertex buffer layout information for geometry.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
class GeometryGPURenderInfo {
    /**
     * [KO] GPU 정점 버퍼 레이아웃(`GPUVertexBufferLayout`) 배열입니다.
     * [EN] Array of GPU vertex buffer layouts (`GPUVertexBufferLayout`).
     */
    buffers: GPUVertexBufferLayout[]

    /**
     * [KO] GeometryGPURenderInfo 인스턴스를 생성합니다.
     * [EN] Creates a GeometryGPURenderInfo instance.
     *
     * @param buffers -
     * [KO] 설정할 정점 버퍼 레이아웃 배열
     * [EN] Array of vertex buffer layouts to set
     */
    constructor(
        buffers: GPUVertexBufferLayout[],
    ) {
        this.buffers = buffers;
    }
}

Object.freeze(GeometryGPURenderInfo)
export default GeometryGPURenderInfo
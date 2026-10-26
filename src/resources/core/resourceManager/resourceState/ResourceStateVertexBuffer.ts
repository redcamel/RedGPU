import VertexBuffer from "../../../buffer/vertexBuffer/VertexBuffer";

/**
 * [KO] `VertexBuffer`의 리소스 관리 상태를 나타내는 클래스입니다.
 * [EN] Class that represents the resource management state of `VertexBuffer`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
class ResourceStateVertexBuffer {
    /**
     * [KO] 관리 대상 정점 버퍼 인스턴스
     * [EN] Managed vertex buffer instance
     */
    buffer: VertexBuffer
    /**
     * [KO] 버퍼 라벨 또는 이름
     * [EN] Buffer label or name
     */
    label: string | number
    /**
     * [KO] 고유 식별자(UUID)
     * [EN] Unique identifier (UUID)
     */
    uuid: string | number
    #useNum: number = 0

    /**
     * [KO] ResourceStateVertexBuffer 인스턴스를 생성합니다.
     * [EN] Creates a ResourceStateVertexBuffer instance.
     *
     * @param buffer -
     * [KO] 관리할 대상 `VertexBuffer` 인스턴스
     * [EN] Target `VertexBuffer` instance to manage
     */
    constructor(buffer: VertexBuffer) {
        this.buffer = buffer
        this.label = buffer.name
        this.uuid = buffer.uuid
    }

    /**
     * [KO] 리소스 참조 횟수를 반환하거나 설정합니다.
     * [EN] Gets or sets the resource reference count.
     *
     * @returns
     * [KO] 현재 참조 횟수
     * [EN] Current reference count
     */
    get useNum(): number {
        return this.#useNum;
    }

    set useNum(value: number) {
        this.#useNum = value;
    }
}

export default ResourceStateVertexBuffer;

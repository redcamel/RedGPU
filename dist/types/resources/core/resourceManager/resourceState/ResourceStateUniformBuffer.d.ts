import UniformBuffer from "../../../buffer/uniformBuffer/UniformBuffer";
/**
 * [KO] `UniformBuffer`의 리소스 관리 상태를 나타내는 클래스입니다.
 * [EN] Class that represents the resource management state of `UniformBuffer`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
declare class ResourceStateUniformBuffer {
    #private;
    /**
     * [KO] 관리 대상 유니폼 버퍼 인스턴스
     * [EN] Managed uniform buffer instance
     */
    buffer: UniformBuffer;
    /**
     * [KO] 고유 식별자(UUID)
     * [EN] Unique identifier (UUID)
     */
    uuid: string | number;
    /**
     * [KO] ResourceStateUniformBuffer 인스턴스를 생성합니다.
     * [EN] Creates a ResourceStateUniformBuffer instance.
     *
     * @param buffer -
     * [KO] 관리할 대상 `UniformBuffer` 인스턴스
     * [EN] Target `UniformBuffer` instance to manage
     */
    constructor(buffer: UniformBuffer);
    /**
     * [KO] 리소스 참조 횟수를 반환하거나 설정합니다.
     * [EN] Gets or sets the resource reference count.
     *
     * @returns
     * [KO] 현재 참조 횟수
     * [EN] Current reference count
     */
    get useNum(): number;
    set useNum(value: number);
}
export default ResourceStateUniformBuffer;

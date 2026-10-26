/**
 * [KO] RedGPU의 모든 엔진 객체가 상속받는 최상위 추상 클래스로, 고유 식별자(`uuid`), 인스턴스 번호(`instanceId`), 이름(`name`)을 제공합니다.
 * [EN] Top-level abstract class inherited by all RedGPU engine objects, providing a unique identifier (`uuid`), sequential instance ID (`instanceId`), and object name (`name`).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
declare abstract class BaseObject {
    #private;
    /**
     * [KO] 새로운 BaseObject 인스턴스를 초기화하고 클래스별 고유 `instanceId`를 할당합니다.
     * [EN] Initializes a new BaseObject instance and assigns a per-class unique `instanceId`.
     */
    constructor();
    /**
     * [KO] 클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.
     * [EN] Returns the unique sequential instance ID assigned per class.
     *
     * @returns
     * [KO] 클래스별 고유 인스턴스 번호
     * [EN] Per-class unique instance ID
     */
    get instanceId(): number;
    /**
     * [KO] 객체의 고유 식별자(UUID)를 반환합니다.
     * [EN] Returns the universally unique identifier (UUID) of the object.
     *
     * @returns
     * [KO] 객체의 UUID 문자열
     * [EN] UUID string of the object
     */
    get uuid(): string;
    /**
     * [KO] 객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.
     * [EN] Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.
     *
     * @returns
     * [KO] 객체 이름 문자열
     * [EN] Object name string
     */
    get name(): string;
    set name(value: string);
}
export default BaseObject;

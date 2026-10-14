import createUUID from "../utils/uuid/createUUID";
import InstanceIdGenerator from "../utils/uuid/InstanceIdGenerator";

/**
 * [KO] RedGPU의 모든 엔진 객체가 상속받는 최상위 추상 클래스입니다.
 * [EN] Top-level abstract class inherited by all engine objects in RedGPU.
 *
 * [KO] 객체별 고유 식별자(`uuid`), 클래스별 순차 인스턴스 번호(`instanceId`), 객체 이름(`name`) 등 엔진 전반의 객체 식별과 관리에 필요한 공통 속성을 제공합니다.
 * [EN] Provides common properties required for object identification and management across the engine, including a universally unique identifier (`uuid`), per-class sequential instance ID (`instanceId`), and object name (`name`).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
abstract class BaseObject {
    #instanceId: number;
    #uuid: string = '';
    #name: string = '';

    /**
     * [KO] `BaseObject` 인스턴스를 초기화하고 클래스별 고유 `instanceId`를 할당합니다.
     * [EN] Initializes the `BaseObject` instance and assigns a per-class unique `instanceId`.
     */
    constructor() {
        this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
    }

    /**
     * [KO] 클래스별로 0부터 순차 부여되는 고유 인스턴스 번호를 반환합니다.
     * [EN] Returns the unique sequential instance ID assigned starting from 0 per class.
     *
     * @returns
     * [KO] 클래스별 고유 인스턴스 번호
     * [EN] Per-class unique instance ID
     */
    get instanceId(): number {
        return this.#instanceId;
    }

    /**
     * [KO] 객체의 고유 식별자(UUID)를 반환합니다.
     * [EN] Returns the universally unique identifier (UUID) of the object.
     *
     * @returns
     * [KO] 객체의 UUID 문자열
     * [EN] UUID string of the object
     */
    get uuid(): string {
        if (!this.#uuid) {
            this.#uuid = createUUID();
        }
        return this.#uuid;
    }

    /**
     * [KO] 객체의 이름을 반환하거나 설정합니다.
     * [EN] Gets or sets the name of the object.
     *
     * [KO] 이름이 별도로 설정되지 않은 경우 클래스명과 `instanceId`를 조합한 기본 이름(`ClassName Instance N`)을 반환합니다.
     * [EN] If no name has been explicitly set, returns a default name combining the class name and `instanceId` (`ClassName Instance N`).
     *
     * @returns
     * [KO] 객체 이름 문자열
     * [EN] Object name string
     */
    get name(): string {
        if (!this.#name) {
            this.#name = `${this.constructor.name} Instance ${this.#instanceId}`;
        }
        return this.#name;
    }

    set name(value: string) {
        this.#name = value;
    }
}

Object.freeze(BaseObject);
export default BaseObject;

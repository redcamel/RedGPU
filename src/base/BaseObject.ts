import createUUID from "../utils/uuid/createUUID";
import InstanceIdGenerator from "../utils/uuid/InstanceIdGenerator";

/**
 * [KO] RedGPU의 모든 엔진 객체가 상속받는 최상위 추상 클래스입니다.
 * [EN] Top-level abstract class inherited by all engine objects in RedGPU.
 *
 * [KO] 객체별 고유 식별자(`uuid`), 클래스별 순차 인스턴스 번호(`instanceId`), 객체 이름(`name`) 등 엔진 전반의 객체 식별 및 관리에 필요한 공통 속성을 제공합니다.
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
    /**
     * [KO] 클래스별로 0부터 순차 부여되는 고유 인스턴스 순번 ID입니다.
     * [EN] Unique sequential instance ID assigned starting from 0 per class.
     */
    readonly instanceId: number;
    #uuid: string = createUUID();
    #name: string = '';

    /**
     * [KO] BaseObject의 생성자입니다.
     * [EN] Constructor for BaseObject.
     */
    protected constructor() {
        this.instanceId = InstanceIdGenerator.getNextId(this.constructor);
    }

    /**
     * [KO] 객체의 고유 식별자(UUID v4)를 반환합니다.
     * [EN] Returns the universally unique identifier (UUID v4) of the object.
     *
     * @returns
     * [KO] 객체의 UUID 문자열
     * [EN] UUID string of the object
     */
    get uuid(): string {
        return this.#uuid;
    }

    /**
     * [KO] 객체의 이름을 가져오거나 설정합니다. 이름이 지정되지 않았거나 빈 문자열(`''`)인 경우 클래스명과 `instanceId`를 조합한 기본 이름을 반환합니다.
     * [EN] Gets or sets the name of the object. If no name is set or it is an empty string (`''`), returns a default name combining the class name and `instanceId`.
     *
     * @returns
     * [KO] 객체 이름 문자열
     * [EN] Object name string
     */
    get name(): string {
        return this.#name || `${this.constructor.name} Instance ${this.instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }
}

Object.freeze(BaseObject);
export default BaseObject;

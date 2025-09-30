import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import GroupBase from "./GroupBase";

/**
 * 2D 공간에서의 그룹(계층) 노드로, 변환(transform)과 자식 객체만을 관리하는 구조체입니다.
 *
 *  geometry(버텍스/메시 데이터) 없이 오직 트랜스폼(위치, 회전, 스케일)과 자식 계층만을 가집니다.
 *
 * 실제 렌더링 데이터는 포함하지 않으며, 씬 내에서 계층적 구조와 변환만을 담당합니다.
 *
 * <iframe src="/RedGPU/examples/2d/group2D/basic/" ></iframe>
 * @category Group
 */
class Group2D extends GroupBase {
	/** 인스턴스 고유 ID */
	#instanceId: number;
	/** 그룹 이름 */
	#name: string;
	/** 그룹의 회전 값 (라디안) */
	#rotation: number = 0;

	/**
	 * Group2D 인스턴스를 생성합니다.
	 * @param name 그룹 이름(선택)
	 */
	constructor(name?: string) {
		super();
		if (name) this.name = name;
	}

	/**
	 * 그룹 이름을 반환합니다.
	 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/**
	 * 그룹 이름을 설정합니다.
	 */
	set name(value: string) {
		this.#name = value;
	}

	/**
	 * 그룹의 회전 값을 반환합니다.
	 */
	// @ts-ignore
	get rotation(): number {
		return this.#rotation;
	}

	/**
	 * 그룹의 회전 값을 설정합니다.
	 * @param value 회전 값(라디안)
	 */
	// @ts-ignore
	set rotation(value: number) {
		this.#rotation = value;
		super.rotationZ = value;
	}

	/**
	 * 그룹의 스케일을 설정합니다.
	 * @param x X축 스케일
	 * @param y Y축 스케일(생략 시 x와 동일)
	 */
	setScale(x: number, y?: number) {
		y = y ?? x;
		// @ts-ignore
		super.setScale(x, y, 1);
	}

	/**
	 * 그룹의 위치를 설정합니다.
	 * @param x X 좌표
	 * @param y Y 좌표(생략 시 x와 동일)
	 */
	setPosition(x: number, y?: number) {
		y = y ?? x;
		// @ts-ignore
		super.setPosition(x, y, 0);
	}

	/**
	 * 그룹의 회전 값을 설정합니다.
	 * @param value 회전 값(라디안)
	 */
	setRotation(value: number) {
		this.rotation = value;
	}
}

/**
 * 이 객체가 2D Mesh 타입의 그룹임을 나타내는 플래그입니다.\
 * geometry/vertex 데이터 없이 transform과 자식만을 가지는 구조임을 구분하기 위해 사용됩니다.
 */
Object.defineProperty(Group2D.prototype, 'is2DMeshType', {
	value: true,
	writable: false
});
Object.freeze(Group2D);
export default Group2D;

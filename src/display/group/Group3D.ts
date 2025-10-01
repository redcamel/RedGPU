import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import MESH_TYPE from "../MESH_TYPE";
import AGroupBase from "./core/AGroupBase";

/**
 * 3D 공간에서의 그룹(계층) 노드로, 변환(transform)과 자식 객체만을 관리하는 구조체입니다.
 *
 * geometry(버텍스/메시 데이터) 없이 오직 트랜스폼(위치, 회전, 스케일)과 자식 계층만을 가집니다.
 *
 * 실제 렌더링 데이터는 포함하지 않으며, 씬 내에서 계층적 구조와 변환만을 담당합니다.
 *
 * <iframe src="/RedGPU/examples/3d/group3D/basic/" ></iframe>
 * @category Group
 */
class Group3D extends AGroupBase {
	/** 인스턴스 고유 ID */
	#instanceId: number
	/** 그룹 이름 */
	#name: string

	/**
	 * Group3D 인스턴스를 생성합니다.
	 * @param name 그룹 이름(선택)
	 */
	constructor(name?: string) {
		super()
		if (name) this.name = name
	}

	/**
	 * 그룹 이름을 반환합니다.
	 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/**
	 * 그룹 이름을 설정합니다.
	 */
	set name(value: string) {
		this.#name = value;
	}
}

/**
 * 이 객체가 3D Mesh 타입의 그룹임을 나타내는 플래그입니다.\
 * geometry/vertex 데이터 없이 transform과 자식만을 가지는 구조임을 구분하기 위해 사용됩니다.
 */
Object.defineProperty(Group3D.prototype, 'meshType', {
	value: MESH_TYPE.MESH,
	writable: false
});
Object.freeze(Group3D)
export default Group3D

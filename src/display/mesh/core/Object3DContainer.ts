import {mat4} from "gl-matrix";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Mesh from "../Mesh";
import MeshBase from "./MeshBase";

/**
 * Object3DContainer 클래스는 Mesh 객체들을 담는 시각적 컨테이너입니다.
 *
 * Scene의 기반이 되는 구조로, View에서 렌더링할 수 있는 3D 객체들을 계층적으로 관리합니다.
 * 자식 객체의 추가, 제거, 위치 변경, 교환 등의 기능을 제공하며,
 * 각 Mesh는 이 컨테이너를 통해 부모-자식 관계를 형성합니다.
 *
 * View와 Scene이 그려낼 공간을 구성할 때, Object3DContainer는
 * 실제로 배치되는 시각적 요소들의 루트 역할을 합니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 */
class Object3DContainer {
	/**
	 * 이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.
	 */
	modelMatrix: mat4 = mat4.create();
	/**
	 * 자식 Mesh 객체들을 담는 배열입니다.
	 * @type {Mesh[]}
	 */
	#children: Mesh[] = [];

	/**
	 * Object3DContainer 생성자입니다.
	 */
	constructor() {
	}

	/**
	 * 현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.
	 * @returns {Mesh[]} 자식 객체 배열
	 */
	get children(): Mesh[] {
		return this.#children;
	}

	/**
	 * 자식 객체의 개수를 반환합니다.
	 * @returns {number} 자식 수
	 */
	get numChildren(): number {
		return this.#children.length;
	}

	/**
	 * 특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.
	 * @param {Mesh} child - 확인할 자식 객체
	 * @returns {boolean} 포함 여부
	 */
	contains(child: Mesh): boolean {
		this.#checkObject3DInstance(child);
		return this.#children.includes(child);
	}

	/**
	 * 자식 Mesh를 컨테이너에 추가합니다.
	 * @param {Mesh} child - 추가할 자식 객체
	 * @returns {Mesh} 추가된 객체 또는 실패 시 null
	 */
	addChild(child: Mesh): Mesh {
		this.#checkObject3DInstance(child);
		if (this.#assignChild(child)) {
			this.#children.push(child);
			child.dirtyTransform = true;
			return child;
		} else {
			console.log(`Failed to assign child. The child could not be removed from its previous parent.`);
			return null;
		}
	}

	/**
	 * 자식 Mesh를 특정 인덱스에 추가합니다.
	 * @param {Mesh} child - 추가할 자식 객체
	 * @param {number} index - 삽입 위치
	 * @returns {this} 현재 컨테이너
	 */
	addChildAt(child: Mesh, index: number) {
		validateUintRange(index);
		if (this.#children.length < index) index = this.#children.length;
		if (index < 0 || index > this.#children.length) {
			console.log(`Invalid index. Index should be within 0 and ${this.#children.length}.`);
			return;
		}
		if (this.#assignChild(child)) {
			this.#children.splice(index, 0, child);
		} else {
			console.log(`Failed to assign child. The child could not be removed from its previous parent.`);
			return;
		}
		child.dirtyTransform = true;
		return this;
	}

	/**
	 * 지정된 인덱스의 자식 Mesh를 반환합니다.
	 * @param {number} index - 조회할 위치
	 * @returns {Mesh} 해당 위치의 자식 객체 또는 undefined
	 */
	getChildAt(index: number): Mesh {
		validateUintRange(index);
		if (index >= this.#children.length || index < 0) {
			console.log(`Invalid index. Index should be within 0 and ${this.#children.length - 1}.`);
			return undefined;
		}
		return this.#children[index];
	}

	/**
	 * 특정 자식 객체의 인덱스를 반환합니다.
	 * @param {Mesh} child - 조회할 자식 객체
	 * @returns {number} 인덱스 또는 -1
	 */
	getChildIndex(child: Mesh): number {
		this.#checkObject3DInstance(child);
		const index = this.#children.indexOf(child);
		if (index === -1) {
			console.log(`Given object is not a child of this container: ${child}`);
			return -1;
		}
		return index;
	}

	/**
	 * 자식 객체의 위치를 변경합니다.
	 * @param {Mesh} child - 대상 자식 객체
	 * @param {number} index - 새 인덱스
	 */
	setChildIndex(child: Mesh, index: number) {
		this.#checkObject3DInstance(child);
		validateUintRange(index);
		const len = this.#children.length;
		const indexIsOutOfBounds = index >= len;
		const childIndex = this.#children.indexOf(child);
		if (childIndex === -1) {
			consoleAndThrowError(`The provided is not a child of the Object3DContainer.: ${child}`);
			return;
		}
		if (indexIsOutOfBounds) {
			consoleAndThrowError(`Invalid index. Index ${index} is out of bounds. Index should be between 0 and ${len - 1}.`);
			return;
		}
		this.#children.splice(childIndex, 1);
		this.#children.splice(index, 0, child);
	}

	/**
	 * 두 자식 객체의 위치를 서로 바꿉니다.
	 * @param {Mesh} child1 - 첫 번째 객체
	 * @param {Mesh} child2 - 두 번째 객체
	 */
	swapChildren(child1: Mesh, child2: Mesh) {
		this.#checkObject3DInstance(child1);
		this.#checkObject3DInstance(child2);
		if (child1 === child2) {
			consoleAndThrowError("Error: child1 and child2 are the same. Cannot swap a child with itself.");
			return;
		}
		const index1 = this.#children.indexOf(child1);
		const index2 = this.#children.indexOf(child2);
		if (index1 === -1 || index2 === -1) {
			consoleAndThrowError(`Error: ${index1 === -1 ? 'child1' : 'child2'} is not a child of this Object3DContainer.`);
		}
		this.swapChildrenAt(index1, index2);
	}

	/**
	 * 두 인덱스의 자식 객체 위치를 서로 바꿉니다.
	 * @param {number} index1 - 첫 번째 인덱스
	 * @param {number} index2 - 두 번째 인덱스
	 */
	swapChildrenAt(index1: number, index2: number) {
		validateUintRange(index1);
		validateUintRange(index2);
		if (index1 === index2) {
			consoleAndThrowError("Error: index1 and index2 are identical. Cannot swap a child with itself.");
		}
		const len = this.#children.length;
		if (index1 >= len || index2 >= len) {
			consoleAndThrowError(`Error: Both index1 and index2 should be less than the number of children. Provided index1: ${index1}, index2: ${index2}, number of children: ${len}`);
		}
		let temp: Mesh = this.#children[index1];
		this.#children[index1] = this.#children[index2];
		this.#children[index2] = temp;
	}

	/**
	 * 특정 자식 객체를 제거합니다.
	 * @param {Mesh} child - 제거할 자식 객체
	 * @returns {Mesh} 제거된 객체
	 */
	removeChild(child: Mesh) {
		this.#checkObject3DInstance(child);
		const index = this.#children.indexOf(child);
		if (index > -1) {
			child.parent = null;
			return this.#children.splice(index, 1)[0];
		} else {
			consoleAndThrowError("Error: Child not found within parent.");
		}
	}

	/**
	 * 지정된 인덱스의 자식 객체를 제거합니다.
	 * @param {number} index - 제거할 위치
	 * @returns {Mesh} 제거된 객체
	 */
	removeChildAt(index: number): Mesh {
		validateUintRange(index);
		const child = this.#children[index];
		if (child) {
			child.parent = null;
			return this.#children.splice(index, 1)[0];
		} else {
			throw new Error(`Error: No child found at provided index: ${index}.`);
		}
	}

	/**
	 * 모든 자식 객체를 제거합니다.
	 * @returns {this} 현재 컨테이너
	 */
	removeAllChildren() {
		let i = this.#children.length;
		while (i--) {
			this.#children[i].parent = null;
		}
		this.#children.length = 0;
		return this;
	}

	/**
	 * 주어진 객체가 Object3DContainer의 인스턴스인지 확인합니다.
	 * @param {MeshBase} target - 검사할 객체
	 * @private
	 */
	#checkObject3DInstance(target: MeshBase) {
		if (!(target instanceof Object3DContainer)) {
			consoleAndThrowError('allow only Object3DContainer instance.');
		}
	}

	/**
	 * 자식 객체를 현재 컨테이너에 할당합니다.
	 * 기존 부모가 있다면 제거 후 재할당합니다.
	 * @param {Mesh} child - 할당할 자식 객체
	 * @returns {boolean} 성공 여부
	 * @private
	 */
	#assignChild = (child: Mesh): boolean => {
		this.#checkObject3DInstance(child);
		if (child.parent) {
			if (child.parent?.removeChild(child)) {
				child.parent = this;
				return true;
			} else {
				return false;
			}
		} else {
			child.parent = this;
			return true;
		}
	}
}

export default Object3DContainer;

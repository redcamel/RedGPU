import {Mesh} from "../mesh/Mesh";

/**
 * DisplayContainer는 자식/부모 객체 관리기능을 담당하는 객체입니다.
 */
class DisplayContainer {
	/**
	 * 자식객체 리스트
	 * @private
	 */
	#children: Mesh[] = []
	/**
	 * 부모객체 값
	 * @private
	 */
	#parent

	constructor() {
	}

	/**
	 * 자식객체 리스트를 반환힙니다.
	 */
	get children() {
		return this.#children;
	}

	/**
	 * 설정된 부모 객체값을 반환합니다.
	 */
	get parent() {
		return this.#parent;
	}

	/**
	 * 부모 객체를 설정합니다.
	 * @param value
	 */
	set parent(value) {
		this.#parent = value;
	}

	/**
	 * 자식 객체를 등록합니다.
	 * * 추가하려는 객체에 parent 값이 존재할경우 해당 parent에서 삭제후 추가합니다.
	 * @param child
	 */
	addChild(child: Mesh) {
		if (child.parent) child.parent.remove(child)
		child.parent = this
		this.#children.push(child)
		return this
	}

	/**
	 *  원하는 index 위치에 자식 객체를 등록합니다.
	 * * 추가하려는 객체에 parent 값이 존재할경우 해당 parent에서 삭제후 추가합니다.
	 * * index가 children 길이보다 길경우 제일 마지막에 push됩니다.
	 * @param child
	 * @param index
	 */
	addChildAt(child: Mesh, index: number) {
		if (child.parent) child.parent.remove(child)
		child.parent = this
		if (this.#children.length < index) index = this.#children.length;
		this.#children.splice(index, 0, child)
		return this
	}

	/**
	 * 대상객체를 자식목록에서 삭제합니다.
	 * * 존재하지 않는 객체를 지우려고 할떄는 무시됩니다.
	 * @param child
	 */
	removeChild(child: Mesh) {
		const index = this.#children.indexOf(child)
		if (index > -1) {
			child.parent = null;
			this.#children.splice(index, 1);
		}
		return this
	}

	/**
	 * index 기반으로 자식을  삭제합니다.
	 * @param index
	 */
	removeChildAt(index) {
		const child = this.#children[index]
		if (child) {
			child.parent = null;
			this.#children.splice(index, 1);
		}
		return this
	}

	/**
	 * 등록된 모든 자식을 삭제합니다.
	 */
	removeAllChild() {
		let i = this.#children.length
		while (i--) {
			this.#children[i].parent = null
		}
		this.#children.length = 0
		return this
	}
}

export default DisplayContainer

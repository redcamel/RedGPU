import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import GroupBase from "./GroupBase";
/**
 * @category Group
 */
class Group2D extends GroupBase {
	#instanceId: number
	#name: string
	#rotation: number = 0

	constructor(name?: string) {
		super()
		if (name) this.name = name
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	// @ts-ignore
	get rotation(): number {
		return this.#rotation;
	}

	// @ts-ignore
	set rotation(value: number) {
		this.#rotation = value;
		super.rotationZ = value;
	}

	setScale(x: number, y?: number) {
		y = y ?? x;
		// @ts-ignore
		super.setScale(x, y, 1)
	}

	setPosition(x: number, y?: number) {
		y = y ?? x;
		// @ts-ignore
		super.setPosition(x, y, 0)
	}

	setRotation(value: number) {
		this.rotation = value;
	}
}

Object.defineProperty(Group2D.prototype, 'is2DMeshType', {
	value: true,
	writable: false
});
Object.freeze(Group2D)
export default Group2D

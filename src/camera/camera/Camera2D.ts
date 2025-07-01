import {mat4} from "gl-matrix";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";

class Camera2D {
	#instanceId: number
	#modelMatrix: mat4 = mat4.create()
	#x: number = 0
	#y: number = 0
	#z: number = 0
	#name: string

	//TODO rotationX, rotationY, rotationZ getter/setter
	constructor() {
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get modelMatrix(): mat4 {
		return this.#modelMatrix;
	}

	get z() {
		return this.#z;
	}

	get x() {
		return this.#x;
	}

	set x(value: number) {
		this.#x = value;
		this.#modelMatrix[12] = value;
	}

	get y() {
		return this.#y;
	}

	set y(value: number) {
		this.#y = value;
		this.#modelMatrix[13] = value;
	}

	get position(): [number, number] {
		return [this.#x, this.#y];
	}

	setPosition(x: number | [number, number, number], y?: number) {
		if (Array.isArray(x)) {
			[this.#x, this.#y] = x;
		} else {
			this.#x = x
			this.#y = y
		}
		[this.#modelMatrix[12], this.#modelMatrix[13], this.#modelMatrix[14]] = [this.#x, this.#y, 0]
	}
}

export default Camera2D


import {mat4} from "gl-matrix";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";

class Camera2D {
	#instanceId: number
	#modelMatrix: mat4 = mat4.create()
	#name: string

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
}

export default Camera2D

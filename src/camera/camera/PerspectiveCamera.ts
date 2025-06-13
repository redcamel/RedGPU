import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";

class PerspectiveCamera {
	#instanceId: number
	#up = new Float32Array([0, 1, 0]);
	#modelMatrix: mat4 = mat4.create()
	#x: number = 0
	#z: number = 0
	#y: number = 0
	#rotationX: number = 0
	#rotationY: number = 0
	#rotationZ: number = 0
	#fieldOfView: number = 60;
	#nearClipping: number = 0.01
	#farClipping: number = 10000;
	#name: string

	//TODO rotationX, rotationY, rotationZ getter/setter
	constructor() {
	}

	get rotationX(): number {
		return this.#rotationX;
	}

	set rotationX(value: number) {
		//TODO
		this.#rotationX = value;
	}

	get rotationY(): number {
		return this.#rotationY;
	}

	set rotationY(value: number) {
		//TODO
		this.#rotationY = value;
	}

	get rotationZ(): number {
		return this.#rotationZ;
	}

	set rotationZ(value: number) {
		//TODO
		this.#rotationZ = value;
	}

	get fieldOfView(): number {
		return this.#fieldOfView;
	}

	set fieldOfView(value: number) {
		validateNumber(value)
		this.#fieldOfView = value;
	}

	get nearClipping(): number {
		return this.#nearClipping;
	}

	set nearClipping(value: number) {
		validateNumber(value)
		this.#nearClipping = value;
	}

	get farClipping(): number {
		return this.#farClipping;
	}

	set farClipping(value: number) {
		validateNumber(value)
		this.#farClipping = value;
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

	get z() {
		return this.#z;
	}

	set z(value: number) {
		this.#z = value;
		this.#modelMatrix[14] = value;
	}

	get position(): [number, number, number] {
		return [this.#x, this.#y, this.#z];
	}

	setPosition(x: number | [number, number, number], y?: number, z?: number) {
		if (Array.isArray(x)) {
			[this.#x, this.#y, this.#z] = x;
		} else {
			this.#x = x
			this.#y = y
			this.#z = z
		}
		[this.#modelMatrix[12], this.#modelMatrix[13], this.#modelMatrix[14]] = [this.#x, this.#y, this.#z]
	}

	lookAt(x: number, y: number, z: number) {
		mat4.lookAt(this.#modelMatrix, [this.#x, this.#y, this.#z], [x, y, z], this.#up);
	}
}

export default PerspectiveCamera

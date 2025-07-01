import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../utils/convertColor/convertHexToRgb";
import BaseLight from "../core/BaseLight";

class PointLight extends BaseLight {
	#radius: number = 1
	#x: number = 0
	#y: number = 0
	#z: number = 0

	constructor(color: string = '#fff', intensity: number = 1) {
		super(new ColorRGB(...convertHexToRgb(color, true)), intensity)
	}

	get x(): number {
		return this.#x;
	}

	set x(value: number) {
		this.#x = value;
	}

	get y(): number {
		return this.#y;
	}

	set y(value: number) {
		this.#y = value;
	}

	get z(): number {
		return this.#z;
	}

	set z(value: number) {
		this.#z = value;
	}

	get position(): [number, number, number] {
		return [this.#x, this.#y, this.#z];
	}

	get radius(): number {
		return this.#radius;
	}

	set radius(value: number) {
		this.#radius = value;
	}

	setPosition(x: number | [number, number, number], y?: number, z?: number) {
		if (Array.isArray(x)) {
			[this.#x, this.#y, this.#z] = x;
		} else {
			this.#x = x
			this.#y = y
			this.#z = z
		}
	}
}

Object.freeze(PointLight)
export default PointLight

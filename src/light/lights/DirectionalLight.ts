import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../utils/convertColor/convertHexToRgb";
import BaseLight from "../core/BaseLight";

class DirectionalLight extends BaseLight {
	#directionX: number = -1
	#directionY: number = -1
	#directionZ: number = -1

	constructor(direction: [number, number, number] = [-1, -1, -1], color: string = '#fff', intensity: number = 1) {
		super(new ColorRGB(...convertHexToRgb(color, true)), intensity)
		this.#directionX = direction[0];
		this.#directionY = direction[1];
		this.#directionZ = direction[2];
	}

	get directionX(): number {
		return this.#directionX;
	}

	set directionX(value: number) {
		this.#directionX = value;
	}

	get directionY(): number {
		return this.#directionY;
	}

	set directionY(value: number) {
		this.#directionY = value;
	}

	get directionZ(): number {
		return this.#directionZ;
	}

	set directionZ(value: number) {
		this.#directionZ = value;
	}

	get direction(): [number, number, number] {
		return [this.#directionX, this.#directionY, this.#directionZ];
	}

	set direction(value: [number, number, number]) {
		this.#directionX = value[0];
		this.#directionY = value[1];
		this.#directionZ = value[2];
	}
}

Object.freeze(DirectionalLight)
export default DirectionalLight

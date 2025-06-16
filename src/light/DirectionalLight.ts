import ColorRGB from "../color/ColorRGB";
import convertHexToRgb from "../utils/convertColor/convertHexToRgb";
import BaseLight from "./core/BaseLight";

class DirectionalLight extends BaseLight {
	#direction: [number, number, number];

	constructor(direction: [number, number, number] = [-1, -1, -1], color: string = '#fff', intensity: number = 1) {
		super(new ColorRGB(...convertHexToRgb(color, true)), intensity)
		this.#direction = direction;
	}

	get direction(): [number, number, number] {
		return this.#direction;
	}

	set direction(value: [number, number, number]) {
		this.#direction = value;
	}
}

Object.freeze(DirectionalLight)
export default DirectionalLight

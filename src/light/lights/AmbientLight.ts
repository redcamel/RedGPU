import ColorRGB from "../../color/ColorRGB";
import BaseLight from "../core/BaseLight";

class AmbientLight extends BaseLight {
	constructor(color: ColorRGB = new ColorRGB(7, 7, 7), intensity: number = 0.2) {
		super(color, intensity)
	}
}

Object.freeze(AmbientLight)
export default AmbientLight


import ColorRGB from "../../color/ColorRGB";
import BaseLight from "../core/BaseLight";

class AmbientLight extends BaseLight {
	constructor(color: ColorRGB = new ColorRGB(173
		, 216, 230), intensity: number = 0.1) {
		super(color, intensity)
	}
}

Object.freeze(AmbientLight)
export default AmbientLight


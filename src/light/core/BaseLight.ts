import ColorRGB from "../../color/ColorRGB";
import ADrawDebuggerLight from "../../display/drawDebugger/light/ADrawDebuggerLight";


class BaseLight {
	#color: ColorRGB;
	#intensity: number;
	drawDebugger:ADrawDebuggerLight
	#enableDebugger:boolean=false
	get enableDebugger(): boolean {
		return this.#enableDebugger;
	}

	set enableDebugger(value: boolean) {
		this.#enableDebugger = value;
	}
	constructor(color: ColorRGB, intensity: number = 1) {
		this.#color = color;
		this.#intensity = intensity;
	}

	get color(): ColorRGB {
		return this.#color;
	}

	set color(value: ColorRGB) {
		this.#color = value;
	}

	get intensity(): number {
		return this.#intensity;
	}

	set intensity(value: number) {
		this.#intensity = value;
	}
}

Object.freeze(BaseLight)
export default BaseLight

import ColorRGB from "../../color/ColorRGB";
import ADrawDebuggerLight from "../../display/drawDebugger/light/ADrawDebuggerLight";

class BaseLight {
	drawDebugger: ADrawDebuggerLight
	#color: ColorRGB;
	#intensity: number;
	#enableDebugger: boolean = false

	constructor(color: ColorRGB, intensity: number = 1) {
		this.#color = color;
		this.#intensity = intensity;
	}

	get enableDebugger(): boolean {
		return this.#enableDebugger;
	}

	set enableDebugger(value: boolean) {
		this.#enableDebugger = value;
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

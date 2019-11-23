"use strict"
import RedUtil from "../util/RedUtil.js";

export default class RedBaseLight {
	#color = '#ffffff';
	#alpha = 1;
	#colorRGBA = new Float32Array([1, 1, 1, this.#alpha]);
	#intensity = 1;
	x = 0;
	y = 0;
	z = 0;
	#position = new Float32Array([0, 0, 0])
	get position() {
		this.#position[0] = this.x
		this.#position[1] = this.y
		this.#position[2] = this.z
		return this.#position
	}

	get color() {
		return this.#color;
	}

	set color(hex) {
		this.#color = hex;
		let rgb = RedUtil.hexToRGB_ZeroToOne(hex);
		this.#colorRGBA[0] = rgb[0];
		this.#colorRGBA[1] = rgb[1];
		this.#colorRGBA[2] = rgb[2];
		this.#colorRGBA[3] = this.#alpha;
	}

	get intensity() {
		return this.#intensity;
	}

	set intensity(value) {
		this.#intensity = value;
	}

	get alpha() {
		return this.#alpha;
	}

	set alpha(value) {
		this.#alpha = this.#colorRGBA[3] = value;
	}

	get colorRGBA() {
		return this.#colorRGBA;
	}
}
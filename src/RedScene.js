"use strict";
import RedDisplayContainer from "./base/RedDisplayContainer.js";
import RedUtil from "./util/RedUtil.js"

export default class RedScene extends RedDisplayContainer {


	#backgroundColor = '#000';
	#backgroundColorAlpha = 1;
	#backgroundColorRGBA = [0, 0, 0, this.#backgroundColorAlpha];

	constructor() {
		super()
	}

	get backgroundColor() {
		return this.#backgroundColor;
	}

	set backgroundColor(value) {
		this.#backgroundColor = value;
		let rgb = RedUtil.hexToRGB_ZeroToOne(value)
		this.#backgroundColorRGBA = [...rgb, this.#backgroundColorAlpha]
	}

	get backgroundColorAlpha() {
		return this.#backgroundColorAlpha;
	}

	set backgroundColorAlpha(value) {
		this.#backgroundColorAlpha = this.#backgroundColorRGBA[3] = value;
	}

	get backgroundColorRGBA() {
		return this.#backgroundColorRGBA;
	}

}
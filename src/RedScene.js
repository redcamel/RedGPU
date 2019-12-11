/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.11 10:59:54
 *
 */

"use strict";
import RedDisplayContainer from "./base/RedDisplayContainer.js";
import RedUTIL from "./util/RedUTIL.js"
import RedDirectionalLight from "./light/RedDirectionalLight.js";
import RedPointLight from "./light/RedPointLight.js";
import RedShareGLSL from "./base/RedShareGLSL.js";
import RedAmbientLight from "./light/RedAmbientLight.js";

export default class RedScene extends RedDisplayContainer {

	#backgroundColor = '#000';
	#backgroundColorAlpha = 1;
	#backgroundColorRGBA = [0, 0, 0, this.#backgroundColorAlpha];
	#directionalLightList = [];
	#pointLightList = [];
	#ambientLight;
	#grid;
	#axis;
	#skyBox
	constructor() {
		super()
	}

	get grid() {
		return this.#grid;
	}

	set grid(value) {
		this.#grid = value;
	}
	get axis() {
		return this.#axis;
	}

	set axis(value) {
		this.#axis = value;
	}
	get skyBox() {
		return this.#skyBox;
	}

	set skyBox(value) {
		this.#skyBox = value;
	}
	get backgroundColor() {
		return this.#backgroundColor;
	}

	set backgroundColor(value) {
		this.#backgroundColor = value;
		let rgb = RedUTIL.hexToRGB_ZeroToOne(value);
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

	get directionalLightList() {
		return this.#directionalLightList
	}
	get pointLightList() {
		return this.#pointLightList
	}
	get ambientLight() {
		return this.#ambientLight
	}


	addLight(light) {
		switch (light.constructor) {
			case RedDirectionalLight:
				if (this.#directionalLightList.length == RedShareGLSL.MAX_DIRECTIONAL_LIGHT) RedUTIL.throwFunc(`addLight : RedDirectionalLight - Up to ${RedShareGLSL.MAX_DIRECTIONAL_LIGHT} are allowed.`);
				this.#directionalLightList.push(light);
				break;
			case RedPointLight:
				if (this.#pointLightList.length == RedShareGLSL.MAX_POINT_LIGHT) RedUTIL.throwFunc(`addLight : RedPointLight - Up to ${RedShareGLSL.MAX_POINT_LIGHT} are allowed.`);
				this.#pointLightList.push(light);
				break;
			case RedAmbientLight:
				this.#ambientLight = light
				break;
			default:
				RedUTIL.throwFunc(`addLight : only allow RedBaseObject3D Instance - inputValue : ${light} { type : ${typeof light} }`);
		}
	}

	removeLight(light) {
		let tIndex;
		switch (light.constructor) {
			case RedDirectionalLight:
				tIndex = this.#directionalLightList.indexOf(light);
				if (tIndex > -1) this.#directionalLightList.splice(tIndex, 1);
				break;
			case RedPointLight:
				tIndex = this.#pointLightList.indexOf(light);
				if (tIndex > -1) this.#pointLightList.splice(tIndex, 1);
				break;
			case RedAmbientLight:
				this.#ambientLight = null
				break;
			default:
				RedUTIL.throwFunc(`removeLight : only allow RedBaseObject3D Instance - inputValue : ${light} { type : ${typeof light} }`);
		}
	}
	removeLightAll() {
		this.#directionalLightList.length = 0;
		this.#pointLightList.length = 0;
		this.#ambientLight = null
	}

}
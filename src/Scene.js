/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */

"use strict";
import DisplayContainer from "./base/DisplayContainer.js";
import UTIL from "./util/UTIL.js"
import DirectionalLight from "./light/DirectionalLight.js";
import PointLight from "./light/PointLight.js";
import ShareGLSL from "./base/ShareGLSL.js";
import AmbientLight from "./light/AmbientLight.js";
import SpotLight from "./light/SpotLight.js";

export default class Scene extends DisplayContainer {

	#backgroundColor = '#000';
	#backgroundColorAlpha = 1;
	#backgroundColorRGBA = [0, 0, 0, this.#backgroundColorAlpha];
	#directionalLightList = [];
	#pointLightList = [];
	#spotLightList = [];
	#ambientLight;
	#grid;
	#axis;
	#skyBox;
	constructor() {
		super()
	}

	get grid() {return this.#grid;}
	set grid(value) {this.#grid = value;}
	get axis() {return this.#axis;}
	set axis(value) {this.#axis = value;}
	get skyBox() {return this.#skyBox;}
	set skyBox(value) {this.#skyBox = value;}
	get backgroundColor() {return this.#backgroundColor;}
	set backgroundColor(value) {
		this.#backgroundColor = value;
		let rgb = UTIL.hexToRGB_ZeroToOne(value);
		this.#backgroundColorRGBA = [...rgb, this.#backgroundColorAlpha]
	}
	get backgroundColorAlpha() {return this.#backgroundColorAlpha;}
	set backgroundColorAlpha(value) {this.#backgroundColorAlpha = this.#backgroundColorRGBA[3] = value;}
	get backgroundColorRGBA() {return this.#backgroundColorRGBA;}
	get directionalLightList() {return this.#directionalLightList}
	get pointLightList() {return this.#pointLightList}
	get ambientLight() {return this.#ambientLight}
	get spotLightList() {return this.#spotLightList}


	addLight(light) {
		switch (light.constructor) {
			case DirectionalLight:
				if (this.#directionalLightList.length == ShareGLSL.MAX_DIRECTIONAL_LIGHT) UTIL.throwFunc(`addLight : DirectionalLight - Up to ${ShareGLSL.MAX_DIRECTIONAL_LIGHT} are allowed.`);
				this.#directionalLightList.push(light);
				break;
			case PointLight:
				if (this.#pointLightList.length == ShareGLSL.MAX_POINT_LIGHT) UTIL.throwFunc(`addLight : PointLight - Up to ${ShareGLSL.MAX_POINT_LIGHT} are allowed.`);
				this.#pointLightList.push(light);
				break;
			case SpotLight:
				UTIL.throwFunc(`addLight : spotLightList -아직사용할 수없는 유형의 라이트`);
				// if (this.#spotLightList.length == ShareGLSL.MAX_SPOT_LIGHT) UTIL.throwFunc(`addLight : spotLightList - Up to ${ShareGLSL.MAX_SPOT_LIGHT} are allowed.`);
				// this.#spotLightList.push(light);
				break;
			case AmbientLight:
				this.#ambientLight = light;
				break;
			default:
				UTIL.throwFunc(`addLight : only allow BaseLight Instance - inputValue : ${light} { type : ${typeof light} }`);
		}
	}

	removeLight(light) {
		let tIndex;
		switch (light.constructor) {
			case DirectionalLight:
				tIndex = this.#directionalLightList.indexOf(light);
				if (tIndex > -1) this.#directionalLightList.splice(tIndex, 1);
				break;
			case PointLight:
				tIndex = this.#pointLightList.indexOf(light);
				if (tIndex > -1) this.#pointLightList.splice(tIndex, 1);
				break;
			case SpotLight:
				// tIndex = this.#spotLightList.indexOf(light);
				// if (tIndex > -1) this.#spotLightList.splice(tIndex, 1);
				break;
			case AmbientLight:
				this.#ambientLight = null;
				break;
			default:
				UTIL.throwFunc(`removeLight : only allow BaseLight Instance - inputValue : ${light} { type : ${typeof light} }`);
		}
	}
	removeLightAll() {
		this.#directionalLightList.length = 0;
		this.#pointLightList.length = 0;
		this.#spotLightList.length = 0;
		this.#ambientLight = null
	}

}
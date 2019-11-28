/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 17:31:6
 *
 */

"use strict";
import RedUtil from "../util/RedUtil.js";

const color = Base => class extends Base {
	#color = '#ff0000';
	#alpha = 1;
	#colorRGBA = new Float32Array([1, 0, 0, this.#alpha]);
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

	get alpha() {
		return this.#alpha;
	}

	set alpha(value) {
		this.#alpha = this.#colorRGBA[3] = value;
	}

	get colorRGBA() {
		return this.#colorRGBA;
	}
};
const diffuseTexture = Base => class extends Base {
	_diffuseTexture;
	set diffuseTexture(texture) {
		this._diffuseTexture = null;
		this.checkTexture(texture, 'diffuseTexture');
	}

	get diffuseTexture() {
		return this._diffuseTexture
	}
};
const normalTexture = Base => class extends Base {
	_normalTexture;
	set normalTexture(texture) {
		this._normalTexture = null;
		this.checkTexture(texture, 'normalTexture')
	}

	get normalTexture() {
		return this._normalTexture
	}
};
const basicLightPropertys = Base => class extends Base {
	#normalPower = 1;
	#shininess = 64;
	#specularPower = 1;
	#specularColor = '#ffffff';
	#specularColorRGBA = new Float32Array([1, 1, 1, 1]);
	get normalPower() {
		return this.#normalPower;
	}

	set normalPower(value) {
		this.#normalPower = value;
	}

	get shininess() {
		return this.#shininess;
	}

	set shininess(value) {
		this.#shininess = value;
	}
	get specularPower() {
		return this.#specularPower;
	}

	set specularPower(value) {
		this.#specularPower = value;
	}
	get specularColor() {
		return this.#specularColor;
	}

	set specularColor(value) {
		this.#specularColor = hex;
		let rgb = RedUtil.hexToRGB_ZeroToOne(value);
		this.#specularColorRGBA[0] = rgb[0];
		this.#specularColorRGBA[1] = rgb[1];
		this.#specularColorRGBA[2] = rgb[2];
		this.#specularColorRGBA[3] = 1;
	}

	get specularColorRGBA() {
		return this.#specularColorRGBA;
	}


};
class EmptyClass{
	constructor(){}
}
export default {
	mix: (Base, ...texture) => {
		return [Base, ...texture].reduce((parent, extender) => { return extender(parent)})
	},
	EmptyClass : EmptyClass,
	color: color,
	diffuseTexture: diffuseTexture,
	normalTexture: normalTexture,
	basicLightPropertys: basicLightPropertys
}

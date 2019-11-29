/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.29 20:40:32
 *
 */

"use strict";
import RedUtil from "../util/RedUtil.js";

const float1_Float32Array = new Float32Array(1)
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
		//TODO - 시스템 버퍼쪽도 같은 개념으로 바꿔야 if 비용을 줄일 수 있음
		if (this.uniformBuffer_fragment) this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this.#colorRGBA)
	}

	get alpha() {
		return this.#alpha;
	}

	set alpha(value) {
		this.#alpha = this.#colorRGBA[3] = value;
		if (this.uniformBuffer_fragment) this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this.#colorRGBA)
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
		float1_Float32Array[0] = this.#normalPower;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalPower'], float1_Float32Array)
	}

	get shininess() {
		return this.#shininess;
	}

	set shininess(value) {
		this.#shininess = value;
		float1_Float32Array[0] = this.#shininess;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['shininess'], float1_Float32Array)

	}
	get specularPower() {
		return this.#specularPower;
	}

	set specularPower(value) {
		this.#specularPower = value;
		float1_Float32Array[0] = this.#specularPower;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularPower'], float1_Float32Array)
	}
	get specularColor() {
		return this.#specularColor;
	}

	set specularColor(value) {
		this.#specularColor = value;
		let rgb = RedUtil.hexToRGB_ZeroToOne(value);
		this.#specularColorRGBA[0] = rgb[0];
		this.#specularColorRGBA[1] = rgb[1];
		this.#specularColorRGBA[2] = rgb[2];
		this.#specularColorRGBA[3] = 1;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularColorRGBA'], this.#specularColorRGBA)
	}

	get specularColorRGBA() {
		return this.#specularColorRGBA;
	}


};

class EmptyClass {
	constructor() {}
}

export default {
	mix: (Base, ...texture) => {
		return [Base, ...texture].reduce((parent, extender) => { return extender(parent)})
	},
	EmptyClass: EmptyClass,
	color: color,
	diffuseTexture: diffuseTexture,
	normalTexture: normalTexture,
	basicLightPropertys: basicLightPropertys
}

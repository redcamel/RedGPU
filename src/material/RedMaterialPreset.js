/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.30 14:51:39
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
const displacementTexture = Base => class extends Base {
	_displacementTexture;
	#displacementFlowSpeedX = 0.0;
	#displacementFlowSpeedY = 0.0;
	#displacementPower = 0.1;
	set displacementTexture(texture) {
		this._displacementTexture = null;
		this.checkTexture(texture, 'displacementTexture')
	}
	get displacementTexture() {
		return this._displacementTexture
	}
	set displacementTexture(texture) {
		this._displacementTexture = null;
		this.checkTexture(texture, 'displacementTexture')
	}

	get displacementTexture() {
		return this._displacementTexture
	}


	get displacementFlowSpeedY() {
		return this.#displacementFlowSpeedY;
	}

	set displacementFlowSpeedY(value) {
		this.#displacementFlowSpeedY = value;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedY'], new Float32Array([this.#displacementFlowSpeedY]))
	}

	get displacementFlowSpeedX() {
		return this.#displacementFlowSpeedX;
	}

	set displacementFlowSpeedX(value) {
		this.#displacementFlowSpeedX = value;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedX'], new Float32Array([this.#displacementFlowSpeedX]))
	}

	get displacementPower() {
		return this.#displacementPower;
	}

	set displacementPower(value) {
		this.#displacementPower = value;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementPower'], new Float32Array([this.#displacementPower]))
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
	//
	#useFlatMode = false;
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

	get useFlatMode() {
		return this.#useFlatMode;
	}

	set useFlatMode(value) {
		this.#useFlatMode = value;
		this.resetBindingInfo()
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
	displacementTexture: displacementTexture,
	basicLightPropertys: basicLightPropertys
}

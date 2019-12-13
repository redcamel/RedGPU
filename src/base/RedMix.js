/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 10:30:31
 *
 */

"use strict";
import RedUTIL from "../util/RedUTIL.js";

let float1_Float32Array = new Float32Array(1);


const color = Base => class extends Base {
	#color = '#ff0000';
	#alpha = 1;
	#colorRGBA = new Float32Array([1, 0, 0, this.#alpha]);
	get color() {
		return this.#color;
	}

	set color(hex) {
		this.#color = hex;
		let rgb = RedUTIL.hexToRGB_ZeroToOne(hex);
		this.#colorRGBA[0] = rgb[0] * this.#alpha;
		this.#colorRGBA[1] = rgb[1] * this.#alpha;
		this.#colorRGBA[2] = rgb[2] * this.#alpha;
		this.#colorRGBA[3] = this.#alpha;
		//TODO - 시스템 버퍼쪽도 같은 개념으로 바꿔야 if 비용을 줄일 수 있음
		if (this.uniformBuffer_fragment) this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this.#colorRGBA)
	}

	get alpha() {
		return this.#alpha;
	}

	set alpha(value) {
		let rgb = RedUTIL.hexToRGB_ZeroToOne(this.#color);
		this.#colorRGBA[0] = rgb[0] * value;
		this.#colorRGBA[1] = rgb[1] * value;
		this.#colorRGBA[2] = rgb[2] * value;
		this.#colorRGBA[3] = value
		if (this.uniformBuffer_fragment) this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this.#colorRGBA)
	}

	get colorRGBA() {
		return this.#colorRGBA;
	}
};
// TODO - makeTextureClass 이개념을 쓰고싶은데 흠...
// const defineTextureClass = function (name) {
// 	let t0;
// 	t0 = Base => class extends Base {
// 		[`_${name}`]=null;
// 		set [name](texture) {
// 			this[`_${name}`] = null;
// 			this.checkTexture(texture, name);
// 		}
//
// 		get [name]() {
// 			return this[`_${name}`]
// 		}
// 	};
// 	return t0
// }
// const defineTextureClass = makeTextureClass('diffuseTexture');
// const defineTextureClass = makeTextureClass('normalTexture');
// const defineTextureClass = makeTextureClass('specularTexture');


const diffuseTexture = Base => class extends Base {
	_diffuseTexture;
	set diffuseTexture(texture) {
		this._diffuseTexture = null;
		this.checkTexture(texture, 'diffuseTexture')
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

const specularTexture = Base => class extends Base {
	_specularTexture;
	set specularTexture(texture) {
		this._specularTexture = null;
		this.checkTexture(texture, 'specularTexture')
	}

	get specularTexture() {
		return this._specularTexture
	}
};
const emissiveTexture = Base => class extends Base {
	_emissiveTexture;
	_emissivePower = 1.0;
	get emissivePower() {
		return this._emissivePower;
	}

	set emissivePower(value) {
		this._emissivePower = value;
		float1_Float32Array[0] = this._emissivePower;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array)
	}
	set emissiveTexture(texture) {
		this._specularTexture = null;
		this.checkTexture(texture, 'emissiveTexture')
	}

	get emissiveTexture() {
		return this._emissiveTexture
	}
};
const environmentTexture = Base => class extends Base {
	_environmentTexture;
	_environmentPower = 1;
	get environmentPower() {
		return this._environmentPower;
	}

	set environmentPower(value) {
		this._environmentPower = value;
		float1_Float32Array[0] = this._environmentPower;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['environmentPower'], float1_Float32Array)
	}
	set environmentTexture(texture) {
		this._environmentTexture = null;
		this.checkTexture(texture, 'environmentTexture')
	}

	get environmentTexture() {
		return this._environmentTexture
	}
};


const displacementTexture = Base => class extends Base {
	_displacementTexture;
	_displacementFlowSpeedX = 0.0;
	_displacementFlowSpeedY = 0.0;
	_displacementPower = 0.1;
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
		return this._displacementFlowSpeedY;
	}

	set displacementFlowSpeedY(value) {
		this._displacementFlowSpeedY = value;
		float1_Float32Array[0] = this._displacementFlowSpeedY;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedY'], float1_Float32Array)
	}

	get displacementFlowSpeedX() {
		return this._displacementFlowSpeedX;
	}

	set displacementFlowSpeedX(value) {
		this._displacementFlowSpeedX = value;
		float1_Float32Array[0] = this._displacementFlowSpeedX;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedX'], float1_Float32Array)
	}

	get displacementPower() {
		return this._displacementPower;
	}

	set displacementPower(value) {
		this._displacementPower = value;
		float1_Float32Array[0] = this._displacementPower;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementPower'], float1_Float32Array)
	}
};
const basicLightPropertys = Base => class extends Base {
	_normalPower = 1;
	_shininess = 64;
	_specularPower = 1;
	_specularColor = '#ffffff';
	_specularColorRGBA = new Float32Array([1, 1, 1, 1]);
	//
	_useFlatMode = false;
	get normalPower() {
		return this._normalPower;
	}

	set normalPower(value) {
		this._normalPower = value;
		float1_Float32Array[0] = this._normalPower;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalPower'], float1_Float32Array)
	}

	get shininess() {
		return this._shininess;
	}

	set shininess(value) {
		this._shininess = value;
		float1_Float32Array[0] = this._shininess;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['shininess'], float1_Float32Array)

	}
	get specularPower() {
		return this._specularPower;
	}

	set specularPower(value) {
		this._specularPower = value;
		float1_Float32Array[0] = this._specularPower;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularPower'], float1_Float32Array)
	}
	get specularColor() {
		return this._specularColor;
	}

	set specularColor(value) {
		this._specularColor = value;
		let rgb = RedUTIL.hexToRGB_ZeroToOne(value);
		this._specularColorRGBA[0] = rgb[0];
		this._specularColorRGBA[1] = rgb[1];
		this._specularColorRGBA[2] = rgb[2];
		this._specularColorRGBA[3] = 1;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularColorRGBA'], this._specularColorRGBA)
	}

	get specularColorRGBA() {
		return this._specularColorRGBA;
	}

	get useFlatMode() {
		return this._useFlatMode;
	}

	set useFlatMode(value) {
		this._useFlatMode = value;
		this.needResetBindingInfo = true
	}


};

const defineNumber = function (keyName, option = {}) {
	let t0;
	let hasMin = option.hasOwnProperty('min');
	let hsaMax = option.hasOwnProperty('max');
	let min = option['min'];
	let max = option['max'];
	t0 = Base => class extends Base {
		#range = {min: min, max: max};
		[`#${keyName}`] = option['value']
		set [keyName](value) {
			this[`#${keyName}`] = null;
			if (typeof value != 'number') RedUTIL.throwFunc(`${keyName} : only allow Number. - inputValue : ${value} { type : ${typeof value} }`);
			if (hasMin && value < min) value = min;
			if (hsaMax && value > max) value = max;
			this[`#${keyName}`] = value;
			if (option['callback']) option['callback'].call(this, value);
		}
		get [keyName]() {
			return this[`#${keyName}`]
		}
	};
	return t0
}

class EmptyClass {
}

export default {
	mix: (Base, ...texture) => {
		return [Base, ...texture].reduce((parent, extender) => { return extender(parent)})
	},
	EmptyClass: EmptyClass,
	color: color,
	defineNumber: defineNumber,
	diffuseTexture: diffuseTexture,
	normalTexture: normalTexture,
	specularTexture: specularTexture,
	emissiveTexture: emissiveTexture,
	environmentTexture: environmentTexture,
	displacementTexture: displacementTexture,
	basicLightPropertys: basicLightPropertys
}

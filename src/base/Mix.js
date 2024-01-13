/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
import UTIL from "../util/UTIL.js";

let float1_Float32Array = new Float32Array(1);
const mix = (Base, ...texture) => {
  return [Base, ...texture].reduce((parent, extender) => {
    return extender(parent);
  });
};
const color = Base => class extends Base {
  #color = '#ff0000';
  #colorAlpha = 1;
  _colorRGBA = new Float32Array([1, 0, 0, this.#colorAlpha]);

  get colorRGBA() {
    return this._colorRGBA;
  }

  get color() {
    return this.#color;
  }

  set color(hex) {
    this.#color = hex;
    let rgb = UTIL.hexToRGB_ZeroToOne(hex);
    this._colorRGBA[0] = rgb[0] * this.#colorAlpha;
    this._colorRGBA[1] = rgb[1] * this.#colorAlpha;
    this._colorRGBA[2] = rgb[2] * this.#colorAlpha;
    this._colorRGBA[3] = this.#colorAlpha;
    //TODO - 시스템 버퍼쪽도 같은 개념으로 바꿔야 if 비용을 줄일 수 있음
    if (this.uniformBuffer_fragment) {
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA);
    }
  }

  get colorAlpha() {
    return this.#colorAlpha;
  }

  set colorAlpha(value) {
    let rgb = UTIL.hexToRGB_ZeroToOne(this.#color);
    this._colorRGBA[0] = rgb[0] * value;
    this._colorRGBA[1] = rgb[1] * value;
    this._colorRGBA[2] = rgb[2] * value;
    this._colorRGBA[3] = value;
    this.#colorAlpha = value;
    if (this.uniformBuffer_fragment) {
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA);
    }
  }
};
const alpha = Base => class extends Base {
  #alpha = 1;
  get alpha() {
    return this.#alpha;
  }

  set alpha(value) {
    this.#alpha = value;
    float1_Float32Array[0] = this.#alpha;
    if (this.uniformBuffer_fragment) {
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['alpha'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['alpha'], float1_Float32Array);
    }
  }
};
const defineTextureClass = function (name) {
  return Base => class extends Base {
    [`_${name}`] = null;
    [`__${name}RenderYn`] = 0;
    set [name](texture) {
      // this[`_${name}`] = null;
      this.checkTexture(texture, name);
    }

    get [name]() {
      return this[`_${name}`];
    }
  };
};
const diffuseTexture = defineTextureClass('diffuseTexture');
const normalTexture = defineTextureClass('normalTexture');
const specularTexture = defineTextureClass('specularTexture');
const emissiveTextureBase = defineTextureClass('emissiveTexture');
const emissiveTexture = Base => {
  let t0 = class extends Base {
    _emissivePower = 1.0;
    get emissivePower() {
      return this._emissivePower;
    }

    set emissivePower(value) {
      this._emissivePower = value;
      float1_Float32Array[0] = this._emissivePower;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array);
    }
  };
  return mix(t0, emissiveTextureBase);
};
const environmentTextureBase = defineTextureClass('environmentTexture');
const environmentTexture = Base => {
  let t0 = class extends Base {
    _environmentPower = 1;
    get environmentPower() {
      return this._environmentPower;
    }

    set environmentPower(value) {
      this._environmentPower = value;
      float1_Float32Array[0] = this._environmentPower;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['environmentPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['environmentPower'], float1_Float32Array);
    }
  };
  return mix(t0, environmentTextureBase);
};
const refractionTextureBase = defineTextureClass('refractionTexture');
const refractionTexture = Base => {
  let t0 = class extends Base {
    _refractionPower = 1;

    get refractionPower() {
      return this._refractionPower;
    }

    set refractionPower(value) {
      this._refractionPower = value;
      float1_Float32Array[0] = this._refractionPower;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionPower'], float1_Float32Array);
    }

    _refractionRatio = 0.95;

    get refractionRatio() {
      return this._refractionRatio;
    }

    set refractionRatio(value) {
      this._refractionRatio = value;
      float1_Float32Array[0] = this._refractionRatio;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionRatio'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionRatio'], float1_Float32Array);
    }
  };
  return mix(t0, refractionTextureBase);
};
const displacementTextureBase = defineTextureClass('displacementTexture');
const displacementTexture = Base => {
  let t0 = class extends Base {
    _displacementFlowSpeedX = 0.0;

    get displacementFlowSpeedX() {
      return this._displacementFlowSpeedX;
    }

    set displacementFlowSpeedX(value) {
      this._displacementFlowSpeedX = value;
      float1_Float32Array[0] = this._displacementFlowSpeedX;
      // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedX'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedX'], float1_Float32Array);
    }

    _displacementFlowSpeedY = 0.0;

    get displacementFlowSpeedY() {
      return this._displacementFlowSpeedY;
    }

    set displacementFlowSpeedY(value) {
      this._displacementFlowSpeedY = value;
      float1_Float32Array[0] = this._displacementFlowSpeedY;
      // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedY'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedY'], float1_Float32Array);
    }

    _displacementPower = 0.1;

    get displacementPower() {
      return this._displacementPower;
    }

    set displacementPower(value) {
      this._displacementPower = value;
      float1_Float32Array[0] = this._displacementPower;
      // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementPower'], float1_Float32Array);
    }
  };
  return mix(t0, displacementTextureBase);
};
const roughnessTextureBase = defineTextureClass('roughnessTexture');
const roughnessTextureGLTF = Base => {
  let t0 = class extends Base {
    _roughnessTexCoordIndex = 0;

    get roughnessTexCoordIndex() {
      return this._roughnessTexCoordIndex;
    }

    set roughnessTexCoordIndex(value) {
      this._roughnessTexCoordIndex = value;
      float1_Float32Array[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessTexCoordIndex'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessTexCoordIndex'], float1_Float32Array);
    }

    _roughnessFactor = 1;

    get roughnessFactor() {
      return this._roughnessFactor;
    }

    set roughnessFactor(value) {
      this._roughnessFactor = value;
      float1_Float32Array[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessFactor'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessFactor'], float1_Float32Array);
    }

    get roughnessTexture() {
      return this._roughnessTexture;
    }

    set roughnessTexture(texture) {
      this.checkTexture(texture, 'roughnessTexture');
    }
  };
  return mix(t0, roughnessTextureBase);
};
const occlusionTextureBase = defineTextureClass('occlusionTexture');
const occlusionTextureGLTF = Base => {
  let t0 = class extends Base {
    _occlusionTexCoordIndex = 0;

    get occlusionTexCoordIndex() {
      return this._occlusionTexCoordIndex;
    }

    set occlusionTexCoordIndex(value) {
      this._occlusionTexCoordIndex = value;
      float1_Float32Array[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionTexCoordIndex'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionTexCoordIndex'], float1_Float32Array);

    }

    _occlusionPower = 1;

    get occlusionPower() {
      return this._occlusionPower;
    }

    set occlusionPower(value) {
      this._occlusionPower = value;
      float1_Float32Array[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionPower'], float1_Float32Array);
    }

    get occlusionTexture() {
      return this._occlusionTexture;
    }

    set occlusionTexture(texture) {
      this.checkTexture(texture, 'occlusionTexture');
    }
  };
  return mix(t0, occlusionTextureBase);
};
const basicLightPropertys = Base => class extends Base {
  _normalPower = 1;

  get normalPower() {
    return this._normalPower;
  }

  set normalPower(value) {
    this._normalPower = value;
    float1_Float32Array[0] = this._normalPower;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalPower'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalPower'], float1_Float32Array);
  }

  _shininess = 32;

  get shininess() {
    return this._shininess;
  }

  set shininess(value) {
    this._shininess = value;
    float1_Float32Array[0] = this._shininess;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['shininess'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['shininess'], float1_Float32Array);
  }

  _specularPower = 1;

  get specularPower() {
    return this._specularPower;
  }

  set specularPower(value) {
    this._specularPower = value;
    float1_Float32Array[0] = this._specularPower;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularPower'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularPower'], float1_Float32Array);
  }

  _specularColor = '#ffffff';

  get specularColor() {
    return this._specularColor;
  }

  set specularColor(value) {
    this._specularColor = value;
    let rgb = UTIL.hexToRGB_ZeroToOne(value);
    this._specularColorRGBA[0] = rgb[0];
    this._specularColorRGBA[1] = rgb[1];
    this._specularColorRGBA[2] = rgb[2];
    this._specularColorRGBA[3] = 1;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularColorRGBA'], this._specularColorRGBA)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularColorRGBA'], this._specularColorRGBA);
  }

  _specularColorRGBA = new Float32Array([1, 1, 1, 1]);

  get specularColorRGBA() {
    return this._specularColorRGBA;
  }

  //
  _useFlatMode = false;

  get useFlatMode() {
    return this._useFlatMode;
  }

  set useFlatMode(value) {
    this._useFlatMode = value;
    float1_Float32Array[0] = value ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useFlatMode'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['useFlatMode'], float1_Float32Array);
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
    [`#${keyName}`] = option['value'];
    set [keyName](value) {
      this[`#${keyName}`] = null;
      if (typeof value != 'number') UTIL.throwFunc(`${keyName} : only allow Number. - inputValue : ${value} { type : ${typeof value} }`);
      if (hasMin && value < min) value = min;
      if (hsaMax && value > max) value = max;
      this[`#${keyName}`] = value;
      if (option['callback']) option['callback'].call(this, value);
    }

    get [keyName]() {
      return this[`#${keyName}`];
    }
  };
  return t0;
};

class EmptyClass {
}

export default {
  mix: mix,
  EmptyClass: EmptyClass,
  color: color,
  alpha: alpha,
  defineNumber: defineNumber,
  diffuseTexture: diffuseTexture,
  normalTexture: normalTexture,
  specularTexture: specularTexture,
  emissiveTexture: emissiveTexture,
  environmentTexture: environmentTexture,
  refractionTexture: refractionTexture,
  displacementTexture: displacementTexture,
  roughnessTextureGLTF: roughnessTextureGLTF,
  occlusionTextureGLTF: occlusionTextureGLTF,
  basicLightPropertys: basicLightPropertys
};

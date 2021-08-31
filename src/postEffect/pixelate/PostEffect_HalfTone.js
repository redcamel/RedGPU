/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import TypeSize from "../../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_HalfTone extends BasePostEffect {
  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		vNormal = normal;
		vUV = uv;
		gl_Position = vec4(position*2.0,1.0);
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float centerX;
        float centerY;
        float angle;
        float radius;
        float grayMode;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float pattern(float angle) {
		angle = angle * 3.141592653589793/180.0;
		float s = sin(angle), c = cos(angle);
		vec2 tex = vUV;
		tex.x -= fragmentUniforms.centerX + 0.5;
		tex.y -= fragmentUniforms.centerY + 0.5;
		vec2 point = vec2(
			c * tex.x - s * tex.y,
			s * tex.x + c * tex.y
		) * systemUniforms.resolution /fragmentUniforms.radius;
		return (sin(point.x) * sin(point.y)) * 4.0;
	}

	void main() {
		vec4 finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		if(fragmentUniforms.grayMode == 1.0) {
			float average = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
			finalColor = vec4(vec3(average * 10.0 - 5.0 + pattern(fragmentUniforms.angle)), finalColor.a);
		}else{
			vec3 cmy = 1.0 - finalColor.rgb;
			float k = min(cmy.x, min(cmy.y, cmy.z));
			cmy = (cmy - k) / (1.0 - k);
			cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(fragmentUniforms.angle + 0.26179), pattern(fragmentUniforms.angle + 1.30899), pattern(fragmentUniforms.angle)), 0.0, 1.0);
			k = clamp(k * 10.0 - 5.0 + pattern(fragmentUniforms.angle + 0.78539), 0.0, 1.0);
			finalColor = vec4(1.0 - cmy - k, finalColor.a);
		}
		outColor = finalColor;
	}
`;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
  static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32, valueName: 'centerX'},
    {size: TypeSize.float32, valueName: 'centerY'},
    {size: TypeSize.float32, valueName: 'angle'},
    {size: TypeSize.float32, valueName: 'radius'},
    {size: TypeSize.float32, valueName: 'grayMode'}
  ];

  constructor(redGPUContext) {super(redGPUContext);}

  _centerX = 0;

  get centerX() {return this._centerX;}

  set centerX(value) {
    this._centerX = value;
    float1_Float32Array[0] = this._centerX;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerX'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerX'], float1_Float32Array);
  }

  _centerY = 0;

  get centerY() {return this._centerY;}

  set centerY(value) {
    this._centerY = value;
    float1_Float32Array[0] = this._centerY;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerY'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerY'], float1_Float32Array);
  }

  _angle = 0;

  get angle() {return this._angle;}

  set angle(value) {
    this._angle = value;
    float1_Float32Array[0] = this._angle;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['angle'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['angle'], float1_Float32Array);
  }

  _radius = 2;

  get radius() {return this._radius;}

  set radius(value) {
    this._radius = value;
    float1_Float32Array[0] = this._radius;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['radius'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['radius'], float1_Float32Array);
  }

  _grayMode = false;

  get grayMode() {return this._grayMode;}

  set grayMode(value) {
    this._grayMode = value;
    float1_Float32Array[0] = this._grayMode ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['grayMode'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['grayMode'], float1_Float32Array);
  }
}

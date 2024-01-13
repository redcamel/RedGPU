/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */

import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import TypeSize from "../../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_BrightnessContrast extends BasePostEffect {
  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}

	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float brightness;
        float contrast;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor = vec4(0.0);
		finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		if ( fragmentUniforms.contrast > 0.0 ) finalColor.rgb = ( finalColor.rgb - 0.5 ) / ( 1.0 - fragmentUniforms.contrast ) + 0.5;
		else finalColor.rgb = ( finalColor.rgb - 0.5 ) * ( 1.0 + fragmentUniforms.contrast ) + 0.5;
		finalColor.rgb += fragmentUniforms.brightness;
		outColor = finalColor;
	}
`;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
  static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32, valueName: 'brightness'},
    {size: TypeSize.float32, valueName: 'contrast'}
  ];

  constructor(redGPUContext) {super(redGPUContext);}

  _brightness = 0;

  get brightness() {return this._brightness;}

  set brightness(value) {/*FIXME min: -150, max: 150*/
    this._brightness = value;
    float1_Float32Array[0] = this._brightness / 255;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['brightness'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['brightness'], float1_Float32Array);
  }

  _contrast = 0;

  get contrast() {return this._contrast;}

  set contrast(value) {/*FIXME min: -50, max: 100*/
    this._contrast = value;
    float1_Float32Array[0] = this._contrast / 255;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['contrast'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['contrast'], float1_Float32Array);
  }
}

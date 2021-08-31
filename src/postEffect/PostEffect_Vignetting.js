/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */

"use strict";
import BaseMaterial from "../base/BaseMaterial.js";
import ShareGLSL from "../base/ShareGLSL.js";
import BasePostEffect from "../base/BasePostEffect.js";
import TypeSize from "../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_Vignetting extends BasePostEffect {
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
        float intensity;
        float size;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;

	void main() {
		vec4 finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		float dist = distance(vUV, vec2(0.5, 0.5));
		finalColor.rgb *= smoothstep(0.8, fragmentUniforms.size * 0.799, dist * ( fragmentUniforms.intensity + fragmentUniforms.size ));
		outColor = finalColor;
	}
`;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};

  static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32, valueName: 'intensity'},
    {size: TypeSize.float32, valueName: 'size'}
  ];

  constructor(redGPUContext) {super(redGPUContext);}

  _intensity = 0.85;

  get intensity() {return this._intensity;}

  set intensity(value) {
    this._intensity = value;
    float1_Float32Array[0] = this._intensity;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['intensity'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['intensity'], float1_Float32Array);
  }

  _size = 0.1;

  get size() {return this._size;}

  set size(value) {
    this._size = value;
    float1_Float32Array[0] = this._size;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array);
  }
}

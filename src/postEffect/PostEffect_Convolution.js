/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */

import BaseMaterial from "../base/BaseMaterial.js";
import ShareGLSL from "../base/ShareGLSL.js";
import BasePostEffect from "../base/BasePostEffect.js";
import TypeSize from "../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_Convolution extends BasePostEffect {
  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}

	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vTime;
	void main() {
		vNormal = normal;
		vUV = uv;
		vTime = systemUniforms.time;
		gl_Position = vec4(position*2.0,1.0);
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float kernelWeight;
        mat3 kernel;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vTime;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;

	void main() {

		vec2 perPX = vec2(1.0/systemUniforms.resolution.x, 1.0/systemUniforms.resolution.y);
		vec4 finalColor = vec4(0.0);
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2(-1.0, -1.0)) * fragmentUniforms.kernel[0][0] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 0.0, -1.0)) * fragmentUniforms.kernel[0][1] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 1.0, -1.0)) * fragmentUniforms.kernel[0][2] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2(-1.0,  0.0)) * fragmentUniforms.kernel[1][0] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 0.0,  0.0)) * fragmentUniforms.kernel[1][1] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 1.0,  0.0)) * fragmentUniforms.kernel[1][2] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2(-1.0,  1.0)) * fragmentUniforms.kernel[2][0] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 0.0,  1.0)) * fragmentUniforms.kernel[2][1] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 1.0,  1.0)) * fragmentUniforms.kernel[2][2] ;

		outColor = vec4((finalColor / fragmentUniforms.kernelWeight).rgb, 1.0);
	}
`;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
  static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32, valueName: 'kernelWeight'},
    {size: TypeSize.mat3, valueName: 'kernel'}
  ];
  static NORMAL = new Float32Array([
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0
  ]);
  static SHARPEN = new Float32Array([
    0, -1, 0, 0,
    -1, 5, -1, 0,
    0, -1, 0, 0,
  ]);
  static BLUR = new Float32Array([
    1, 1, 1, 0,
    1, 1, 1, 0,
    1, 1, 1, 0
  ]);
  static EDGE = new Float32Array([
    0, 1, 0, 0,
    1, -4, 1, 0,
    0, 1, 0, 0
  ]);
  static EMBOSS = new Float32Array([
    -2, -1, 0, 0,
    -1, 1, 1, 0,
    0, 1, 2, 0
  ]);

  constructor(redGPUContext, kernel = PostEffect_Convolution.NORMAL) {
    super(redGPUContext);
    this.kernel = kernel;
    console.log(this.uniformBufferDescriptor_fragment);
  }

  _kernel;

  get kernel() {return this._kernel;}

  set kernel(value) {
    this._kernel = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernel'], this._kernel);
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernel'], this._kernel);
    this.kernelWeight = 1;
  }

  _kernelWeight;

  get kernelWeight() {return this._kernelWeight;}

  set kernelWeight(value) {
    let sum = 0;
    let i = this._kernel.length;
    while (i--) sum += this._kernel[i];
    this._kernelWeight = sum;
    float1_Float32Array[0] = sum;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernelWeight'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernelWeight'], float1_Float32Array);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedShareGLSL from "../base/RedShareGLSL.js";
import RedBasePostEffect from "../base/RedBasePostEffect.js";
import RedTypeSize from "../resources/RedTypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class RedPostEffect_Convolution extends RedBasePostEffect {
	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix;
    } meshUniforms;
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
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        mat3 kernel;
        float kernelWeight;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vTime;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	
	void main() {

		vec2 perPX = vec2(1.0/systemUniforms.resolution.x, 1.0/systemUniforms.resolution.y);
		vec4 finalColor = vec4(0.0);
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2(-1.0, -1.0)) * fragmentUniforms.kernel[0][0] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2( 0.0, -1.0)) * fragmentUniforms.kernel[0][1] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2( 1.0, -1.0)) * fragmentUniforms.kernel[0][2] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2(-1.0,  0.0)) * fragmentUniforms.kernel[1][0] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2( 0.0,  0.0)) * fragmentUniforms.kernel[1][1] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2( 1.0,  0.0)) * fragmentUniforms.kernel[1][2] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2(-1.0,  1.0)) * fragmentUniforms.kernel[2][0] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2( 0.0,  1.0)) * fragmentUniforms.kernel[2][1] ;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + perPX * vec2( 1.0,  1.0)) * fragmentUniforms.kernel[2][2] ;

		outColor = vec4((finalColor / fragmentUniforms.kernelWeight).rgb, 1.0);
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.mat3, valueName: 'kernel'},
		{size: RedTypeSize.float, valueName: 'kernelWeight'}
	];
	static NORMAL = new Float32Array([
		0, 0, 0,
		0, 1, 0,
		0, 0, 0
	]);
	static SHARPEN = new Float32Array([
		0, -1, 0,
		-1, 5, -1,
		0, -1, 0
	]);
	static BLUR = new Float32Array([
		1, 1, 1,
		1, 1, 1,
		1, 1, 1
	]);
	static EDGE = new Float32Array([
		0, 1, 0,
		1, -4, 1,
		0, 1, 0
	]);
	static EMBOSS = new Float32Array([
		-2, -1, 0,
		-1, 1, 1,
		0, 1, 2
	]);
	_kernel;
	_kernelWeight;
	constructor(redGPU) {
		super(redGPU);
		this.kernel = RedPostEffect_Convolution.NORMAL;
		console.log('this.uniformBuffer_fragment',this.uniformBuffer_fragment)
	}

	get kernel() {
		return this._kernel;
	}

	set kernel(value) {
		this._kernel = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernel'], this._kernel);
		this.kernelWeight = 1
	}
	get kernelWeight() {
		return this._kernelWeight
	}
	set kernelWeight(value) {
		let sum = 0;
		let i = this._kernel.length;
		while (i--) sum += this._kernel[i];
		this._kernelWeight = sum;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernelWeight'], float1_Float32Array)
	}


}

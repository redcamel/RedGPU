/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 17:43:39
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import TypeSize from "../../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_Bloom_blend extends BasePostEffect {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout( set = ${ShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix;
    } meshUniforms;
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
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float bloomStrength;
        float exposure;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uBlurTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor;
		vec4 blurColor;
		vec4 finalColor;
		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		blurColor = texture( sampler2D( uBlurTexture, uSampler ), vUV );	
		finalColor = diffuseColor;
		finalColor.rgb = (finalColor.rgb  + blurColor.rgb * fragmentUniforms.bloomStrength ) * fragmentUniforms.exposure ;
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};;
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'bloomStrength'},
		{size: TypeSize.float, valueName: 'exposure'}
	];
	blurTexture;
	_bloomStrength = 15;
	_exposure = 15;
	get bloomStrength() {
		return this._bloomStrength;
	}

	set bloomStrength(value) {
		this._bloomStrength = value;
		float1_Float32Array[0] = this._bloomStrength;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['bloomStrength'], float1_Float32Array)
	}

	get exposure() {
		return this._exposure;
	}

	set exposure(value) {
		this._exposure = value;
		float1_Float32Array[0] = this._exposure;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['exposure'], float1_Float32Array)
	}
	constructor(redGPUContext) {
		super(redGPUContext);
	}
	resetBindingInfo() {
		this.bindings = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_fragment.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			},
			{binding: 1, resource: this.sampler.GPUSampler},
			{
				binding: 2,
				resource: this.sourceTexture
			},
			{
				binding: 3,
				resource: this.blurTexture
			}

		];
		this._afterResetBindingInfo();
	}
}

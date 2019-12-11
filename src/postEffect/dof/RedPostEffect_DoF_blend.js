/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.11 20:19:9
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";
import RedBasePostEffect from "../../base/RedBasePostEffect.js";
import RedTypeSize from "../../resources/RedTypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class RedPostEffect_DoF_blend extends RedBasePostEffect {
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
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float focusLength;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 3 ) uniform texture2D uBlurTexture;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 4 ) uniform texture2D uDepthTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor;
		vec4 blurColor;
		vec4 depthColor;
		diffuseColor = texture( sampler2D( uDiffuseTexture, uSampler ), vUV );
		blurColor = texture( sampler2D( uBlurTexture, uSampler ), vUV );
		depthColor = texture( sampler2D( uDepthTexture, uSampler ), vUV );
		depthColor = depthColor * fragmentUniforms.focusLength;
		
		diffuseColor.rgb *= min(depthColor.r,1.0);
		blurColor.rgb *= max(1.0 - depthColor.r,0.0);
		outColor = diffuseColor + blurColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 4, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float, valueName: 'focusLength'}
	];
	_blurTexture;
	_depthTexture;
	_focusLength = 15;
	get focusLength() {
		return this._focusLength;
	}

	set focusLength(value) {
		this._focusLength = value;
		float1_Float32Array[0] = this._focusLength;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['focusLength'], float1_Float32Array)
	}
	constructor(redGPU) {
		super(redGPU);
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
				resource: this._diffuseTexture
			},
			{
				binding: 3,
				resource: this._blurTexture
			},
			{
				binding: 4,
				resource: this._depthTexture
			}

		];
		this._afterResetBindingInfo();
	}
}

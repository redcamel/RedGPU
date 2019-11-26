/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedColorMaterial from "./RedColorMaterial.js";
import RedUUID from "../base/RedUUID.js";
import RedShareGLSL from "../base/RedShareGLSL.js";
import RedUniformBufferDescriptor from "../buffer/RedUniformBufferDescriptor.js";
import RedUtil from "../util/RedUtil.js";

export default class RedColorPhongMaterial extends RedColorMaterial {

	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout(set=2,binding = 0) uniform Uniforms {
        mat4 modelMatrix;
        mat4 normalMTX;
    } uniforms;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec3 normal;
	layout(location = 2) in vec2 uv;
	layout(location = 0) out vec3 vNormal;
	layout(location = 1) out vec2 vUV;
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * uniforms.modelMatrix* vec4(position,1.0);
		vNormal = (uniforms.normalMTX * vec4(normal,1.0)).xyz;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniformsWithLight}
	layout(set=2,binding = 1) uniform Uniforms {
        vec4 color;
        float shininess; float specularPower;
	    vec4 specularColor;
    } uniforms;
	layout(location = 0) in vec3 vNormal;
	layout(location = 1) in vec2 vUV;
	layout(location = 0) out vec4 outColor;
	void main() {

		vec3 N = normalize(vNormal);
		
		vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		vec4 la = vec4(0.0, 0.0, 0.0, 0.2);
		vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);
		
		vec4 calcColor = calcDirectionalLight(
			uniforms.color,
			N,
			ld,
			ls,
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLight,
			uniforms.shininess,
			uniforms.specularPower,
			uniforms.specularColor
		);
		    
	
	    vec4 finalColor = la + calcColor;
		
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor = {
		bindings: [
			{
				binding: 0,
				visibility: GPUShaderStage.VERTEX,
				type: "uniform-buffer"
			},
			{
				binding: 1,
				visibility: GPUShaderStage.FRAGMENT,
				type: "uniform-buffer"
			}
		]
	};
	static uniformBufferDescriptor_vertex = new RedUniformBufferDescriptor(
		[
			{size: RedTypeSize.mat4, valueName: 'matrix'},
			{size: RedTypeSize.mat4, valueName: 'normalMatrix'}
		]
	);
	static uniformBufferDescriptor_fragment = {
		size: RedTypeSize.float4 * 3,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'colorRGBA', targetKey: 'material'},
			{offset: RedTypeSize.float4, valueName: 'shininess', targetKey: 'material'},
			{offset: RedTypeSize.float4 + RedTypeSize.float, valueName: 'specularPower', targetKey: 'material'},
			{
				offset: RedTypeSize.float4 + RedTypeSize.float4,
				valueName: 'specularColorRGBA',
				targetKey: 'material'
			},
		]
	};

	#shininess = 64;
	#specularPower = 1;
	#specularColor = '#ffffff';
	#specularColorRGBA = new Float32Array([1, 1, 1, 1]);

	constructor(redGPU, color = '#ff0000', alpha = 1) {
		super(redGPU, color, alpha);
	}
	get specularColorRGBA() {
		return this.#specularColorRGBA;
	}
	get specularColor() {
		return this.#specularColor;
	}

	set specularColor(hex) {
		this.#specularColor = hex;
		let rgb = RedUtil.hexToRGB_ZeroToOne(hex);
		this.#specularColorRGBA[0] = rgb[0];
		this.#specularColorRGBA[1] = rgb[1];
		this.#specularColorRGBA[2] = rgb[2];
		this.#specularColorRGBA[3] = 1;
	}

	get specularPower() {
		return this.#specularPower;
	}

	set specularPower(value) {
		this.#specularPower = value;
	}

	get shininess() {
		return this.#shininess;
	}

	set shininess(value) {
		this.#shininess = value;
	}

	resetBindingInfo() {
		this.bindings = null;
		this.searchModules();
		this.bindings = [
			{
				binding: 0,
				resource: {
					buffer: null,
					offset: 0,
					size: this.uniformBufferDescriptor_vertex.size
				}
			},
			{
				binding: 1,
				resource: {
					buffer: null,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			}
		];
		this.setUniformBindGroupDescriptor();
		this._UUID = RedUUID.makeUUID()
	}
}

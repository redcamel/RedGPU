/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.19 13:50:11
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";
import RedBasePostEffect from "../../base/RedBasePostEffect.js";

export default class RedPostEffect_Invert extends RedBasePostEffect {
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
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		diffuseColor = texture( sampler2D( uDiffuseTexture, uSampler ), vUV ) ;
		diffuseColor.rgb = 1.0 - diffuseColor.rgb;
		outColor = diffuseColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;

	constructor(redGPUContext) {
		super(redGPUContext);
	}
}

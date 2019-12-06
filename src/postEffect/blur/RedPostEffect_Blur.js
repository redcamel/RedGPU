/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";
import RedBasePostEffect from "../../base/RedBasePostEffect.js";

export default class RedPostEffect_Blur extends RedBasePostEffect{
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
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec2 px = vec2(1.0/systemUniforms.resolution.x, 1.0/systemUniforms.resolution.y);
		vec4 finalColor = vec4(0.0);
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2(-7.0*px.x, -7.0*px.y) )*0.0044299121055113265;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2(-6.0*px.x, -6.0*px.y) )*0.00895781211794;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2(-5.0*px.x, -5.0*px.y) )*0.0215963866053;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2(-4.0*px.x, -4.0*px.y) )*0.0443683338718;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2(-3.0*px.x, -3.0*px.y) )*0.0776744219933;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2(-2.0*px.x, -2.0*px.y) )*0.115876621105;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2(-1.0*px.x, -1.0*px.y) )*0.147308056121;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV                             )*0.159576912161;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2( 1.0*px.x,  1.0*px.y) )*0.147308056121;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2( 2.0*px.x,  2.0*px.y) )*0.115876621105;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2( 3.0*px.x,  3.0*px.y) )*0.0776744219933;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2( 4.0*px.x,  4.0*px.y) )*0.0443683338718;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2( 5.0*px.x,  5.0*px.y) )*0.0215963866053;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2( 6.0*px.x,  6.0*px.y) )*0.00895781211794;
		finalColor += texture( sampler2D( uDiffuseTexture, uSampler ), vUV + vec2( 7.0*px.x,  7.0*px.y) )*0.0044299121055113265;
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;
	constructor(redGPU) {
		super(redGPU);
	}
}

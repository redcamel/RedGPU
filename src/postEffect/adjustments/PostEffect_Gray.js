/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import BasePostEffect from "../../base/BasePostEffect.js";

export default class PostEffect_Gray extends BasePostEffect {
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
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV ) ;
	    float gray = (diffuseColor.r  + diffuseColor.g + diffuseColor.b)/3.0;
		outColor = vec4( gray, gray, gray, 1.0);;
	}
`;
	static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
	static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;
	constructor(redGPUContext) {super(redGPUContext);}
}

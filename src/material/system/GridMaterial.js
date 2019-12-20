/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:27
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";

export default class GridMaterial extends BaseMaterial {

	static vertexShaderGLSL = `
	#version 450
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec4 color;
	layout( location = 0 ) out vec4 vColor;

	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position,1.0);
		vColor = color;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	layout( location = 0 ) in vec4 vColor;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	void main() {
		outColor = vColor;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
	`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = {bindings: []};
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;
	constructor(redGPUContext) {
		super(redGPUContext);
		this.needResetBindingInfo = true
	}
	resetBindingInfo() {
		this.bindings = [];
		this._afterResetBindingInfo();
	}
}

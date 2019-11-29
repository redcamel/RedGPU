/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.29 12:46:41
 *
 */

"use strict";
import RedTypeSize from "../../resources/RedTypeSize.js";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";

export default class RedGridMaterial extends RedBaseMaterial {

	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout(set = 2,binding = 0) uniform Uniforms {
        mat4 modelMatrix;
    } uniforms;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec4 color;
	layout(location = 0) out vec4 vColor;

	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * uniforms.modelMatrix* vec4(position,1.0);
		vColor = color;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	layout(location = 0) in vec4 vColor;
	layout(location = 0) out vec4 outColor;
	void main() {
		outColor = vColor;
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
	static uniformBufferDescriptor_vertex =  RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;
	constructor(redGPU) {
		super(redGPU);
		this.resetBindingInfo()
	}


	resetBindingInfo() {
		this.bindings = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_vertex.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_vertex.size
				}
			},
			{
				binding: 1,
				resource: {
					buffer: this.uniformBuffer_fragment.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			}
		];
		this.uniformBindGroupDescriptor = {
			layout: this.GPUBindGroupLayout,
			bindings: this.bindings
		};
		this.uniformBindGroup_material.setGPUBindGroup(this.uniformBindGroupDescriptor)
		this.searchModules();

		this.setUniformBindGroupDescriptor();
		this.updateUUID()
	}
}

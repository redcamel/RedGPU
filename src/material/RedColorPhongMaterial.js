"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedColorMaterial from "./RedColorMaterial.js";

export default class RedColorPhongMaterial extends RedColorMaterial {
	static vertexShaderGLSL = `
	#version 450
	${RedBaseMaterial.GLSL_SystemUniforms}
    layout(set=1,binding = 0) uniform Uniforms {
        mat4 modelMatrix;
    } uniforms;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec3 normal;
	layout(location = 2) in vec2 uv;
	layout(location = 0) out vec3 vNormal;
	layout(location = 1) out vec2 vUV;

	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * uniforms.modelMatrix* vec4(position,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	 layout(set=1,binding = 1) uniform Uniforms {
        vec4 color;
    } uniforms;
	layout(location = 0) in vec3 vNormal;
	layout(location = 1) in vec2 vUV;
	layout(location = 0) out vec4 outColor;
	void main() {
		outColor = uniforms.color;
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
	static uniformBufferDescriptor_vertex = {
		size: RedTypeSize.mat4,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'matrix'}
		]
	};
	static uniformBufferDescriptor_fragment = {
		size: RedTypeSize.float4,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'colorRGBA', targetKey: 'material'}
		]
	};


	constructor(redGPU, color = '#ff0000', alpha = 1) {
		super(redGPU, color = '#ff0000', alpha);
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
	}
}

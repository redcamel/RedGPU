/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 17:0:49
 *
 */

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedShareGLSL from "../base/RedShareGLSL.js";
import RedMix from "../base/RedMix.js";

export default class RedColorMaterial extends RedMix.mix(
	RedBaseMaterial,
	RedMix.color,
	RedMix.alpha
) {
	static vertexShaderGLSL = `
	#version 460
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
        mat4 normalMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
    } meshUniforms;
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 1 ) uniform MeshUniformIndex {
        float index;
    } meshUniformsIndex;
	layout( location = 0 ) in vec3 position;
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position, 1.0);
	}
	`;
	static fragmentShaderGLSL = `
	#version 460
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        vec4 color;
        float alpha;
    } fragmentUniforms;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	void main() {
		outColor = fragmentUniforms.color;
		outColor.a *= fragmentUniforms.alpha;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
	`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"}
		]
	};
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float4, valueName: 'colorRGBA'},
		{size: RedTypeSize.float, valueName: 'alpha'}
	];

	constructor(redGPUContext, color = '#ff0000', colorAlpha = 1) {
		super(redGPUContext);
		this.color = color;
		this.colorAlpha = colorAlpha;
		this.needResetBindingInfo = true
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
			}
		];
		this._afterResetBindingInfo();
	}
}
/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 17:43:39
 *
 */

"use strict";
import TypeSize from "../../resources/TypeSize.js";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import Mix from "../../base/Mix.js";

export default class LineMaterial extends Mix.mix(
	BaseMaterial,
	Mix.alpha
) {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec4 color;
	layout( location = 0 ) out float vMouseColorID;
	layout( location = 1 ) out vec4 vColor;		
	void main() {
		vMouseColorID = meshUniformsIndex.mouseColorID;
		vColor = color;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position,1.0);
	
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
         float alpha;
    } fragmentUniforms;
	layout( location = 0 ) in float vMouseColorID;
	layout( location = 1 ) in vec4 vColor;			
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outNormalDepthColor;
	layout( location = 2 ) out vec4 outMouseColorID;
	void main() {
		outColor = vColor;
		outColor.a *= fragmentUniforms.alpha;
		outMouseColorID = vec4(vMouseColorID, vec3(0.0));
		outNormalDepthColor = vec4( vec3(0.0), gl_FragCoord.z/gl_FragCoord.w );
	}
	`;
	static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
	;
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"}
		]
	};
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'alpha'}
	];


	constructor(redGPUContext) {
		super(redGPUContext);
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
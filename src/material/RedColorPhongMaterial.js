/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.10 14:18:48
 *
 */

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedShareGLSL from "../base/RedShareGLSL.js";

import RedMix from "../base/RedMix.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";

export default class RedColorPhongMaterial extends RedMix.mix(
	RedBaseMaterial,
	RedMix.color,
	RedMix.basicLightPropertys
) {

	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
        mat4 normalMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
    } meshUniforms;
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 1 ) uniform MeshUniformIndex {
        float index;
    } meshUniformsIndex;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec4 vVertexPosition;
	
	void main() {
		vVertexPosition = meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position,1.0);
		vNormal = (meshUniforms.normalMatrix[ int(meshUniformsIndex.index) ] * vec4(normal,1.0)).xyz;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        vec4 color;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec4 vVertexPosition;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	void main() {
		vec3 N = normalize(vNormal);
		//#RedGPU#useFlatMode# N = getFlatNormal(vVertexPosition.xyz);
		
		float specularTextureValue = 1.0;
		
		vec4 finalColor = 
		calcDirectionalLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
		+
	    calcPointLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		);
			
		outColor = finalColor;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
`;
	static PROGRAM_OPTION_LIST = ['useFlatMode'];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"}
		]
	};
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float4, valueName: 'colorRGBA'},
		{size: RedTypeSize.float, valueName: 'shininess'},
		{size: RedTypeSize.float, valueName: 'specularPower'},
		{
			size: RedTypeSize.float4,
			valueName: 'specularColorRGBA',
		},
	];


	constructor(redGPU, color = '#ff0000', alpha = 1) {
		super(redGPU);
		this.color = color;
		this.alpha = alpha;

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

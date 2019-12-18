/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.18 19:33:34
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
	RedMix.alpha,
	RedMix.basicLightPropertys
) {

	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${RedShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec4 vVertexPosition;
	layout( location = 2 ) out vec4 vMouseColorID;	
	void main() {
		vVertexPosition = meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position,1.0);
		vNormal = (meshUniforms.normalMatrix[ int(meshUniformsIndex.index) ] * vec4(normal,1.0)).xyz;
		vMouseColorID = meshUniformsIndex.mouseColorID;
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
        float alpha;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec4 vVertexPosition;
	layout( location = 2 ) in vec4 vMouseColorID;	
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	layout( location = 2 ) out vec4 outMouseColorID;
	void main() {
		float testAlpha = fragmentUniforms.color.a;

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
		)
		+ la;
			
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha;
		outMouseColorID = vMouseColorID;
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

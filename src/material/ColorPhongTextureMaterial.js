/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 13:54:48
 *
 */

"use strict";
import TypeSize from "../resources/TypeSize.js";
import ShareGLSL from "../base/ShareGLSL.js";

import Mix from "../base/Mix.js";
import BaseMaterial from "../base/BaseMaterial.js";
import RedGPUContext from "../RedGPUContext.js";

export default class ColorPhongTextureMaterial extends Mix.mix(
	BaseMaterial,
	Mix.color,
	Mix.alpha,
	Mix.normalTexture,
	Mix.specularTexture,
	Mix.emissiveTexture,
	Mix.displacementTexture,
	Mix.basicLightPropertys
) {

	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement}    
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out vec4 vVertexPosition;
	layout( location = 3 ) out float vMouseColorID;	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
    } vertexUniforms;
    
    layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	//#RedGPU#displacementTexture# layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2) uniform texture2D uDisplacementTexture;
	void main() {
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		//#RedGPU#displacementTexture# vVertexPosition.xyz += calcDisplacement(vNormal, vertexUniforms.displacementFlowSpeedX, vertexUniforms.displacementFlowSpeedY, vertexUniforms.displacementPower, uv, uDisplacementTexture, uSampler);
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        vec4 color;
        float normalPower;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float alpha;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vVertexPosition;
	layout( location = 3 ) in float vMouseColorID;	
	//#RedGPU#normalTexture# layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uNormalSampler;
	//#RedGPU#normalTexture# layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uNormalTexture;
	//#RedGPU#specularTexture# layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uSpecularSampler;
	//#RedGPU#specularTexture# layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uSpecularTexture;
	//#RedGPU#emissiveTexture# layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uEmissiveSampler;
	//#RedGPU#emissiveTexture# layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uEmissiveTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	
	void main() {
		float testAlpha = fragmentUniforms.color.a;
		
		vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		//#RedGPU#normalTexture# normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), vUV) ;
		//#RedGPU#useFlatMode# N = getFlatNormal(vVertexPosition.xyz);
		//#RedGPU#normalTexture# N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb, fragmentUniforms.normalPower) ;
		
		float specularTextureValue = 1.0;
		//#RedGPU#specularTexture# specularTextureValue = texture(sampler2D(uSpecularTexture, uSpecularSampler), vUV).r ;
		
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

		//#RedGPU#emissiveTexture# vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), vUV);
		//#RedGPU#emissiveTexture# finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`;
	static PROGRAM_OPTION_LIST = {
		vertex: ['displacementTexture'],
		fragment: ['emissiveTexture', 'normalTexture', 'specularTexture', 'useFlatMode']
	};
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.VERTEX, type: "sampler"},
			{binding: 2, visibility: GPUShaderStage.VERTEX, type: "sampled-texture"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 4, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 5, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 6, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 7, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 8, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 9, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: TypeSize.float, valueName: 'displacementFlowSpeedX'},
		{size: TypeSize.float, valueName: 'displacementFlowSpeedY'},
		{size: TypeSize.float, valueName: 'displacementPower'}
	];
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float4, valueName: 'colorRGBA'},
		{size: TypeSize.float, valueName: 'normalPower'},
		{size: TypeSize.float, valueName: 'shininess'},
		{size: TypeSize.float, valueName: 'specularPower'},
		{size: TypeSize.float4, valueName: 'specularColorRGBA'},
		{size: TypeSize.float, valueName: 'emissivePower'},
		{size: TypeSize.float, valueName: 'alpha'}
	];
	#raf;
	constructor(redGPUContext, color = '#ff0000', colorAlpha = 1, normalTexture, specularTexture, emissiveTexture, displacementTexture) {
		super(redGPUContext);
		this.color = color;
		this.colorAlpha = colorAlpha;
		this.normalTexture = normalTexture;
		this.specularTexture = specularTexture;
		this.emissiveTexture = emissiveTexture;
		this.displacementTexture = displacementTexture;
		this.needResetBindingInfo = true
	}
	checkTexture(texture, textureName) {
		if (texture) {
			if (texture._GPUTexture) {
				switch (textureName) {
					case 'normalTexture' :
						this._normalTexture = texture;
						break;
					case 'specularTexture' :
						this._specularTexture = texture;
						break;
					case 'emissiveTexture' :
						this._emissiveTexture = texture;
						break;
					case 'displacementTexture' :
						this._displacementTexture = texture;
						break

				}
				if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
				cancelAnimationFrame(this.#raf);
				this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
			} else {
				texture.addUpdateTarget(this, textureName)
			}

		} else {
			if (this['_' + textureName]) {
				this['_' + textureName] = null;
				this.needResetBindingInfo = true
			}
		}
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
				resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 2,
				resource: this._displacementTexture ? this._displacementTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 3,
				resource: {
					buffer: this.uniformBuffer_fragment.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			},
			{
				binding: 4,
				resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 5,
				resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 6,
				resource: this._specularTexture ? this._specularTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 7,
				resource: this._specularTexture ? this._specularTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 8,
				resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 9,
				resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			}
		];
		this._afterResetBindingInfo();
	}
}

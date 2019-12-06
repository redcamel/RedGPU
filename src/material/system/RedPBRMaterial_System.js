/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";
import RedTypeSize from "../../resources/RedTypeSize.js";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";
import RedMaterialPreset from "../RedMaterialPreset.js";

let float1_Float32Array = new Float32Array(1);
export default class RedPBRMaterial_System extends RedMaterialPreset.mix(
	RedBaseMaterial,
	RedMaterialPreset.diffuseTexture,
	RedMaterialPreset.normalTexture,
	RedMaterialPreset.emissiveTexture,
	RedMaterialPreset.environmentTexture,
	RedMaterialPreset.displacementTexture,
	RedMaterialPreset.basicLightPropertys
) {

	static vertexShaderGLSL = `
	#version 450
    ${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${RedShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement}    
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix;
        mat4 normalMatrix;
    } meshUniforms;
         
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec4 vertexColor_0;
	layout( location = 2 ) in vec3 normal;
	layout( location = 3 ) in vec2 uv;
	layout( location = 4 ) in vec2 uv1;
	layout( location = 5 ) in vec4 vertexTangent;
	layout( location = 0 ) out vec4 vVertexColor_0;
	layout( location = 1 ) out vec3 vNormal;
	layout( location = 2 ) out vec2 vUV;
	layout( location = 3 ) out vec2 vUV1;
	layout( location = 4 ) out vec4 vVertexTangent;
	layout( location = 5 ) out vec4 vVertexPosition;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
    } vertexUniforms;
	
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uDisplacementSampler;
	//#RedGPU#displacementTexture# layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		vVertexPosition = meshUniforms.modelMatrix * vec4(position, 1.0);
		vVertexColor_0 = vertexColor_0;
		vNormal = (meshUniforms.normalMatrix * vec4(normal,1.0)).xyz;
		vUV = uv;
		vUV1 = uv1;
		vVertexTangent = vertexTangent;
		//#RedGPU#displacementTexture# vVertexPosition.xyz += calcDisplacement(vNormal, vertexUniforms.displacementFlowSpeedX, vertexUniforms.displacementFlowSpeedY, vertexUniforms.displacementPower, uv, uDisplacementTexture, uDisplacementSampler);
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;		
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${RedShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${RedShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        float normalPower;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float environmentPower;
	    vec4 baseColorFactor;
	    float diffuseTexCoordIndex;
	    float normalTexCoordIndex;
	    float emissiveTexCoordIndex;
	    float roughnessTexCoordIndex;
    } fragmentUniforms;
	layout( location = 0 ) in vec4 vVertexColor_0;
	layout( location = 1 ) in vec3 vNormal;
	layout( location = 2 ) in vec2 vUV;
	layout( location = 3 ) in vec2 vUV1;
	layout( location = 4 ) in vec4 vVertexTangent;
	layout( location = 5 ) in vec4 vVertexPosition;
	//#RedGPU#diffuseTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uDiffuseSampler;
	//#RedGPU#diffuseTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	//#RedGPU#normalTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uNormalSampler;
	//#RedGPU#normalTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uNormalTexture;	
	//#RedGPU#roughnessTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform texture2D uRoughnessTexture;
	//#RedGPU#emissiveTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uEmissiveTexture;
	//#RedGPU#environmentTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEnvironmentSampler;
	//#RedGPU#environmentTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform textureCube uEnvironmentTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	vec2 diffuseTexCoord;
	vec2 normalTexCoord;
	vec2 emissiveTexCoord;
	vec2 roughnessTexCoord;
	void main() {
		diffuseTexCoord = fragmentUniforms.diffuseTexCoordIndex == 0.0 ? vUV : vUV1;
		normalTexCoord = fragmentUniforms.normalTexCoordIndex == 0.0 ? vUV : vUV1;
		emissiveTexCoord = fragmentUniforms.emissiveTexCoordIndex == 0.0 ? vUV : vUV1;
		roughnessTexCoord = fragmentUniforms.roughnessTexCoordIndex == 0.0 ? vUV : vUV1;
		
	
		vec4 diffuseColor = fragmentUniforms.baseColorFactor;
		//#RedGPU#diffuseTexture# diffuseColor *= texture(sampler2D(uDiffuseTexture, uDiffuseSampler), diffuseTexCoord) ;
		//#RedGPU#useVertexColor_0# diffuseColor *= clamp(vVertexColor_0,0.0,1.0) ;
	
		
	    vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		//#RedGPU#normalTexture# normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), normalTexCoord) ;
		//#RedGPU#useFlatMode# N = getFlatNormal(vVertexPosition.xyz);
		//#RedGPU#normalTexture# N = perturb_normal(N, vVertexPosition.xyz, normalTexCoord, normalColor.rgb, fragmentUniforms.normalPower) ;
		
		//#RedGPU#environmentTexture# vec3 R = reflect( vVertexPosition.xyz - systemUniforms.cameraPosition, N);
		//#RedGPU#environmentTexture# vec4 reflectionColor = texture(samplerCube(uEnvironmentTexture,uEnvironmentSampler), R);
		//#RedGPU#environmentTexture# diffuseColor = mix(diffuseColor, reflectionColor, fragmentUniforms.environmentPower);
	
		float specularTextureValue = 1.0;
		//#RedGPU#roughnessTexture# specularTextureValue = texture(sampler2D(uRoughnessTexture, uDiffuseSampler), roughnessTexCoord).r;
		
		vec4 finalColor = 
		calcDirectionalLight(
			diffuseColor,
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
			diffuseColor,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		);
		
		//#RedGPU#emissiveTexture# vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uDiffuseSampler), emissiveTexCoord);
		//#RedGPU#emissiveTexture# finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		
		outColor = finalColor;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
`;
	static PROGRAM_OPTION_LIST = [
		'diffuseTexture', 'displacementTexture', 'emissiveTexture', 'environmentTexture','normalTexture', 'roughnessTexture', 'useFlatMode',
		'useVertexColor_0'
	];
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
			{binding: 8, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 9, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 10, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 11, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture", textureDimension: 'cube'}
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: RedTypeSize.float, valueName: 'displacementFlowSpeedX'},
		{size: RedTypeSize.float, valueName: 'displacementFlowSpeedY'},
		{size: RedTypeSize.float, valueName: 'displacementPower'}
	];
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float, valueName: 'normalPower'},
		{size: RedTypeSize.float, valueName: 'shininess'},
		{size: RedTypeSize.float, valueName: 'specularPower'},
		{size: RedTypeSize.float4, valueName: 'specularColorRGBA'},
		{size: RedTypeSize.float, valueName: 'emissivePower'},
		{size: RedTypeSize.float, valueName: 'environmentPower'},
		{size: RedTypeSize.float4, valueName: 'baseColorFactor'},
		{size: RedTypeSize.float, valueName: 'diffuseTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'normalTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'emissiveTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'roughnessTexCoordIndex'},



	];

	_baseColorFactor = new Float32Array(4);
	_useVertexColor_0 = false;
	_diffuseTexCoordIndex = 0;
	_normalTexCoordIndex = 0;
	_emissiveTexCoordIndex = 0;
	_roughnessTexCoordIndex = 0;
	_roughnessTexture;
	set roughnessTexture(texture) {
		this._roughnessTexture = null;
		this.checkTexture(texture, 'roughnessTexture')
	}

	get roughnessTexture() {
		return this._roughnessTexture
	}
	get roughnessTexCoordIndex() {
		return this._roughnessTexCoordIndex;
	}

	set roughnessTexCoordIndex(value) {
		this._roughnessTexCoordIndex = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessTexCoordIndex'], float1_Float32Array)
	}
	get useVertexColor_0() {
		return this._useVertexColor_0;
	}
	set useVertexColor_0(value) {
		this._useVertexColor_0 = value;
		this.resetBindingInfo()
	}
	get baseColorFactor() {
		return this._baseColorFactor;
	}

	set baseColorFactor(value) {
		this._baseColorFactor = new Float32Array(value);
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['baseColorFactor'], this._baseColorFactor)
	}
	get diffuseTexCoordIndex() {
		return this._diffuseTexCoordIndex;
	}

	set diffuseTexCoordIndex(value) {
		this._diffuseTexCoordIndex = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['diffuseTexCoordIndex'], float1_Float32Array)
	}
	get normalTexCoordIndex() {
		return this._normalTexCoordIndex;
	}

	set normalTexCoordIndex(value) {
		this._normalTexCoordIndex = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalTexCoordIndex'], float1_Float32Array)
	}
	get emissiveTexCoordIndex() {
		return this._emissiveTexCoordIndex;
	}

	set emissiveTexCoordIndex(value) {
		this._emissiveTexCoordIndex = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissiveTexCoordIndex'], float1_Float32Array)
	}
	constructor(redGPU, diffuseTexture, environmentTexture, normalTexture, occlusionTexture, emissiveTexture, roughnessTexture) {

		super(redGPU);
		this.diffuseTexture = diffuseTexture;
		this.environmentTexture = environmentTexture;
		this.normalTexture = normalTexture;
		// this.occlusionTexture = occlusionTexture;
		this.emissiveTexture = emissiveTexture;
		this.roughnessTexture = roughnessTexture;
		this.resetBindingInfo()
	}

	checkTexture(texture, textureName) {
		if (texture) {
			if (texture.GPUTexture) {
				switch (textureName) {
					case 'diffuseTexture' :
						this._diffuseTexture = texture;
						break;
					case 'normalTexture' :
						this._normalTexture = texture;
						break;
					case 'environmentTexture' :
						this._environmentTexture = texture;
						break;
					case 'emissiveTexture' :
						this._emissiveTexture = texture;
						break;
					case 'roughnessTexture' :
						this._roughnessTexture = texture;
						break;
				}
				console.log("로딩완료됨 textureName", textureName, texture.GPUTexture);
				this.resetBindingInfo()
			} else {
				texture.addUpdateTarget(this, textureName)
			}

		} else {
			this.resetBindingInfo()
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
				resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler :  this.sampler.GPUSampler
			},
			{
				binding: 2,
				resource: this._displacementTexture ? this._displacementTexture.GPUTextureView : this.redGPU.state.emptyTextureView
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
				resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.sampler.GPUSampler
			},
			{
				binding: 5,
				resource: this._diffuseTexture ? this._diffuseTexture.GPUTextureView : this.redGPU.state.emptyTextureView
			},
			{
				binding: 6,
				resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.sampler.GPUSampler
			},
			{
				binding: 7,
				resource: this._normalTexture ? this._normalTexture.GPUTextureView : this.redGPU.state.emptyTextureView
			},
			{
				binding: 8,
				resource: this._roughnessTexture ? this._roughnessTexture.GPUTextureView : this.redGPU.state.emptyTextureView
			},
			{
				binding: 9,
				resource: this._emissiveTexture ? this._emissiveTexture.GPUTextureView : this.redGPU.state.emptyTextureView
			},
			{
				binding: 10,
				resource: this._environmentTexture ? this._environmentTexture.sampler.GPUSampler : this.sampler.GPUSampler
			},
			{
				binding: 11,
				resource: this._environmentTexture ? this._environmentTexture.GPUTextureView : this.redGPU.state.emptyCubeTextureView
			}

		];
		this._afterResetBindingInfo();
	}
}
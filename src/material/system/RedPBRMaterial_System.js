/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.10 18:21:15
 *
 */

"use strict";
import RedTypeSize from "../../resources/RedTypeSize.js";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";
import RedMix from "../../base/RedMix.js";

let maxJoint = 128; // TODO - 이거 계산해내야함 나중에
let float1_Float32Array = new Float32Array(1);
export default class RedPBRMaterial_System extends RedMix.mix(
	RedBaseMaterial,
	RedMix.diffuseTexture,
	RedMix.normalTexture,
	RedMix.emissiveTexture,
	RedMix.environmentTexture,
	RedMix.displacementTexture,
	RedMix.basicLightPropertys
) {

	static vertexShaderGLSL = `
	#version 450
    ${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${RedShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement}
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
        mat4 normalMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
    } meshUniforms;
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 1 ) uniform MeshUniformIndex {
        float index;
    } meshUniformsIndex;
         
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec4 vertexColor_0;
	layout( location = 2 ) in vec3 normal;
	layout( location = 3 ) in vec2 uv;
	layout( location = 4 ) in vec2 uv1;
	layout( location = 5 ) in vec4 aVertexWeight;
	layout( location = 6 ) in vec4 aVertexJoint;
	layout( location = 7 ) in vec4 vertexTangent;
	layout( location = 0 ) out vec4 vVertexColor_0;
	layout( location = 1 ) out vec3 vNormal;
	layout( location = 2 ) out vec2 vUV;
	layout( location = 3 ) out vec2 vUV1;
	layout( location = 4 ) out vec4 vVertexTangent;
	layout( location = 5 ) out vec4 vVertexPosition;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
		mat4 jointMatrix[${maxJoint}];
		mat4 inverseBindMatrixForJoint[${maxJoint}];
		mat4 globalTransformOfNodeThatTheMeshIsAttachedTo;
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
    } vertexUniforms;
	
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uDisplacementSampler;
	//#RedGPU#displacementTexture# layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		mat4 targetMatrix = meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] ;
		mat4 skinMat = mat4(1.0,0.0,0.0,0.0, 0.0,1.0,0.0,0.0, 0.0,0.0,1.0,0.0, 0.0,0.0,0.0,1.0);
		//#RedGPU#skin# skinMat =
		//#RedGPU#skin#  aVertexWeight.x * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.x) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.x)]+
		//#RedGPU#skin#  aVertexWeight.y * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.y) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.y)]+
		//#RedGPU#skin#  aVertexWeight.z * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.z) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.z)]+
		//#RedGPU#skin#  aVertexWeight.w * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.w) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.w)];
		
		vVertexPosition = meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * skinMat * vec4(position, 1.0);
		vVertexColor_0 = vertexColor_0;
		
		vNormal = (meshUniforms.normalMatrix[ int(meshUniformsIndex.index) ] *  vec4(normal,1.0)).xyz;
		 vNormal = (meshUniforms.normalMatrix[ int(meshUniformsIndex.index) ]  * skinMat * vec4(normal,0.0)).xyz;		
		
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
	    float emissivePower;
	    float occlusionPower;
	    float environmentPower;
	    vec4 baseColorFactor;
	    float diffuseTexCoordIndex;
	    float normalTexCoordIndex;
	    float emissiveTexCoordIndex;
	    float roughnessTexCoordIndex;
	    float occlusionTexCoordIndex;
	    float metallicFactor;
	    float roughnessFactor;
	    float cutOff;
	    float alphaBlend;
	    
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
	//#RedGPU#roughnessTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uRoughnessSampler;	
	//#RedGPU#roughnessTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uRoughnessTexture;
	//#RedGPU#emissiveTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEmissiveSampler;	
	//#RedGPU#emissiveTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform texture2D uEmissiveTexture;
	//#RedGPU#environmentTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 12 ) uniform sampler uEnvironmentSampler;
	//#RedGPU#environmentTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 13 ) uniform textureCube uEnvironmentTexture;
	//#RedGPU#occlusionTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 14 ) uniform sampler uOcclusionSampler;	
	//#RedGPU#occlusionTexture# layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 15 ) uniform texture2D uOcclusionTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	vec2 diffuseTexCoord;
	vec2 normalTexCoord;
	vec2 emissiveTexCoord;
	vec2 roughnessTexCoord;
	vec2 occlusionTexCoord;
	void main() {
		// 인덱스 찾고
		diffuseTexCoord = fragmentUniforms.diffuseTexCoordIndex == 0.0 ? vUV : vUV1;
		normalTexCoord = fragmentUniforms.normalTexCoordIndex == 0.0 ? vUV : vUV1;
		emissiveTexCoord = fragmentUniforms.emissiveTexCoordIndex == 0.0 ? vUV : vUV1;
		roughnessTexCoord = fragmentUniforms.roughnessTexCoordIndex == 0.0 ? vUV : vUV1;
		occlusionTexCoord = fragmentUniforms.occlusionTexCoordIndex == 0.0 ? vUV : vUV1;
		
		
		float tMetallicPower = fragmentUniforms.metallicFactor;
		float tRoughnessPower = fragmentUniforms.roughnessFactor;
		
		vec4 roughnessColor = vec4(0.0);
		//#RedGPU#roughnessTexture# roughnessColor = texture(sampler2D(uRoughnessTexture, uRoughnessSampler), roughnessTexCoord);
		//#RedGPU#roughnessTexture# tMetallicPower *= roughnessColor.b; // 메탈릭 산출 roughnessColor.b
		//#RedGPU#roughnessTexture# tRoughnessPower *= roughnessColor.g; // 거칠기 산출 roughnessColor.g
		
	
		vec4 diffuseColor = fragmentUniforms.baseColorFactor;
		//#RedGPU#useVertexColor_0# diffuseColor *= clamp(vVertexColor_0,0.0,1.0) ;
		//#RedGPU#diffuseTexture# diffuseColor *= texture(sampler2D(uDiffuseTexture, uDiffuseSampler), diffuseTexCoord) ;
	
		
		float tAlpha = diffuseColor.a;
		//#RedGPU#useCutOff# if(tAlpha <= fragmentUniforms.cutOff) discard;
		
	    vec3 N = normalize(vNormal);
	    //#RedGPU#useMaterialDoubleSide# vec3 fdx = dFdx(vVertexPosition.xyz);
		//#RedGPU#useMaterialDoubleSide# vec3 fdy = dFdy(vVertexPosition.xyz);
		//#RedGPU#useMaterialDoubleSide# vec3 faceNormal = normalize(cross(fdy,fdx));
		bool backFaceYn = false;
		//#RedGPU#useMaterialDoubleSide# if (dot (vNormal, faceNormal) < 0.0) { N = -N; backFaceYn = true; };

		vec4 normalColor = vec4(0.0);
		//#RedGPU#normalTexture# normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), normalTexCoord) ;
		//#RedGPU#useFlatMode# N = getFlatNormal(vVertexPosition.xyz);
		//#RedGPU#normalTexture# N = perturb_normal(N, vVertexPosition.xyz, backFaceYn ?  1.0 - normalTexCoord : normalTexCoord, vec3(normalColor.r, 1.0- normalColor.g, normalColor.b), fragmentUniforms.normalPower) ;

		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# vec3 pos_dx = dFdx(vVertexPosition.xyz);
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# vec3 pos_dy = dFdy(vVertexPosition.xyz);
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# vec3 tex_dx = dFdx(vec3(normalTexCoord, 0.0));
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# vec3 tex_dy = dFdy(vec3(normalTexCoord, 0.0));
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# vec3 ng = normalize(vNormal);
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# t = normalize(t - ng * dot(ng, t));
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# vec3 b = normalize(cross(ng, t));
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# mat3 tbn = mat3(t, b, ng);
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# N = normalize(tbn * ((2.0 * normalColor.rgb - 1.0) * vec3(1.0, 1.0 * vVertexTangent.w,1.0)));
		//#RedGPU#useVertexTangent# //#RedGPU#normalTexture# N = backFaceYn ? -N : N;

		// 환경맵 계산
		//#RedGPU#environmentTexture# vec3 R = reflect( vVertexPosition.xyz - systemUniforms.cameraPosition, N);
		//#RedGPU#environmentTexture# vec4 reflectionColor = texture(samplerCube(uEnvironmentTexture,uEnvironmentSampler), R);		
		// 환경맵 합성
		//#RedGPU#environmentTexture# diffuseColor.rgb = mix( diffuseColor.rgb , reflectionColor.rgb , max(tMetallicPower-tRoughnessPower,0.0)*(1.0-tRoughnessPower));
		//#RedGPU#environmentTexture# diffuseColor = mix( diffuseColor , vec4(0.04, 0.04, 0.04, 1.0) , tRoughnessPower * (tMetallicPower) * 0.5);


	
		outColor = diffuseColor;
		vec4 specularLightColor = vec4(1.0, 1.0, 1.0, 1.0);
	    vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
	    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);

	    vec3 L;	


	    float lambertTerm;
	    float intensity;
	    float specular;

		DirectionalLight lightInfo;
		vec4 lightColor;
		for(int i=0; i<systemUniforms.directionalLightCount; i++){
			lightInfo = systemUniforms.directionalLightList[i];
			vec3 L = normalize(-lightInfo.position);
			float lambertTerm = dot(N,-L);
			if(lambertTerm > 0.0){
				ld += lightInfo.color * diffuseColor * lambertTerm * lightInfo.intensity * lightInfo.color.a;
				specular = pow( max(dot(reflect(L, N), -L), 0.0), pow(fragmentUniforms.shininess, 1.0-tRoughnessPower+0.04) );
				specular *= pow(1.0-tRoughnessPower+0.04, 2.0 * (1.0-tMetallicPower)) ;
				ls +=  specularLightColor * specular * fragmentUniforms.metallicFactor * lightInfo.intensity * lightInfo.color.a * (1.0-tRoughnessPower+0.04);
			}
		}


		 vec4 finalColor = ld+ls;


		// 컷오프 - BLEND, MASK

		// 이미시브 합성
		//#RedGPU#emissiveTexture# vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), emissiveTexCoord);
		//#RedGPU#emissiveTexture# finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;

		// 오클루젼 합성
		//#RedGPU#occlusionTexture# vec4 occlusionColor =texture(sampler2D(uOcclusionTexture, uOcclusionSampler), occlusionTexCoord);
		//#RedGPU#occlusionTexture# finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * occlusionColor.r, occlusionColor.r * fragmentUniforms.occlusionPower);


		// 알파블렌드 - BLEND
		if( fragmentUniforms.alphaBlend == 2.0 ) {
			finalColor.rgb *= tAlpha ;
			finalColor.a = tAlpha;
		}
		outColor = finalColor;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
`;
	static PROGRAM_OPTION_LIST = [
		'diffuseTexture', 'displacementTexture',
		'emissiveTexture', 'environmentTexture', 'normalTexture', 'occlusionTexture', 'roughnessTexture',
		'useCutOff',
		'useFlatMode', 'skin',
		'useMaterialDoubleSide',
		'useVertexTangent',
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
			{binding: 8, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 9, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 10, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 11, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
			{binding: 12, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 13, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture", textureDimension: 'cube'},
			{binding: 14, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 15, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: RedTypeSize.mat4 * maxJoint, valueName: 'jointMatrix'},
		{size: RedTypeSize.mat4 * maxJoint, valueName: 'inverseBindMatrixForJoint'},
		{size: RedTypeSize.mat4, valueName: 'globalTransformOfNodeThatTheMeshIsAttachedTo'},
		{size: RedTypeSize.float, valueName: 'displacementFlowSpeedX'},
		{size: RedTypeSize.float, valueName: 'displacementFlowSpeedY'},
		{size: RedTypeSize.float, valueName: 'displacementPower'}
	];
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float, valueName: 'normalPower'},
		{size: RedTypeSize.float, valueName: 'shininess'},
		{size: RedTypeSize.float, valueName: 'emissivePower'},
		{size: RedTypeSize.float, valueName: 'occlusionPower'},
		{size: RedTypeSize.float, valueName: 'environmentPower'},
		{size: RedTypeSize.float4, valueName: 'baseColorFactor'},
		{size: RedTypeSize.float, valueName: 'diffuseTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'normalTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'emissiveTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'roughnessTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'occlusionTexCoordIndex'},
		{size: RedTypeSize.float, valueName: 'metallicFactor'},
		{size: RedTypeSize.float, valueName: 'roughnessFactor'},
		{size: RedTypeSize.float, valueName: 'cutOff'},
		{size: RedTypeSize.float, valueName: 'alphaBlend'},

	];

	_baseColorFactor = new Float32Array(4);
	_useVertexColor_0 = false;
	_diffuseTexCoordIndex = 0;
	_normalTexCoordIndex = 0;
	_emissiveTexCoordIndex = 0;
	_roughnessTexCoordIndex = 0;
	_occlusionTexCoordIndex = 0;
	_roughnessTexture;
	_occlusionTexture;
	_metallicFactor = 1;
	_roughnessFactor = 1;
	_useMaterialDoubleSide = false;
	_useVertexTangent = false;
	_emissivePower = 1;
	_occlusionPower = 1
	_cutOff = 0.0
	_useCutOff = true;
	_alphaBlend = 0;

	_skin = false;
	jointMatrix = new Float32Array(RedTypeSize.mat4 * maxJoint / Float32Array.BYTES_PER_ELEMENT);
	inverseBindMatrixForJoint = new Float32Array(RedTypeSize.mat4 * maxJoint / Float32Array.BYTES_PER_ELEMENT);
	globalTransformOfNodeThatTheMeshIsAttachedTo = new Float32Array(RedTypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT);


	set occlusionTexture(texture) {
		this._occlusionTexture = null;
		this.checkTexture(texture, 'occlusionTexture')
	}
	get occlusionTexture() {
		return this._occlusionTexture
	}

	set alphaBlend(value) {
		this._alphaBlend = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['alphaBlend'], float1_Float32Array)
	}
	get alphaBlend() {
		return this._alphaBlend;
	}
	set cutOff(value) {
		this._cutOff = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['cutOff'], float1_Float32Array)
	}
	get cutOff() {
		return this._cutOff;
	}
	get useCutOff() {
		return this._useCutOff
	}
	set useCutOff(v) {
		this._useCutOff = v
		this.needResetBindingInfo = true
	}
	get skin() {
		return this._skin
	}
	set skin(v) {
		this._skin = v
		this.needResetBindingInfo = true
	}

	set emissivePower(value) {
		this._emissivePower = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array)
	}
	get emissivePower() {
		return this._emissivePower;
	}
	set occlusionPower(value) {
		this._occlusionPower = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionPower'], float1_Float32Array)
	}
	get occlusionPower() {
		return this._occlusionPower;
	}
	get useMaterialDoubleSide() {
		return this._useMaterialDoubleSide
	}
	set useMaterialDoubleSide(v) {
		this._useMaterialDoubleSide = v
		this.needResetBindingInfo = true
	}
	get useVertexTangent() {
		return this._useVertexTangent
	}
	set useVertexTangent(v) {
		this._useVertexTangent = v
		this.needResetBindingInfo = true
	}
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
	get roughnessFactor() {
		return this._roughnessFactor;
	}
	set roughnessFactor(value) {
		this._roughnessFactor = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessFactor'], float1_Float32Array)
	}
	get occlusionTexCoordIndex() {
		return this._occlusionTexCoordIndex;
	}
	set occlusionTexCoordIndex(value) {
		this._occlusionTexCoordIndex = value;
		float1_Float32Array[0] = value;

		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionTexCoordIndex'], float1_Float32Array)
	}
	get metallicFactor() {
		return this._metallicFactor;
	}
	set metallicFactor(value) {
		this._metallicFactor = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['metallicFactor'], float1_Float32Array)
	}


	get useVertexColor_0() {
		return this._useVertexColor_0;
	}
	set useVertexColor_0(value) {
		this._useVertexColor_0 = value;
		this.needResetBindingInfo = true
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
		this.occlusionTexture = occlusionTexture;
		this.emissiveTexture = emissiveTexture;
		this.roughnessTexture = roughnessTexture;
		this.needResetBindingInfo = true
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
					case 'occlusionTexture' :
						this._occlusionTexture = texture;
						console.log('occlusionTexture', texture)
						break;
				}
				console.log("로딩완료됨 textureName", textureName, texture.GPUTexture);
				this.needResetBindingInfo = true
			} else {
				texture.addUpdateTarget(this, textureName)
			}

		} else {
			this.needResetBindingInfo = true
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
				resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.sampler.GPUSampler
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
				resource: this._roughnessTexture ? this._roughnessTexture.sampler.GPUSampler : this.sampler.GPUSampler
			},
			{
				binding: 9,
				resource: this._roughnessTexture ? this._roughnessTexture.GPUTextureView : this.redGPU.state.emptyTextureView
			},
			{
				binding: 10,
				resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.sampler.GPUSampler
			},
			{
				binding: 11,
				resource: this._emissiveTexture ? this._emissiveTexture.GPUTextureView : this.redGPU.state.emptyTextureView
			},
			{
				binding: 12,
				resource: this._environmentTexture ? this._environmentTexture.sampler.GPUSampler : this.sampler.GPUSampler
			},
			{
				binding: 13,
				resource: this._environmentTexture ? this._environmentTexture.GPUTextureView : this.redGPU.state.emptyCubeTextureView
			},
			{
				binding: 14,
				resource: this._occlusionTexture ? this._occlusionTexture.sampler.GPUSampler : this.sampler.GPUSampler
			},
			{
				binding: 15,
				resource: this._occlusionTexture ? this._occlusionTexture.GPUTextureView : this.redGPU.state.emptyTextureView
			}


		];
		this._afterResetBindingInfo();
	}
}
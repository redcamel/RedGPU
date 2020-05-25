/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */

"use strict";
import TypeSize from "../../resources/TypeSize.js";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import Mix from "../../base/Mix.js";
import RedGPUContext from "../../RedGPUContext.js";

let maxJoint = 128; // TODO - 이거 계산해내야함 나중에
let float1_Float32Array = new Float32Array(1);
export default class PBRMaterial_System extends Mix.mix(
	BaseMaterial,
	Mix.diffuseTexture,
	Mix.normalTexture,
	Mix.emissiveTexture,
	Mix.environmentTexture,
	Mix.displacementTexture,
	Mix.roughnessTextureGLTF,
	Mix.occlusionTextureGLTF,
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
	layout( location = 3 ) in vec2 uv1;
	layout( location = 4 ) in vec4 vertexColor_0;
	layout( location = 5 ) in vec4 aVertexWeight;
	layout( location = 6 ) in vec4 aVertexJoint;
	layout( location = 7 ) in vec4 vertexTangent;
	layout( location = 0 ) out vec4 vVertexColor_0;
	layout( location = 1 ) out vec3 vNormal;
	layout( location = 2 ) out vec2 vUV;
	layout( location = 3 ) out vec2 vUV1;
	layout( location = 4 ) out vec4 vVertexTangent;
	layout( location = 5 ) out vec4 vVertexPosition;
	layout( location = 6 ) out float vMouseColorID;	
	layout( location = 7 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
		mat4 jointMatrix[${maxJoint}];
		mat4 inverseBindMatrixForJoint[${maxJoint}];
		mat4 globalTransformOfNodeThatTheMeshIsAttachedTo;
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
        float __displacementTextureRenderYn;
        float useSkin;
        
    } vertexUniforms;
	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uDisplacementSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		mat4 targetMatrix = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] ;
		mat4 skinMat = mat4(1.0,0.0,0.0,0.0, 0.0,1.0,0.0,0.0, 0.0,0.0,1.0,0.0, 0.0,0.0,0.0,1.0);
		if(vertexUniforms.useSkin == TRUTHY) {
			skinMat =
			aVertexWeight.x * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.x) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.x)]+
			aVertexWeight.y * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.y) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.y)]+
			aVertexWeight.z * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.z) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.z)]+
			aVertexWeight.w * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.w) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.w)];
			vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * skinMat * vec4(position, 1.0);
			vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ]  * skinMat * vec4(normal,0.0)).xyz;
		}else{
			vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position, 1.0);
			vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] *  vec4(normal,1.0)).xyz;
		}
		
		vVertexColor_0 = vertexColor_0;
		
		vUV = uv;
		vUV1 = uv1;
		vVertexTangent = vertexTangent;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		if(vertexUniforms.__displacementTextureRenderYn == TRUTHY) vVertexPosition.xyz += calcDisplacement(vNormal, vertexUniforms.displacementFlowSpeedX, vertexUniforms.displacementFlowSpeedY, vertexUniforms.displacementPower, uv, uDisplacementTexture, uDisplacementSampler);
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;		
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
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
	    //
	    float useFlatMode;
	    float useCutOff;
	    float useVertexTangent;
	    float useVertexColor_0;
	    float useMaterialDoubleSide;
	    //
	    float __diffuseTextureRenderYn;
		float __environmentTextureRenderYn;
		float __normalTextureRenderYn;
		float __occlusionTextureRenderYn;
		float __emissiveTextureRenderYn;
		float __roughnessTextureRenderYn;
	    
    } fragmentUniforms;
	layout( location = 0 ) in vec4 vVertexColor_0;
	layout( location = 1 ) in vec3 vNormal;
	layout( location = 2 ) in vec2 vUV;
	layout( location = 3 ) in vec2 vUV1;
	layout( location = 4 ) in vec4 vVertexTangent;
	layout( location = 5 ) in vec4 vVertexPosition;
	layout( location = 6 ) in float vMouseColorID;	
	layout( location = 7 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uDiffuseSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uNormalSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uNormalTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uRoughnessSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uRoughnessTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEmissiveSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform texture2D uEmissiveTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 12 ) uniform sampler uEnvironmentSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 13 ) uniform textureCube uEnvironmentTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 14 ) uniform sampler uOcclusionSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 15 ) uniform texture2D uOcclusionTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
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
		if(fragmentUniforms.__roughnessTextureRenderYn == TRUTHY) {
			roughnessColor = texture(sampler2D(uRoughnessTexture, uRoughnessSampler), roughnessTexCoord);
			tMetallicPower *= roughnessColor.b; // 메탈릭 산출 roughnessColor.b
			tRoughnessPower *= roughnessColor.g; // 거칠기 산출 roughnessColor.g
		}
		
		
	
		vec4 diffuseColor = fragmentUniforms.baseColorFactor;
		if(fragmentUniforms.useVertexColor_0 == TRUTHY) diffuseColor *= clamp(vVertexColor_0,0.0,1.0) ;
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor *= texture(sampler2D(uDiffuseTexture, uDiffuseSampler), diffuseTexCoord) ;
			
		float tAlpha = diffuseColor.a;
		if(fragmentUniforms.useCutOff == TRUTHY) {
			if(tAlpha <= fragmentUniforms.cutOff) discard;
		}
		
	    vec3 N = normalize(vNormal);
	    bool backFaceYn = false;
	    if(fragmentUniforms.useMaterialDoubleSide == TRUTHY) {
		    vec3 fdx = dFdx(vVertexPosition.xyz);
			vec3 fdy = dFdy(vVertexPosition.xyz);
			vec3 faceNormal = normalize(cross(fdy,fdx));
			if (dot (vNormal, faceNormal) < 0.0) { N = -N; backFaceYn = true; };
	    } 
		vec4 normalColor = vec4(0.0);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), normalTexCoord) ;
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) N = perturb_normal(N, vVertexPosition.xyz, backFaceYn ?  1.0 - normalTexCoord : normalTexCoord, vec3(normalColor.r, 1.0- normalColor.g, normalColor.b), fragmentUniforms.normalPower) ;

		if(fragmentUniforms.useVertexTangent == TRUTHY) {
			if(fragmentUniforms.__normalTextureRenderYn == TRUTHY){
				vec3 pos_dx = dFdx(vVertexPosition.xyz);
				vec3 pos_dy = dFdy(vVertexPosition.xyz);
				vec3 tex_dx = dFdx(vec3(normalTexCoord, 0.0));
				vec3 tex_dy = dFdy(vec3(normalTexCoord, 0.0));
				vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);
				vec3 ng = normalize(vNormal);
				t = normalize(t - ng * dot(ng, t));
				vec3 b = normalize(cross(ng, t));
				mat3 tbn = mat3(t, b, ng);
				N = normalize(tbn * ((2.0 * normalColor.rgb - 1.0) * vec3(1.0, 1.0 * vVertexTangent.w,1.0)));
				N = backFaceYn ? -N : N;
			}			
		}

		if(fragmentUniforms.__environmentTextureRenderYn == TRUTHY) {
			// 환경맵 계산
			vec3 R = reflect( vVertexPosition.xyz - systemUniforms.cameraPosition, N);
			vec4 reflectionColor = texture(samplerCube(uEnvironmentTexture,uEnvironmentSampler), R);		
			// 환경맵 합성
			diffuseColor.rgb = mix( diffuseColor.rgb , reflectionColor.rgb , max(tMetallicPower-tRoughnessPower,0.0)*(1.0-tRoughnessPower));
			diffuseColor = mix( diffuseColor , vec4(0.04, 0.04, 0.04, 1.0) , tRoughnessPower * (tMetallicPower) * 0.5);
		}
		


	
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
		
		 vec4 finalColor = ld + ls + la;;
		
		if(fragmentUniforms.__emissiveTextureRenderYn == TRUTHY) {
			// 이미시브 합성
			vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), emissiveTexCoord);
			finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		}		
	
		if(fragmentUniforms.__occlusionTextureRenderYn == TRUTHY) {
		// 오클루젼 합성
			vec4 occlusionColor =texture(sampler2D(uOcclusionTexture, uOcclusionSampler), occlusionTexCoord);
			finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * occlusionColor.r, occlusionColor.r * fragmentUniforms.occlusionPower);
		}


		// 알파블렌드 - BLEND
		if( fragmentUniforms.alphaBlend == 2.0 ) {		
			finalColor.a = tAlpha;
		}
		outColor = finalColor;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`;
	static PROGRAM_OPTION_LIST = {
		vertex: [],
		fragment: []
		// vertex: ['displacementTexture', 'skin'],
		// fragment: [
		// 	'diffuseTexture', 'emissiveTexture', 'environmentTexture', 'normalTexture', 'occlusionTexture', 'roughnessTexture',
		// 	'useCutOff',
		// 	'useFlatMode', ,
		// 	'useMaterialDoubleSide',
		// 	'useVertexTangent',
		// 	'useVertexColor_0'
		// ]
	};
	static uniformsBindGroupLayoutDescriptor_material = {
		entries: [
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
			{binding: 13, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture", viewDimension: 'cube'},
			{binding: 14, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 15, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"},
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: TypeSize.mat4 * maxJoint, valueName: 'jointMatrix'},
		{size: TypeSize.mat4 * maxJoint, valueName: 'inverseBindMatrixForJoint'},
		{size: TypeSize.mat4, valueName: 'globalTransformOfNodeThatTheMeshIsAttachedTo'},
		{size: TypeSize.float, valueName: 'displacementFlowSpeedX'},
		{size: TypeSize.float, valueName: 'displacementFlowSpeedY'},
		{size: TypeSize.float, valueName: 'displacementPower'},
		{size: TypeSize.float, valueName: '__displacementTextureRenderYn'},
		{size: TypeSize.float, valueName: 'useSkin'},


	];
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'normalPower'},
		{size: TypeSize.float, valueName: 'shininess'},
		{size: TypeSize.float, valueName: 'emissivePower'},
		{size: TypeSize.float, valueName: 'occlusionPower'},
		{size: TypeSize.float, valueName: 'environmentPower'},
		{size: TypeSize.float4, valueName: 'baseColorFactor'},
		{size: TypeSize.float, valueName: 'diffuseTexCoordIndex'},
		{size: TypeSize.float, valueName: 'normalTexCoordIndex'},
		{size: TypeSize.float, valueName: 'emissiveTexCoordIndex'},
		{size: TypeSize.float, valueName: 'roughnessTexCoordIndex'},
		{size: TypeSize.float, valueName: 'occlusionTexCoordIndex'},
		{size: TypeSize.float, valueName: 'metallicFactor'},
		{size: TypeSize.float, valueName: 'roughnessFactor'},
		{size: TypeSize.float, valueName: 'cutOff'},
		{size: TypeSize.float, valueName: 'alphaBlend'},
		//
		{size: TypeSize.float, valueName: 'useFlatMode'},
		{size: TypeSize.float, valueName: 'useCutOff'},
		{size: TypeSize.float, valueName: 'useVertexTangent'},
		{size: TypeSize.float, valueName: 'useVertexColor_0'},
		{size: TypeSize.float, valueName: 'useMaterialDoubleSide'},

		//
		{size: TypeSize.float, valueName: '__diffuseTextureRenderYn'},
		{size: TypeSize.float, valueName: '__environmentTextureRenderYn'},
		{size: TypeSize.float, valueName: '__normalTextureRenderYn'},
		{size: TypeSize.float, valueName: '__occlusionTextureRenderYn'},
		{size: TypeSize.float, valueName: '__emissiveTextureRenderYn'},
		{size: TypeSize.float, valueName: '__roughnessTextureRenderYn'}
	];

	_baseColorFactor = new Float32Array(4);
	_useVertexColor_0 = false;
	_diffuseTexCoordIndex = 0;
	_normalTexCoordIndex = 0;
	_emissiveTexCoordIndex = 0;
	_metallicFactor = 1;
	_useMaterialDoubleSide = false;
	_useVertexTangent = false;
	_emissivePower = 1;
	_cutOff = 0.0;
	_useCutOff = true;
	_alphaBlend = 0;

	_useSkin = false;
	jointMatrix = new Float32Array(TypeSize.mat4 * maxJoint / Float32Array.BYTES_PER_ELEMENT);
	inverseBindMatrixForJoint = new Float32Array(TypeSize.mat4 * maxJoint / Float32Array.BYTES_PER_ELEMENT);
	globalTransformOfNodeThatTheMeshIsAttachedTo = new Float32Array(TypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT);
	#raf;

	set alphaBlend(value) {
		this._alphaBlend = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['alphaBlend'], float1_Float32Array)
	}
	get alphaBlend() {return this._alphaBlend;}
	set cutOff(value) {
		this._cutOff = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['cutOff'], float1_Float32Array)
	}
	get cutOff() {return this._cutOff;}
	get useCutOff() {return this._useCutOff}
	set useCutOff(v) {
		this._useCutOff = v;
		float1_Float32Array[0] = v ? 1 : 0;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useCutOff'], float1_Float32Array)
	}
	get useSkin() {return this._useSkin}
	set useSkin(v) {
		this._useSkin = v;
		float1_Float32Array[0] = v ? 1 : 0;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['useSkin'], float1_Float32Array)
	}
	set emissivePower(value) {
		this._emissivePower = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array)
	}
	get emissivePower() {return this._emissivePower;}

	get useMaterialDoubleSide() {return this._useMaterialDoubleSide}
	set useMaterialDoubleSide(v) {
		this._useMaterialDoubleSide = v;
		float1_Float32Array[0] =  v ? 1 : 0;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useMaterialDoubleSide'], float1_Float32Array)
	}
	get useVertexTangent() {return this._useVertexTangent}
	set useVertexTangent(v) {
		this._useVertexTangent = v;
		float1_Float32Array[0] = v;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useVertexTangent'], float1_Float32Array)
	}

	get metallicFactor() {return this._metallicFactor;}
	set metallicFactor(value) {
		this._metallicFactor = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['metallicFactor'], float1_Float32Array)
	}
	get useVertexColor_0() {return this._useVertexColor_0;}
	set useVertexColor_0(value) {
		this._useVertexColor_0 = value;
		float1_Float32Array[0] = value ? 1 : 0;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useVertexColor_0'], float1_Float32Array)
	}
	get baseColorFactor() {return this._baseColorFactor;}
	set baseColorFactor(value) {
		this._baseColorFactor = new Float32Array(value);
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['baseColorFactor'], this._baseColorFactor)
	}
	get diffuseTexCoordIndex() {return this._diffuseTexCoordIndex;}
	set diffuseTexCoordIndex(value) {
		this._diffuseTexCoordIndex = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['diffuseTexCoordIndex'], float1_Float32Array)
	}
	get normalTexCoordIndex() {return this._normalTexCoordIndex;}
	set normalTexCoordIndex(value) {
		this._normalTexCoordIndex = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalTexCoordIndex'], float1_Float32Array)
	}
	get emissiveTexCoordIndex() {return this._emissiveTexCoordIndex;}
	set emissiveTexCoordIndex(value) {
		this._emissiveTexCoordIndex = value;
		float1_Float32Array[0] = value;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissiveTexCoordIndex'], float1_Float32Array)
	}
	constructor(redGPUContext, diffuseTexture, environmentTexture, normalTexture, occlusionTexture, emissiveTexture, roughnessTexture) {

		super(redGPUContext);
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
			if (texture._GPUTexture) {
				let tKey;
				switch (textureName) {
					case 'diffuseTexture' :
						this._diffuseTexture = texture;
						tKey = textureName;
						break;
					case 'normalTexture' :
						this._normalTexture = texture;
						tKey = textureName;
						break;
					case 'environmentTexture' :
						this._environmentTexture = texture;
						tKey = textureName;
						break;
					case 'emissiveTexture' :
						this._emissiveTexture = texture;
						tKey = textureName;
						break;
					case 'roughnessTexture' :
						this._roughnessTexture = texture;
						tKey = textureName;
						break;
					case 'occlusionTexture' :
						this._occlusionTexture = texture;
						tKey = textureName;
						break;
				}
				if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
				if (tKey) {
					float1_Float32Array[0] = this[`__${textureName}RenderYn`] = 1;
					if (tKey == 'displacementTexture') this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
					else this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
				}
				// cancelAnimationFrame(this.#raf);
				// this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
				this.needResetBindingInfo = true

			} else {
				texture.addUpdateTarget(this, textureName)
			}

		} else {
			if (this['_' + textureName]) {
				this['_' + textureName] = null;
				float1_Float32Array[0] = this[`__${textureName}RenderYn`] = 0;
				if (textureName == 'displacementTexture') this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
				else this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
				this.needResetBindingInfo = true;
				this.needResetBindingInfo = true
			}
		}
	}

	resetBindingInfo() {
		this.entries = [
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
				resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 5,
				resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 6,
				resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 7,
				resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 8,
				resource: this._roughnessTexture ? this._roughnessTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 9,
				resource: this._roughnessTexture ? this._roughnessTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 10,
				resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 11,
				resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			},
			{
				binding: 12,
				resource: this._environmentTexture ? this._environmentTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 13,
				resource: this._environmentTexture ? this._environmentTexture._GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
			},
			{
				binding: 14,
				resource: this._occlusionTexture ? this._occlusionTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 15,
				resource: this._occlusionTexture ? this._occlusionTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			}


		];
		this._afterResetBindingInfo();
	}
}
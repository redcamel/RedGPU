"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedUUID from "../base/RedUUID.js";
import RedShareGLSL from "../base/RedShareGLSL.js";

export default class RedStandardMaterial extends RedBaseMaterial {

	static vertexShaderGLSL = `
	#version 450
    ${RedShareGLSL.GLSL_SystemUniforms_vertex}
    layout(set = 2,binding = 0) uniform Uniforms {
        mat4 modelMTX;
        mat4 normalMTX;
    } uniforms;
     
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec3 normal;
	layout(location = 2) in vec2 uv;
	layout(location = 0) out vec3 vNormal;
	layout(location = 1) out vec2 vUV;
	layout(location = 2) out vec4 vVertexPosition;	
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * uniforms.modelMTX* vec4(position,1.0);
		vVertexPosition = uniforms.modelMTX * vec4(position, 1.0);
		vNormal = (uniforms.normalMTX * vec4(normal,1.0)).xyz;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniformsWithLight}
	layout(set=2,binding = 1) uniform Uniforms {
        float shininess; float specularPower;
	    vec4 specularColor;
    } uniforms;
	layout(location = 0) in vec3 vNormal;
	layout(location = 1) in vec2 vUV;
	layout(location = 2) in vec4 vVertexPosition;
	layout(set = 2, binding = 2) uniform sampler uSampler;
	layout(set = 2, binding = 3) uniform texture2D uDiffuseTexture;
	layout(set = 2, binding = 4) uniform texture2D uNormalTexture;
	layout(location = 0) out vec4 outColor;
	
	mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv)
	{
	   vec3 dp1 = dFdx( p );
	   vec3 dp2 = dFdy( p );
	   vec2 duv1 = dFdx( uv );
	   vec2 duv2 = dFdy( uv );
	   
	   vec3 dp2perp = cross( dp2, N );
	   vec3 dp1perp = cross( N, dp1 );
	   vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
	   vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;
	   
	   float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
	   return mat3( T * invmax, B * invmax, N );
	}
	
	vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord, vec3 normalColor )
   {	   
	   vec3 map = normalColor;
	   map =  map * 255./127. - 128./127.;
	   // map.xy *= u_normalPower;
	   map.xy *= 1.0;
	   mat3 TBN = cotangent_frame(N, V, texcoord);
	   return normalize(TBN * map);
	}
	
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#diffuseTexture# diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		
		vec4 normalColor = vec4(0.0);
		//#RedGPU#normalTexture# normalColor = texture(sampler2D(uNormalTexture, uSampler), vUV) ;
	    
	    vec3 N = normalize(vNormal);
		//#RedGPU#normalTexture# N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb) ;

		vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		vec4 la = vec4(0.0, 0.0, 0.0, 0.2);
		vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);
		
		vec4 calcColor = calcDirectionalLight(
			diffuseColor,
			N,
			ld,
			ls,
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLight,
			uniforms.shininess,
			uniforms.specularPower,
			uniforms.specularColor
		);
		    
	
	    vec4 finalColor = la + calcColor;
		
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = ['diffuseTexture', 'normalTexture'];
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
			},
			{
				binding: 2,
				visibility: GPUShaderStage.FRAGMENT,
				type: "sampler"
			},
			{
				binding: 3,
				visibility: GPUShaderStage.FRAGMENT,
				type: "sampled-texture"
			},
			{
				binding: 4,
				visibility: GPUShaderStage.FRAGMENT,
				type: "sampled-texture"
			}
		]
	};
	static uniformBufferDescriptor_vertex = {
		size: RedTypeSize.mat4 * 2,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'matrix'},
			{offset: RedTypeSize.mat4, valueName: 'normalMatrix'}
		]
	};
	static uniformBufferDescriptor_fragment = {
		size: RedTypeSize.float4 * 2,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'shininess', targetKey: 'material'},
			{offset: RedTypeSize.float, valueName: 'specularPower', targetKey: 'material'},
			{
				offset: RedTypeSize.float4,
				valueName: 'specularColor',
				targetKey: 'material'
			},
		]
	};

	#diffuseTexture;
	#normalTexture;

	#shininess = new Float32Array([32]);
	#specularPower = new Float32Array([1]);
	#specularColor = new Float32Array([1, 1, 1, 1])

	constructor(redGPU, diffuseTexture, normalTexture) {
		super(redGPU);
		console.log(diffuseTexture, normalTexture);
		this.diffuseTexture = diffuseTexture;
		this.normalTexture = normalTexture
	}

	checkTexture(texture, textureName) {
		this.bindings = null;
		if (texture) {
			if (texture.GPUTexture) {
				switch (textureName) {
					case 'diffuseTexture' :
						this.#diffuseTexture = texture;
						break;
					case 'normalTexture' :
						this.#normalTexture = texture;
						break
				}
				console.log(textureName, texture.GPUTexture);
				this.resetBindingInfo()
			} else {
				texture.addUpdateTarget(this, textureName)
			}

		} else {
			this.resetBindingInfo()
		}
	}

	set diffuseTexture(texture) {
		this.#diffuseTexture = null;
		this.checkTexture(texture, 'diffuseTexture')
	}

	get diffuseTexture() {
		return this.#diffuseTexture
	}

	set normalTexture(texture) {
		this.#normalTexture = null;
		this.checkTexture(texture, 'normalTexture')
	}

	get normalTexture() {
		return this.#normalTexture
	}

	get specularColor() {
		return this.#specularColor;
	}

	set specularColor(value) {
		this.#specularColor = value;
	}

	get specularPower() {
		return this.#specularPower;
	}

	set specularPower(value) {
		this.#specularPower = value;
	}

	get shininess() {
		return this.#shininess;
	}

	set shininess(value) {
		this.#shininess = value;
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
			},
			{
				binding: 2,
				resource: this.sampler.GPUSampler,
			},
			{
				binding: 3,
				resource: this.#diffuseTexture ? this.#diffuseTexture.GPUTextureView : this.redGPU.state.emptyTextureView,
			},
			{
				binding: 4,
				resource: this.#normalTexture ? this.#normalTexture.GPUTextureView : this.redGPU.state.emptyTextureView,
			}
		];
		this.setUniformBindGroupDescriptor()
		this._UUID = RedUUID.makeUUID()
	}
}
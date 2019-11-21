"use strict";
import RedBitmapTexture from '../resources/RedBitmapTexture.js'
import RedTypeSize from "../resources/RedTypeSize.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";

const vertexShaderGLSL = `
	#version 450
    ${RedBaseMaterial.GLSL_SystemUniforms}
    layout(set=1,binding = 0) uniform Uniforms {
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
const fragmentShaderGLSL = `
	#version 450
	layout(location = 0) in vec3 vNormal;
	layout(location = 1) in vec2 vUV;
	layout(location = 2) in vec4 vVertexPosition;
	layout(set = 1, binding = 1) uniform sampler uSampler;
	layout(set = 1, binding = 2) uniform texture2D uDiffuseTexture;
	layout(set = 1, binding = 3) uniform texture2D uNormalTexture;
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
		vec4 specularLightColor = vec4(1.0);
		vec3 lightPosition = vec3( 5, 5, 5);
	    vec3 L = normalize(-lightPosition);	
	    vec4 lightColor = vec4(1.0);
	    float lambertTerm = dot(N,-L);
	    float intensity = 1.0;
	    float shininess = 16.0;
	    float specular;
	    float specularPower = 1.0;
	    if(lambertTerm > 0.0){
			ld += lightColor * diffuseColor * lambertTerm * intensity;
			specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower ;
			ls +=  specularLightColor * specular * intensity ;
	    }
	    
	    vec3 lightPosition2= vec3( -5, -5, -5);
	    L = normalize(-lightPosition2);	
	    vec4 lightColor2 = vec4(1.0,0.0,0.0,0.5);
	    lambertTerm = dot(N,-L);
	    if(lambertTerm > 0.0){
			ld += lightColor2 * diffuseColor * lambertTerm * intensity;
			specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower ;
			ls +=  specularLightColor * specular * intensity ;
	    }
	    vec4 finalColor = la+ld+ls;
		
		outColor = finalColor;
	}
`;

export default class RedStandardMaterial extends RedBaseMaterial {
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
				type: "sampler"
			},
			{
				binding: 2,
				visibility: GPUShaderStage.FRAGMENT,
				type: "sampled-texture"
			},
			{
				binding: 3,
				visibility: GPUShaderStage.FRAGMENT,
				type: "sampled-texture"
			}
		]
	};
	static uniformBufferDescriptor = {
		size: RedTypeSize.mat4 * 2,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'matrix'},
			{offset: RedTypeSize.mat4, valueName: 'normalMatrix'}
		]
	}
	#redGPU;
	#diffuseTexture;
	#normalTexture;

	constructor(redGPU, diffuseTexture, normalTexture) {
		super(redGPU, RedStandardMaterial, vertexShaderGLSL, fragmentShaderGLSL);
		this.#redGPU = redGPU;

		console.log(diffuseTexture, normalTexture)
		this.diffuseTexture = diffuseTexture;
		this.normalTexture = normalTexture
	}

	checkTexture(texture, textureName) {
		this.bindings = null
		if (texture) {
			if(texture.GPUTexture){
				switch (textureName) {
					case 'diffuseTexture' :
						this.#diffuseTexture = texture
						break
					case 'normalTexture' :
						this.#normalTexture = texture
						break
				}
				console.log(textureName, texture.GPUTexture);
				this.resetBindingInfo()
			}else{
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

	resetBindingInfo() {
		this.bindings = null
		this.searchModules();
		this.bindings = [
			{
				binding: 0,
				resource: {
					buffer: null,
					offset: 0,
					size: this.uniformBufferDescriptor.size
				}
			},
			{
				binding: 1,
				resource: this.sampler.GPUSampler,
			},
			{
				binding: 2,
				resource: this.#diffuseTexture ? this.#diffuseTexture.GPUTextureView : this.#redGPU.state.emptyTextureView,
			},
			{
				binding: 3,
				resource: this.#normalTexture ? this.#normalTexture.GPUTextureView : this.#redGPU.state.emptyTextureView,
			}
		];
		this.setUniformBindGroupDescriptor()
	}
}
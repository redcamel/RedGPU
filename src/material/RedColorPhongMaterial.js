"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedColorMaterial from "./RedColorMaterial.js";
import RedUUID from "../base/RedUUID.js";

export default class RedColorPhongMaterial extends RedColorMaterial {
	static vertexShaderGLSL = `
	#version 450
	${RedBaseMaterial.GLSL_SystemUniforms_vertex}
    layout(set=2,binding = 0) uniform Uniforms {
        mat4 modelMatrix;
        mat4 normalMTX;
    } uniforms;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec3 normal;
	layout(location = 2) in vec2 uv;
	layout(location = 0) out vec3 vNormal;
	layout(location = 1) out vec2 vUV;
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * uniforms.modelMatrix* vec4(position,1.0);
		vNormal = (uniforms.normalMTX * vec4(normal,1.0)).xyz;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	${RedBaseMaterial.GLSL_SystemUniforms_fragment}
	 layout(set=2,binding = 1) uniform Uniforms {
        vec4 color;
    } uniforms;
	layout(location = 0) in vec3 vNormal;
	layout(location = 1) in vec2 vUV;
	layout(location = 0) out vec4 outColor;
	void main() {
		vec3 N = normalize(vNormal);
		vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		vec4 la = vec4(0.0, 0.0, 0.0, 0.2);
		vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);
		vec4 specularLightColor =vec4(1.0);
		vec3 lightPosition = systemUniforms.directionalLightPosition;
	    vec3 L = normalize(-lightPosition);	
	    vec4 lightColor = systemUniforms.directionalLightColor;
	    float lambertTerm = dot(N,-L);
	    float intensity = 1.0;
	    float shininess = 16.0;
	    float specular;
	    float specularPower = 1.0;
	    if(lambertTerm > 0.0){
			ld += lightColor * uniforms.color * lambertTerm * intensity;
			specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower ;
			ls +=  specularLightColor * specular * intensity ;
	    }
	    
	
	    vec4 finalColor = la+ld+ls;
		
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
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
		size: RedTypeSize.float4,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'colorRGBA', targetKey: 'material'},
		]
	};


	constructor(redGPU, color = '#ff0000', alpha = 1) {
		super(redGPU, color, alpha);
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
			}
		];
		this.setUniformBindGroupDescriptor();
		this._UUID = RedUUID.makeUUID()
	}
}

"use strict";
import RedTypeSize from "../resources/RedTypeSize.js";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedUUID from "../base/RedUUID.js";
import RedShareGLSL from "../base/RedShareGLSL.js";

export default class RedBitmapMaterial extends RedBaseMaterial {
	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex}
    layout(set=2,binding = 0) uniform Uniforms {
        mat4 modelMatrix;
    } uniforms;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec3 normal;
	layout(location = 2) in vec2 uv;
	layout(location = 0) out vec3 vNormal;
	layout(location = 1) out vec2 vUV;
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * uniforms.modelMatrix * vec4(position,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	layout(location = 0) in vec3 vNormal;
	layout(location = 1) in vec2 vUV;
	layout(set = 2, binding = 1) uniform sampler uSampler;
	layout(set = 2, binding = 2) uniform texture2D uDiffuseTexture;
	layout(location = 0) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#diffuseTexture# diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
	}
`;
	static PROGRAM_OPTION_LIST = ['diffuseTexture'];
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
		]
	};
	static uniformBufferDescriptor_vertex = {
		size: RedTypeSize.mat4,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		redStruct: [
			{offset: 0, valueName: 'matrix'}
		]
	};
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty

	#diffuseTexture;

	constructor(redGPU, diffuseTexture) {
		super(redGPU);
		this.diffuseTexture = diffuseTexture
	}

	checkTexture(texture, textureName) {
		this.bindings = null;
		if (texture) {
			if (texture.GPUTexture) {
				switch (textureName) {
					case 'diffuseTexture' :
						this.#diffuseTexture = texture;
						break
				}
				console.log(textureName, texture);
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
		this.checkTexture(texture, 'diffuseTexture');
	}

	get diffuseTexture() {
		return this.#diffuseTexture
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
				resource: this.sampler.GPUSampler,
			},
			{
				binding: 2,
				resource: this.#diffuseTexture ? this.#diffuseTexture.GPUTextureView : this.redGPU.state.emptyTextureView,
			}
		];
		this.setUniformBindGroupDescriptor();
		this._UUID = RedUUID.makeUUID()
		console.log(this.#diffuseTexture);
	}
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.30 16:32:22
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";
import RedMaterialPreset from "./../RedMaterialPreset.js";

export default class RedSkyBoxMaterial extends RedMaterialPreset.mix(
	RedBaseMaterial
) {
	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix;
    } meshUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 0 ) out vec3 vReflectionCubeCoord;
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshUniforms.modelMatrix * vec4(position,1.0);
		vReflectionCubeCoord = (meshUniforms.modelMatrix *vec4(position, 0.0)).xyz;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	layout( location = 0 ) in vec3 vReflectionCubeCoord;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2) uniform textureCube uSkyBoxTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#skyBoxTexture# diffuseColor = texture(samplerCube(uSkyBoxTexture,uSampler), vReflectionCubeCoord) ;
		outColor = diffuseColor;
	}
`;
	static PROGRAM_OPTION_LIST = ['skyBoxTexture'];
	static uniformsBindGroupLayoutDescriptor_material= {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture", textureDimension: 'cube'}
		]
	};
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;

	_skyBoxTexture;
	set skyBoxTexture(texture) {
		this._skyBoxTexture = null;
		this.checkTexture(texture, 'skyBoxTexture');
	}
	get skyBoxTexture() {
		return this._skyBoxTexture
	}
	constructor(redGPU, skyBoxTexture) {
		super(redGPU);
		this.skyBoxTexture = skyBoxTexture;
		this.resetBindingInfo();
		this.updateUniformBuffer()
	}

	checkTexture(texture, textureName) {
		if (texture) {
			if (texture.GPUTexture) {
				switch (textureName) {
					case 'skyBoxTexture' :
						this._skyBoxTexture = texture;
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
			{binding: 1, resource: this.sampler.GPUSampler},
			{
				binding: 2,
				resource: this._skyBoxTexture ? this._skyBoxTexture.GPUTextureView : this.redGPU.state.emptyCubeTextureView
			}
		];
		this._afterResetBindingInfo();
	}
}
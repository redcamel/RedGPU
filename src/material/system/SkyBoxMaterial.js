/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 14:24:48
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import Mix from "../../base/Mix.js";
import RedGPUContext from "../../RedGPUContext.js";

export default class SkyBoxMaterial extends Mix.mix(
	BaseMaterial
) {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 0 ) out vec3 vReflectionCubeCoord;
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position,1.0);
		vReflectionCubeCoord = (meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] *vec4(position, 0.0)).xyz;
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vReflectionCubeCoord;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1) uniform textureCube uSkyBoxTexture;
	layout( location = 0 ) out vec4 outColor;
	
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#skyBoxTexture# diffuseColor = texture(samplerCube(uSkyBoxTexture,uSampler), vReflectionCubeCoord) ;
		outColor = diffuseColor;
		
	}
`;
	static PROGRAM_OPTION_LIST = {
		vertex: [],
		fragment: ['skyBoxTexture']
	};
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture", textureDimension: 'cube'}
		]
	};
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;

	_skyBoxTexture;
	set skyBoxTexture(texture) {
		// this._skyBoxTexture = null;
		this.checkTexture(texture, 'skyBoxTexture');
	}
	get skyBoxTexture() {
		return this._skyBoxTexture
	}
	constructor(redGPUContext, skyBoxTexture) {
		super(redGPUContext);
		this.skyBoxTexture = skyBoxTexture;
		this.needResetBindingInfo = true;

	}

	checkTexture(texture, textureName) {
		if (texture) {
			if (texture._GPUTexture) {
				switch (textureName) {
					case 'skyBoxTexture' :
						this._skyBoxTexture = texture;
						break
				}
				if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
				this.needResetBindingInfo = true
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
			{binding: 0, resource: this.sampler.GPUSampler},
			{
				binding: 1,
				resource: this._skyBoxTexture ? this._skyBoxTexture._GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
			}
		];
		this._afterResetBindingInfo();
	}
}
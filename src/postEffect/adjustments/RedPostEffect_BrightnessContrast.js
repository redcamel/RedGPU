/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedShareGLSL from "../../base/RedShareGLSL.js";
import RedBasePostEffect from "../../base/RedBasePostEffect.js";
import RedTypeSize from "../../resources/RedTypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class RedPostEffect_BrightnessContrast extends RedBasePostEffect {
	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix;
    } meshUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float brightness;
        float contrast;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor = vec4(0.0);
		finalColor = texture( sampler2D( uDiffuseTexture, uSampler ), vUV );
		if ( fragmentUniforms.contrast/255.0 > 0.0 ) finalColor.rgb = ( finalColor.rgb - 0.5 ) / ( 1.0 - fragmentUniforms.contrast/255.0 ) + 0.5;
		else finalColor.rgb = ( finalColor.rgb - 0.5 ) * ( 1.0 + fragmentUniforms.contrast/255.0 ) + 0.5;
		finalColor.rgb += fragmentUniforms.brightness;
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float, valueName: 'brightness'},
		{size: RedTypeSize.float, valueName: 'contrast'}
	];
	constructor(redGPU) {
		super(redGPU);

	}
	_brightness = 0;
	_contrast = 0;
	get brightness() {
		return this._brightness;
	}

	set brightness(value) {
		//FIXME min: -150, max: 150
		this._brightness = value;
		float1_Float32Array[0] = this._brightness;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['brightness'], float1_Float32Array)
	}
	get contrast() {
		return this._contrast;
	}

	set contrast(value) {
		//FIXME min: -50, max: 100
		this._contrast = value;
		float1_Float32Array[0] = this._contrast;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['contrast'], float1_Float32Array)
	}

}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.19 13:50:11
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
        float hue;
        float saturation;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor = vec4(0.0);
		finalColor = texture( sampler2D( uDiffuseTexture, uSampler ), vUV );
		
		float hue_value = fragmentUniforms.hue / 180.0;
		float angle = hue_value * 3.1415926535897932384626433832795;
		float s = sin(angle), c = cos(angle);
		vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
		float len = length(finalColor.rgb);
		
		finalColor.rgb = vec3(
			dot(finalColor.rgb, weights.xyz),
			dot(finalColor.rgb, weights.zxy),
			dot(finalColor.rgb, weights.yzx)
		);
		
		float average = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
		float saturation_value = fragmentUniforms.saturation / 100.0;
		if (saturation_value > 0.0) finalColor.rgb += (average - finalColor.rgb) * (1.0 - 1.0 / (1.001 - saturation_value));
		else finalColor.rgb += (average - finalColor.rgb) * (-saturation_value);
		
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float, valueName: 'hue'},
		{size: RedTypeSize.float, valueName: 'saturation'}
	];
	constructor(redGPUContext) {
		super(redGPUContext);

	}
	_hue = 0;
	_saturation = 0;
	get hue() {
		return this._hue;
	}

	set hue(value) {
		//FIXME min: -180, max: 180
		this._hue = value;
		float1_Float32Array[0] = this._hue;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['hue'], float1_Float32Array)
	}
	get saturation() {
		return this._saturation;
	}

	set saturation(value) {
		//FIXME min: -100, max: 100
		this._saturation = value;
		float1_Float32Array[0] = this._saturation;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['saturation'], float1_Float32Array)
	}

}

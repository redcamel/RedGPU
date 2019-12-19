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
export default class RedPostEffect_BlurX extends RedBasePostEffect {
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
	${RedShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float size;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float random(vec3 scale, float seed) {
		return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
	}

	void main() {
		vec4 finalColor = vec4(0.0);
		vec2 delta;
		float total = 0.0;
		float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
		delta = vec2( fragmentUniforms.size/systemUniforms.resolution.x, 0.0 );
		for (float t = -10.0; t <= 10.0; t++) {
			float percent = (t + offset - 0.5) / 10.0;
			float weight = 1.0 - abs(percent);
			vec4 color = texture( sampler2D( uDiffuseTexture, uSampler ), vUV  + delta * percent );
			color.rgb *= color.a;
			finalColor += color * weight;
			total += weight;
		}
		finalColor = finalColor / total;
		finalColor.rgb /= finalColor.a + 0.00001;
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: RedTypeSize.float, valueName: 'size'}
	];
	constructor(redGPUContext) {
		super(redGPUContext);

	}
	_size = 50;
	get size() {
		return this._size;
	}

	set size(value) {
		this._size = value;
		float1_Float32Array[0] = this._size;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array)
	}

}

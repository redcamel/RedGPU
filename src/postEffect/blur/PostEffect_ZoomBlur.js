/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 13:10:38
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import TypeSize from "../../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_ZoomBlur extends BasePostEffect {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout( set = ${ShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix;
    } meshUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		vNormal = normal;
		vUV = uv;
		gl_Position = vec4(position*2.0,1.0);
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float centerX;
        float centerY;
        float amount;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float random(vec3 scale, float seed) {
		return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
	}

	void main() {
		vec4 finalColor = vec4(0.0);
		vec2 center = vec2( fragmentUniforms.centerX + 0.5, -fragmentUniforms.centerY + 0.5 );
		vec2 toCenter = center - vUV ;
		float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
		float total = 0.0;
		
		for (float t = 0.0; t <= 30.0; t++) {
			float percent = (t + offset) / 30.0;
			float weight = 3.0 * (percent - percent * percent);
			vec4 color = texture( sampler2D( uDiffuseTexture, uSampler ), vUV + toCenter * percent * fragmentUniforms.amount / 100.0 );
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
	static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'centerX'},
		{size: TypeSize.float, valueName: 'centerY'},
		{size: TypeSize.float, valueName: 'amount'}
	];
	constructor(redGPUContext) {
		super(redGPUContext);

	}
	_centerX = 0;
	_centerY = 0;
	_amount = 38;
	get centerX() {
		return this._centerX;
	}

	set centerX(value) {

		this._centerX = value;
		float1_Float32Array[0] = this._centerX;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerX'], float1_Float32Array)
	}
	get centerY() {
		return this._centerY;
	}

	set centerY(value) {

		this._centerY = value;
		float1_Float32Array[0] = this._centerY;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerY'], float1_Float32Array)
	}
	get amount() {
		return this._amount;
	}

	set amount(value) {
		//FIXME - min: 1, max: 100
		this._amount = value;
		float1_Float32Array[0] = this._amount;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['amount'], float1_Float32Array)
	}
	get radius() {
		return this._radius;
	}


}

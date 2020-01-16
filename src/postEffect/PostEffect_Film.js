/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 13:54:48
 *
 */

"use strict";
import BaseMaterial from "../base/BaseMaterial.js";
import ShareGLSL from "../base/ShareGLSL.js";
import BasePostEffect from "../base/BasePostEffect.js";
import TypeSize from "../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_Film extends BasePostEffect {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout( set = ${ShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix;
    } meshMatrixUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vTime;
	void main() {
		vNormal = normal;
		vUV = uv;
		vTime = systemUniforms.time;
		gl_Position = vec4(position*2.0,1.0);
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float scanlineIntensity;
        float noiseIntensity;
        float scanlineCount;
        float grayMode;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vTime;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float random(vec3 scale, float seed) {
		return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
	}

	void main() {

		vec4 diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );

		// make some noise
		float x = vUV.x * vUV.y * vTime;
		x = mod( x, 13.0 ) * mod( x, 123.0 );
		float dx = mod( x, 0.01 );
		
		// add noise
		vec3 finalColor = diffuseColor.rgb + diffuseColor.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );
		
		// get us a sine and cosine
		vec2 sc = vec2( sin( vUV.y * fragmentUniforms.scanlineCount ), cos( vUV.y * fragmentUniforms.scanlineCount ) );
		
		// add scanlines
		finalColor += diffuseColor.rgb * vec3( sc.x, sc.y, sc.x ) * fragmentUniforms.scanlineIntensity;
		
		// interpolate between source and result by intensity
		finalColor = diffuseColor.rgb + clamp( fragmentUniforms.noiseIntensity, 0.0, 1.0 ) * ( finalColor - diffuseColor.rgb );
		
		// convert to grayscale if desired
		if(fragmentUniforms.grayMode == 1.0) finalColor = vec3( finalColor.r * 0.3 + finalColor.g * 0.59 + finalColor.b * 0.11 );
		outColor = vec4( finalColor, diffuseColor.a );
	}
`;
	static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
	static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'scanlineIntensity'},
		{size: TypeSize.float, valueName: 'noiseIntensity'},
		{size: TypeSize.float, valueName: 'scanlineCount'},
		{size: TypeSize.float, valueName: 'grayMode'}
	];
	_scanlineIntensity = 0.5;
	_noiseIntensity = 0.5;
	_scanlineCount = 2048;
	_grayMode = false;
	get scanlineIntensity() {return this._scanlineIntensity;}
	set scanlineIntensity(value) {
		this._scanlineIntensity = value;
		float1_Float32Array[0] = this._scanlineIntensity;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['scanlineIntensity'], float1_Float32Array)
	}
	get noiseIntensity() {return this._noiseIntensity;}
	set noiseIntensity(value) {
		this._noiseIntensity = value;
		float1_Float32Array[0] = this._noiseIntensity;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['noiseIntensity'], float1_Float32Array)
	}
	get scanlineCount() {return this._scanlineCount;}
	set scanlineCount(value) {/*FIXME - min: 1, max: 100*/
		this._scanlineCount = value;
		float1_Float32Array[0] = this._scanlineCount;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['scanlineCount'], float1_Float32Array)
	}
	get grayMode() {return this._grayMode;}
	set grayMode(value) {
		this._grayMode = value;
		float1_Float32Array[0] = this._grayMode ? 1 : 0;
		this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['grayMode'], float1_Float32Array)
	}
	constructor(redGPUContext) {super(redGPUContext);}


}

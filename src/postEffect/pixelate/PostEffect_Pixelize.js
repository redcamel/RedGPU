/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import TypeSize from "../../resources/TypeSize.js";

const float1_Float32Array = new Float32Array(1);
export default class PostEffect_Pixelize extends BasePostEffect {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
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
        float width;
        float height;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor;
		float dx = 1.0/systemUniforms.resolution.x * fragmentUniforms.width;
		float dy = 1.0/systemUniforms.resolution.y * fragmentUniforms.height;
		vec2 coord = vec2(
			dx * (floor(vUV.x / dx) + 0.5),
			dy * (floor(vUV.y / dy) + 0.5)
		);
		finalColor = texture( sampler2D( uSourceTexture, uSampler ), coord );
		outColor = finalColor;
	}
`;
	static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};;
	static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'width'},
		{size: TypeSize.float, valueName: 'height'}
	];
	_width = 5;
	_height = 5;
	get width() {return this._width;}
	set width(value) {/*FIXME min: 0*/
		this._width = value;
		float1_Float32Array[0] = this._width;
		// this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['width'], float1_Float32Array)
		this.redGPUContext.device.defaultQueue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['width'], float1_Float32Array)
	}
	get height() {return this._height;}
	set height(value) {/*FIXME min: 0*/
		this._height = value;
		float1_Float32Array[0] = this._height;
		// this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['height'], float1_Float32Array)
		this.redGPUContext.device.defaultQueue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['height'], float1_Float32Array)
	}
	constructor(redGPUContext) {super(redGPUContext);}
}

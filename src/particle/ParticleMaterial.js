/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.30 19:35:31
 *
 */

"use strict";
import ShareGLSL from "../base/ShareGLSL.js";
import TypeSize from "../resources/TypeSize.js";
import BitmapMaterial from "../material/BitmapMaterial.js";

let float1_Float32Array = new Float32Array(1);
export default class ParticleMaterial extends BitmapMaterial {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.getSprite3DMatrix}    
	layout(location = 0) in vec3 a_pos;
    layout(location = 1) in vec2 a_uv;
    layout(location = 2) in vec3 position;
    layout(location = 3) in float alpha;
    layout(location = 4) in vec3 rotation;
    layout(location = 5) in float scale;
	layout(location = 0 ) out vec2 vUV;
	layout(location = 1 ) out float vMouseColorID;	
	layout(location = 2 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float sprite3DMode;
    } vertexUniforms;
	mat4 rotationMTX(vec3 t)
    {
       float s = sin(t[0]);float c = cos(t[0]);
       mat4 m1 = mat4( 1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1);s = sin(t[1]);c = cos(t[1]);
       mat4 m2 = mat4(c,0,-s,0, 0,1,0,0, s,0,c,0,  0,0,0,1);s = sin(t[2]);c = cos(t[2]);
       mat4 m3 = mat4(c,s,0,0, -s,c,0,0, 0,0,1,0,  0,0,0,1);
       return m3*m2*m1;
    }
	void main() {
		vUV = a_uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity * alpha;
		float ratio = systemUniforms.resolution.x/systemUniforms.resolution.y; 
		if( vertexUniforms.sprite3DMode == 1.0 ) {
			mat4 scaleMTX = mat4(
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				position, 1
			) *
			mat4(
				scale, 0, 0, 0,
				0, scale , 0, 0,
				0, 0, scale, 0,
				0, 0, 0, 1
			) ;
			gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX,  scaleMTX ) * rotationMTX(vec3(0,0, rotation.z)) * vec4(a_pos , 1);
		}else{
			mat4 scaleMTX = mat4(
				scale, 0, 0, 0,
				0, scale, 0, 0,
				0, 0, scale, 0,
				position, 1
			)
			* rotationMTX(rotation);
			gl_Position = systemUniforms.perspectiveMTX *  systemUniforms.cameraMTX * scaleMTX * vec4(a_pos , 1);
		}
		
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec2 vUV;
	layout( location = 1 ) in float vMouseColorID;	
	layout( location = 2 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
        //
        float __diffuseTextureRenderYn;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`;
	static PROGRAM_OPTION_LIST = {
		vertex: [],
		fragment: []
		// vertex: [],
		// fragment: ['diffuseTexture']
	};
	static uniformsBindGroupLayoutDescriptor_material = {
		entries: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: TypeSize.float, valueName: 'sprite3DMode'}
	];
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'alpha'}
	];
	_sprite3DMode=true;
	get sprite3DMode() {
		return this._sprite3DMode;
	}
	set sprite3DMode(value) {
		this._sprite3DMode = value;
		float1_Float32Array[0] = value ? 1 : 0;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['sprite3DMode'], float1_Float32Array)
	}
	constructor(redGPUContext, diffuseTexture) {
		super(redGPUContext);
		this.diffuseTexture = diffuseTexture;
		this.needResetBindingInfo = true
	}
	resetBindingInfo() {
		this.entries = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_vertex.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_vertex.size
				}
			},
			{
				binding: 1,
				resource: {
					buffer: this.uniformBuffer_fragment.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			},
			{
				binding: 2,
				resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 3,
				resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			}
		];
		this._afterResetBindingInfo();
	}
}
/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.29 22:10:29
 *
 */

"use strict";
import BaseMaterial from "../base/BaseMaterial.js";
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
    layout(location = 3) in vec3 scale;
    layout(location = 4) in float alpha;
	layout(location = 0 ) out vec2 vUV;
	layout(location = 1 ) out float vMouseColorID;	
	layout(location = 2 ) out float vSumOpacity;
	void main() {
		vUV = a_uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity * alpha;
		float ratio = systemUniforms.resolution.x/systemUniforms.resolution.y; 
		mat4 scaleMTX = mat4(
			scale.x, 0, 0, 0,
			0, scale.y , 0, 0,
			0, 0, scale.z, 0,
			position, 1
		);
		// gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX, meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ]* scaleMTX )  * vec4(a_pos , 1);
		gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX, scaleMTX )  * vec4(a_pos , 1);
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec2 vUV;
	layout( location = 1 ) in float vMouseColorID;	
	layout( location = 2 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float alpha;
        //
        float __diffuseTextureRenderYn;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
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
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'alpha'},
		//
		{size: TypeSize.float, valueName: '__diffuseTextureRenderYn'},
	];
	constructor(redGPUContext, diffuseTexture) {
		super(redGPUContext);
		this.diffuseTexture = diffuseTexture;
		this.needResetBindingInfo = true
	}
	resetBindingInfo() {
		this.bindings = [
			{
				binding: 0,
				resource: {
					buffer: this.uniformBuffer_fragment.GPUBuffer,
					offset: 0,
					size: this.uniformBufferDescriptor_fragment.size
				}
			},
			{
				binding: 1,
				resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
			},
			{
				binding: 2,
				resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			}
		];
		this._afterResetBindingInfo();
	}
}
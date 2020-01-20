/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */

"use strict";
import BaseMaterial from "../base/BaseMaterial.js";
import ShareGLSL from "../base/ShareGLSL.js";
import Mix from "../base/Mix.js";
import RedGPUContext from "../RedGPUContext.js";
import TypeSize from "../resources/TypeSize.js";

let float1_Float32Array = new Float32Array(1);
export default class Sprite3DMaterial extends Mix.mix(
	BaseMaterial,
	Mix.diffuseTexture,
	Mix.alpha
) {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vMouseColorID;
	layout( location = 3 ) out float vSumOpacity;	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float useFixedScale;
    } vertexUniforms;
    ${ShareGLSL.GLSL_SystemUniforms_vertex.getSprite3DMatrix}
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX, meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] ) * vec4(position,1.0);
		if(vertexUniforms.useFixedScale == TRUTHY)  {
			gl_Position /= gl_Position.w;
			gl_Position.xy += position.xy * vec2((systemUniforms.perspectiveMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ])[0][0],(systemUniforms.perspectiveMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ])[1][1]);
		}
		vNormal = normal;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;	
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
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`;
	static PROGRAM_OPTION_LIST = {
		vertex: [],
		fragment: []
		// vertex: ['useFixedScale'], fragment: ['diffuseTexture']
	};
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: TypeSize.float, valueName: 'useFixedScale'}
	];
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'alpha'},
		//
		{size: TypeSize.float, valueName: '__diffuseTextureRenderYn'},
	];
	#useFixedScale = false;
	constructor(redGPUContext, diffuseTexture) {
		super(redGPUContext);
		this.diffuseTexture = diffuseTexture;
		this.needResetBindingInfo = true
	}
	get useFixedScale() {return this.#useFixedScale;}
	set useFixedScale(value) {
		this.#useFixedScale = value;
		float1_Float32Array[0] = value ? 1 : 0;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`useFixedScale`], float1_Float32Array);
		this.needResetBindingInfo = true
	}
	checkTexture(texture, textureName) {
		if (texture) {
			if (texture._GPUTexture) {
				let tKey;
				switch (textureName) {
					case 'diffuseTexture' :
						this._diffuseTexture = texture;
						tKey = textureName;
						break
				}
				if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
				if (tKey) {
					float1_Float32Array[0] = this[`__${textureName}RenderYn`] = 1;
					if (tKey == 'displacementTexture') this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
					else this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
				}
				this.needResetBindingInfo = true
			} else {
				texture.addUpdateTarget(this, textureName)
			}

		} else {
			if (this['_' + textureName]) {
				this['_' + textureName] = null;
				float1_Float32Array[0] = this[`__${textureName}RenderYn`] = 0;
				if (textureName == 'displacementTexture') this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
				else this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
				this.needResetBindingInfo = true
			}
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
/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.23 19:1:41
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import Mix from "../../base/Mix.js";
import RedGPUContext from "../../RedGPUContext.js";
import TypeSize from "../../resources/TypeSize.js";

let float1_Float32Array = new Float32Array(1)
export default class TextMaterial extends Mix.mix(
	BaseMaterial,
	Mix.diffuseTexture,
	Mix.alpha
) {
	static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float width;
        float height;
    } vertexUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out vec4 vMouseColorID;	
    ${ShareGLSL.GLSL_SystemUniforms_vertex.getSprite3DMatrix}	
	void main() {
		float w = vertexUniforms.width ;
		float h = vertexUniforms.height ;
		mat4 modelMatrix = meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ];
		mat4 targetMatrix;
		
		// 기본
		targetMatrix = modelMatrix * mat4( w / max( w, h ), 0.0, 0.0, 0.0,   0.0, h / max( w, h ), 0.0, 0.0,    0.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0 );
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * targetMatrix * vec4(position,1.0);				
		
		// sprite3D
		//#RedGPU#useSprite3DMode#  targetMatrix = modelMatrix * mat4( w / systemUniforms.resolution.y, 0.0, 0.0, 0.0,    0.0, h / systemUniforms.resolution.y, 0.0, 0.0,    0.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0);
		//#RedGPU#useSprite3DMode#  gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX, targetMatrix ) * vec4(position,1.0);	
			
		
		//#RedGPU#useSprite3DMode#  //#RedGPU#useFixedScale#  gl_Position /= gl_Position.w;
		//#RedGPU#useSprite3DMode#  //#RedGPU#useFixedScale#  gl_Position.xy += position.xy * vec2((systemUniforms.perspectiveMTX * modelMatrix)[0][0],(systemUniforms.perspectiveMTX * modelMatrix)[1][1]);
	
		
		vNormal = normal;
		vUV = uv;
		vMouseColorID = meshUniformsIndex.mouseColorID;
	}
	`;
	static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vMouseColorID;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	layout( location = 2 ) out vec4 outMouseColorID;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#diffuseTexture# diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha;
		if(outColor.a == 0.0) discard;
		outMouseColorID = vMouseColorID;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
`;
	static PROGRAM_OPTION_LIST = ['diffuseTexture', 'useFixedScale', 'useSprite3DMode'];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: TypeSize.float, valueName: 'width'},
		{size: TypeSize.float, valueName: 'height'}

	];
	static uniformBufferDescriptor_fragment = [
		{size: TypeSize.float, valueName: 'alpha'}
	];
	#useFixedScale = false;
	#useSprite3DMode = false;
	_width = 256;
	_height = 256;
	get width() {return this._width;}
	set width(value) {
		this._width = value;
		float1_Float32Array[0] = this._width;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['width'], float1_Float32Array)
	}
	get height() {return this._height;}
	set height(value) {
		this._height = value;
		float1_Float32Array[0] = this._height;
		this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['height'], float1_Float32Array)
	}
	constructor(redGPUContext, diffuseTexture) {
		super(redGPUContext);
		this.diffuseTexture = diffuseTexture;
		this.needResetBindingInfo = true
	}
	get useFixedScale() {return this.#useFixedScale;}
	set useFixedScale(value) {
		this.#useFixedScale = value;
		this.dirtyPipeline = true;
	}
	get useSprite3DMode() {return this.#useSprite3DMode;}
	set useSprite3DMode(value) {
		this.#useSprite3DMode = value;
		this.dirtyPipeline = true;
	}
	checkTexture(texture, textureName) {
		if (texture) {
			if (texture._GPUTexture) {
				switch (textureName) {
					case 'diffuseTexture' :
						this._diffuseTexture = texture;
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
			{binding: 2, resource: this.sampler.GPUSampler},
			{
				binding: 3,
				resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
			}
		];
		this._afterResetBindingInfo();
	}
}
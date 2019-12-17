/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 17:0:49
 *
 */

"use strict";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedShareGLSL from "../base/RedShareGLSL.js";
import RedMix from "../base/RedMix.js";
import RedGPUContext from "../RedGPUContext.js";
import RedTypeSize from "../resources/RedTypeSize.js";

export default class RedSheetMaterial extends RedMix.mix(
	RedBaseMaterial,
	RedMix.diffuseTexture,
	RedMix.alpha
) {

	static vertexShaderGLSL = `
	#version 450
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
   layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshUniforms {
        mat4 modelMatrix[${RedShareGLSL.MESH_UNIFORM_POOL_NUM}];
    } meshUniforms;
    layout( set = ${RedShareGLSL.SET_INDEX_MeshUniforms}, binding = 1 ) uniform MeshUniformIndex {
        float index;
    
    } meshUniformsIndex;
    layout( set = ${RedShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        vec4 sheetRect;
    } vertexUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		vUV = uv;
		vUV = vec2(
		vUV.s * vertexUniforms.sheetRect.x + vertexUniforms.sheetRect.z,
		vUV.t * vertexUniforms.sheetRect.y -vertexUniforms.sheetRect.w
		);		
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshUniforms.modelMatrix[ int(meshUniformsIndex.index) ] * vec4(position,1.0);
		vNormal = normal;
	
	}
	`;
	static fragmentShaderGLSL = `
	#version 450
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
    } fragmentUniforms;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${RedShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 outDepthColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#diffuseTexture# diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		
		if(diffuseColor.a<0.1) discard;
			
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha;
		outDepthColor = vec4( vec3(gl_FragCoord.z/gl_FragCoord.w), 1.0 );
	}
`;
	static PROGRAM_OPTION_LIST = ['diffuseTexture'];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.VERTEX, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 3, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = [
		{size: RedTypeSize.float4, valueName: 'sheetRect'},
		{size: RedTypeSize.float, valueName: 'alpha'}
	];
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;
	_frameRate;
	get frameRate() {
		return this._frameRate;
	}
	set frameRate(value) {
		this._frameRate = value;
		this._perFrameTime = 1000 / this._frameRate
	}
	constructor(redGPUContext, diffuseTexture, frameRate = 60, segmentW = 1, segmentH = 1, totalFrame = 1) {
		super(redGPUContext);
		this.diffuseTexture = diffuseTexture;
		this.needResetBindingInfo = true;
		this.frameRate = frameRate;
		this.segmentW = segmentW;
		this.segmentH = segmentH;
		this.totalFrame = totalFrame;
		this.sheetRect = new Float32Array(4);
		this.currentIndex = 0;
		this.loop = true;
		this._aniMap = {};
		this._nextFrameTime = 0; // 다음 프레임 호출 시간
		this._playYn = true
		console.log(this)

	}
	update(time) {
		if (!this._nextFrameTime) this._nextFrameTime = this._perFrameTime + time;
		if (this._playYn && this._nextFrameTime < time) {
			var gapFrame = parseInt((time - this._nextFrameTime) / this._perFrameTime);
			gapFrame = gapFrame || 1;
			this._nextFrameTime = this._perFrameTime + time;
			this.currentIndex += gapFrame;
			if (this.currentIndex >= this.totalFrame) {
				if (this.loop) this._playYn = true, this.currentIndex = 0;
				else this._playYn = false, this.currentIndex = this.totalFrame - 1
			}
		}
		this.sheetRect[0] = 1 / this.segmentW;
		this.sheetRect[1] = 1 / this.segmentH;
		this.sheetRect[2] = (this.currentIndex % this.segmentW) / this.segmentW;
		this.sheetRect[3] = Math.floor(this.currentIndex / this.segmentH) / this.segmentH;
		if (this.uniformBuffer_vertex) this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['sheetRect'], this.sheetRect)
	}

	addAction(key, option) {
		this._aniMap[key] = option
	};
	setAction(key) {
		this.diffuseTexture = this._aniMap[key]['texture'];
		this.segmentW = this._aniMap[key]['segmentW'];
		this.segmentH = this._aniMap[key]['segmentH'];
		this.totalFrame = this._aniMap[key]['totalFrame'];
		this.frameRate = this._aniMap[key]['frameRate'];
		this['currentIndex'] = 0;
		this['_nextFrameTime'] = 0;
	}

	play() {
		this._playYn = true
	};

	stop() {
		this._playYn = false;
		this.currentIndex = 0;
	};

	pause() {
		this._playYn = false
	};

	gotoAndStop(index) {
		if (index > this.totalFrame - 1) index = this.totalFrame - 1;
		if (index < 0) index = 0;
		this._playYn = false;
		this.currentIndex = index;
	};
	/*DOC:
	 {
		 title :`gotoAndPlay`,
		 code : 'METHOD',
		 description : `
		    해당 프레임 부터 재생
		 `,
		 return : 'void'
	 }
	 :DOC*/
	gotoAndPlay(index) {
		if (index > this.totalFrame - 1) index = this.totalFrame - 1;
		if (index < 0) index = 0;
		this._playYn = true;
		this.currentIndex = index;
		this._nextFrameTime = 0;
	};

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
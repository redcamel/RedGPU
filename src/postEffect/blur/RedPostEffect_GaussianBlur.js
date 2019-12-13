/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedBasePostEffect from "../../base/RedBasePostEffect.js";
import RedPostEffect_BlurX from "./RedPostEffect_BlurX.js";
import RedPostEffect_BlurY from "./RedPostEffect_BlurY.js";

export default class RedPostEffect_GaussianBlur extends RedBasePostEffect {

	static vertexShaderGLSL = `
		#version 450
		void main() {}
	`;
	static fragmentShaderGLSL = `
		#version 450
		void main() {}
	`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;
	#blurX;
	#blurY;
	baseAttachment;
	baseAttachmentView;
	_radius;
	constructor(redGPUContext) {
		super(redGPUContext);
		this.#blurX = new RedPostEffect_BlurX(redGPUContext);
		this.#blurY = new RedPostEffect_BlurY(redGPUContext);
		this.radius = 5;
	}
	get radius() {
		return this._radius;
	}
	set radius(value) {
		this._radius = value;
		this.#blurX.size = value;
		this.#blurY.size = value;

	}
	render(redGPUContext, redView, renderScene, diffuseTextureView) {
		this.checkSize(redGPUContext, redView);
		this.#blurX.render(redGPUContext, redView, renderScene, diffuseTextureView);
		this.#blurY.render(redGPUContext, redView, renderScene, this.#blurX.baseAttachmentView);
		this.baseAttachment = this.#blurY.baseAttachment;
		this.baseAttachmentView = this.#blurY.baseAttachmentView;
	}
}

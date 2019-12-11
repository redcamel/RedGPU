/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.11 20:19:9
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedBasePostEffect from "../../base/RedBasePostEffect.js";
import RedPostEffect_GaussianBlur from "../blur/RedPostEffect_GaussianBlur.js";
import RedPostEffect_DoF_blend from "./RedPostEffect_DoF_blend.js";

export default class RedPostEffect_DoF extends RedBasePostEffect {

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
	#blurEffect;
	#blenderEffect;
	baseAttachment;
	baseAttachmentView;
	#blur;
	#focusLength;
	constructor(redGPU) {
		super(redGPU);
		this.#blurEffect = new RedPostEffect_GaussianBlur(redGPU);
		this.#blenderEffect = new RedPostEffect_DoF_blend(redGPU);
		this.blur = 5;
		this.focusLength = 15
	}
	get blur() {
		return this.#blur;
	}
	set blur(value) {
		this.#blur = value;
		this.#blurEffect.radius = value;
	}
	get focusLength() {
		return this.#focusLength;
	}
	set focusLength(value) {
		this.#focusLength = value;
		this.#blenderEffect.focusLength = value;

	}
	render(redGPU, redView, renderScene, diffuseTextureView) {
		this.checkSize(redGPU,redView);
		this.#blurEffect.render(redGPU, redView, renderScene, diffuseTextureView);
		this.#blenderEffect._blurTexture = this.#blurEffect.baseAttachmentView;
		this.#blenderEffect._depthTexture = redView.baseResolveTarget2View;
		this.#blenderEffect.render(redGPU, redView, renderScene, diffuseTextureView);
		this.baseAttachment = this.#blenderEffect.baseAttachment;
		this.baseAttachmentView = this.#blenderEffect.baseAttachmentView;
	}
}

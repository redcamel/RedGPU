/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 14:24:48
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import PostEffect_GaussianBlur from "../blur/PostEffect_GaussianBlur.js";
import PostEffect_DoF_blend from "./PostEffect_DoF_blend.js";
import ShareGLSL from "../../base/ShareGLSL.js";

export default class PostEffect_DoF extends BasePostEffect {

	static vertexShaderGLSL = `
		${ShareGLSL.GLSL_VERSION}
		void main() {}
	`;
	static fragmentShaderGLSL = `
		${ShareGLSL.GLSL_VERSION}
		void main() {}
	`;
	static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};;
	static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;
	#blurEffect;
	#blenderEffect;
	baseAttachment;
	baseAttachmentView;
	#blur;
	#focusLength;
	constructor(redGPUContext) {
		super(redGPUContext);
		this.#blurEffect = new PostEffect_GaussianBlur(redGPUContext);
		this.#blenderEffect = new PostEffect_DoF_blend(redGPUContext);
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
	render(redGPUContext, redView, renderScene, sourceTextureView) {
		this.checkSize(redGPUContext, redView);
		this.#blurEffect.render(redGPUContext, redView, renderScene, sourceTextureView);
		this.#blenderEffect.blurTexture = this.#blurEffect.baseAttachmentView;
		this.#blenderEffect.depthTexture = redView.baseAttachment_mouseColorID_depth_ResolveTargetView;
		this.#blenderEffect.render(redGPUContext, redView, renderScene, sourceTextureView);
		this.baseAttachment = this.#blenderEffect.baseAttachment;
		this.baseAttachmentView = this.#blenderEffect.baseAttachmentView;
	}
}

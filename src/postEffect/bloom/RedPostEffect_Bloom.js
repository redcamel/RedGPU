/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.3 17:35:29
 *
 */

"use strict";
import RedBaseMaterial from "../../base/RedBaseMaterial.js";
import RedBasePostEffect from "../../base/RedBasePostEffect.js";
import RedPostEffect_GaussianBlur from "../blur/RedPostEffect_GaussianBlur.js";
import RedPostEffect_Threshold from "../adjustments/RedPostEffect_Threshold.js";
import RedPostEffect_Bloom_blend from "./RedPostEffect_Bloom_blend.js";

export default class RedPostEffect_Bloom extends RedBasePostEffect {

	static vertexShaderGLSL = `
		#version 450
		void main() {}
	`;
	static fragmentShaderGLSL = `
		#version 450
		void main() {}
	`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = RedBasePostEffect.uniformsBindGroupLayoutDescriptor_material
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;
	#blurEffect;
	#blenderEffect;
	#thresholdEffect;
	baseAttachment;
	baseAttachmentView;
	#blur;
	#threshold;
	#exposure;
	#bloomStrength;
	constructor(redGPU) {
		super(redGPU);
		this.#thresholdEffect = new RedPostEffect_Threshold(redGPU);
		this.#blurEffect = new RedPostEffect_GaussianBlur(redGPU);
		this.#blenderEffect = new RedPostEffect_Bloom_blend(redGPU);
		this.blur = 20;
		this.threshold = 75;
		this.exposure = 1;
		this.bloomStrength = 1.2;
	}
	get blur() {
		return this.#blur;
	}
	set blur(value) {
		this.#blur = value;
		this.#blurEffect.radius = value;
	}
	get threshold() {
		return this.#threshold;
	}
	set threshold(value) {
		this.#threshold = value;
		this.#thresholdEffect.threshold = value;
	}
	get exposure() {
		return this.#exposure;
	}
	set exposure(value) {
		this.#exposure = value;
		this.#blenderEffect.exposure = value;
	}
	get bloomStrength() {
		return this.#bloomStrength;
	}
	set bloomStrength(value) {
		this.#bloomStrength = value;
		this.#blenderEffect.bloomStrength = value;
	}
	render(redGPU, redView, renderScene, diffuseTextureView) {
		this.#thresholdEffect.render(redGPU, redView, renderScene, diffuseTextureView);
		this.#blurEffect.render(redGPU, redView, renderScene, this.#thresholdEffect.baseAttachmentView);
		this.#blenderEffect._blurTexture = this.#blurEffect.baseAttachmentView;
		this.#blenderEffect.render(redGPU, redView, renderScene, diffuseTextureView);
		this.baseAttachment = this.#blenderEffect.baseAttachment;
		this.baseAttachmentView = this.#blenderEffect.baseAttachmentView;
	}
}

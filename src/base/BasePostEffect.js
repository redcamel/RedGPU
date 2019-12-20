/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:27
 *
 */

"use strict";
import BaseMaterial from "../base/BaseMaterial.js";
import Mix from "./Mix.js";
import Mesh from "../object3D/Mesh.js";
import Plane from "../primitives/Plane.js";

export default class BasePostEffect extends Mix.mix(
	BaseMaterial,
	Mix.diffuseTexture
) {
	static vertexShaderGLSL = ``;
	static fragmentShaderGLSL = ``;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [
			{binding: 0, visibility: GPUShaderStage.FRAGMENT, type: "uniform-buffer"},
			{binding: 1, visibility: GPUShaderStage.FRAGMENT, type: "sampler"},
			{binding: 2, visibility: GPUShaderStage.FRAGMENT, type: "sampled-texture"}
		]
	};
	static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;

	#prevViewRect = [];
	baseAttachment;
	baseAttachmentView;
	constructor(redGPUContext) {
		super(redGPUContext);
		this.quad = new Mesh(redGPUContext, new Plane(redGPUContext), this);
		this.quad.isPostEffectQuad = true
	}
	checkSize(redGPUContext, redView) {
		if ([this.#prevViewRect[2], this.#prevViewRect[3]].toString() != [redView.viewRect[2], redView.viewRect[3]].toString()) {
			if (this.baseAttachment) this.baseAttachment.destroy();
			this.#prevViewRect = redView.viewRect.concat();
			this.baseAttachment = redGPUContext.device.createTexture({
				size: {
					width: redView.viewRect[2],
					height: redView.viewRect[3],
					depth: 1
				},
				sampleCount: 1,
				format: redGPUContext.swapChainFormat,
				usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
			});
			this.baseAttachmentView = this.baseAttachment.createView();
			return true
		}
	}
	render(redGPUContext, redView, renderScene, diffuseTextureView) {
		this.checkSize(redGPUContext, redView);
		const commandEncoder_effect = redGPUContext.device.createCommandEncoder();
		const passEncoder_effect = commandEncoder_effect.beginRenderPass(
			{
				colorAttachments: [{
					attachment: this.baseAttachmentView,
					loadValue: {r: 0, g: 0, b: 0, a: 0}
				}]
			}
		);
		if (this._diffuseTexture != diffuseTextureView) {
			this._diffuseTexture = diffuseTextureView;
			this.quad.pipeline.updatePipeline_sampleCount1(redGPUContext, redView);
			this.resetBindingInfo()
		}
		redView.updateSystemUniform(passEncoder_effect, redGPUContext);
		renderScene(redGPUContext, redView, passEncoder_effect, null, [this.quad]);
		passEncoder_effect.endPass();

		redGPUContext.device.defaultQueue.submit([commandEncoder_effect.finish()]);
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
			{binding: 1, resource: this.sampler.GPUSampler},
			{
				binding: 2,
				resource: this._diffuseTexture
			}
		];
		this._afterResetBindingInfo();
	}
}
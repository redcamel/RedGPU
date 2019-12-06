/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

"use strict";
import RedBaseMaterial from "../base/RedBaseMaterial.js";
import RedMaterialPreset from "../material/RedMaterialPreset.js";
import RedMesh from "../object3D/RedMesh.js";
import RedPlane from "../primitives/RedPlane.js";

export default class RedBasePostEffect extends RedMaterialPreset.mix(
	RedBaseMaterial,
	RedMaterialPreset.diffuseTexture
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
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;

	#prevViewRect = [];
	baseAttachment;
	baseAttachmentView;
	constructor(redGPU) {
		super(redGPU);
		this.quad = new RedMesh(redGPU, new RedPlane(redGPU), this);
		this.quad.isPostEffectQuad = true
	}
	render(redGPU, redView, renderScene, diffuseTextureView) {
		if (this.#prevViewRect.toString() != redView.viewRect.toString()) {
			if (this.baseAttachment) this.baseAttachment.destroy();
			this.#prevViewRect = redView.viewRect.concat();
			this.baseAttachment = redGPU.device.createTexture({
				size: {
					width: redView.viewRect[2],
					height: redView.viewRect[3],
					depth: 1
				},
				sampleCount: 1,
				format: redGPU.swapChainFormat,
				usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.SAMPLED
			});
			this.baseAttachmentView = this.baseAttachment.createView();
		}

		const commandEncoder_effect = redGPU.device.createCommandEncoder();
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
			this.quad.pipeline.updatePipeline_sampleCount1(redGPU, redView);
			this.resetBindingInfo()
		}
		redView.updateSystemUniform(passEncoder_effect, redGPU);
		renderScene(redGPU, redView, passEncoder_effect, null, [this.quad]);
		passEncoder_effect.endPass();

		redGPU.device.defaultQueue.submit([commandEncoder_effect.finish()]);
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

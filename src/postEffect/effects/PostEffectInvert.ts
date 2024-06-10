import {RedGPUContext} from "../../context";
import {PostEffectBase} from "../index";
import PostEffectManager from "../PostEffectManager";
import fragmentSource from "./wgslFragment/invertFragment.wgsl";
import vertexSource from "./wgslVertex/baseVertex.wgsl";

class PostEffectInvert extends PostEffectBase {
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext, vertexSource, fragmentSource);
	}

	render(postEffectManager: PostEffectManager, sourceTextureView: GPUTextureView): GPUTextureView {
		const redGPUContext = this.redGPUContext
		const {gpuDevice} = redGPUContext
		const {textureView, renderPassDescriptor} = this.getRenderInfo(postEffectManager)
		if (!this.pipeline) this.#init(postEffectManager)
		//
		const uniformBindGroupDescriptor = {
			layout: this.uniformsBindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: postEffectManager.sampler.gpuSampler,
				},
				{
					binding: 1,
					resource: sourceTextureView,
				}
			]
		};
		this.uniformBindGroup = gpuDevice.createBindGroup(uniformBindGroupDescriptor);
		//
		const commandEncoder: GPUCommandEncoder = gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
		passEncoder.setPipeline(this.pipeline);
		passEncoder.setVertexBuffer(0, postEffectManager.vertexBuffer.gpuBuffer);
		passEncoder.setBindGroup(0, this.uniformBindGroup);
		passEncoder.draw(6, 1, 0, 0);
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		return textureView
	}

	#init(postEffectManager: PostEffectManager) {
		const {gpuDevice} = this.redGPUContext
		this.uniformsBindGroupLayout = gpuDevice.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.FRAGMENT,
					sampler: {
						type: 'filtering',
					},
				},
				{
					binding: 1,
					visibility: GPUShaderStage.FRAGMENT,
					texture: {}
				}
			]
		});
		this.setPipeline(postEffectManager)
	}
}

export default PostEffectInvert

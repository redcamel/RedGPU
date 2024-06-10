import {RedGPUContext} from "../../context";
import TypeSize from "../../resource/buffers/TypeSize";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import UniformBufferFloat32 from "../../resource/buffers/uniformBuffer/UniformBufferFloat32";
import {PostEffectBase} from "../index";
import PostEffectManager from "../PostEffectManager";
import fragmentSource from "./wgslFragment/hueSaturationFragment.wgsl";
import vertexSource from "./wgslVertex/baseVertex.wgsl";

let float32Array_1 = new Float32Array(1);

class PostEffectHueSaturation extends PostEffectBase {
	uniformBuffer: UniformBufferFloat32
	#saturation: number = 0
	#hue: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext, vertexSource, fragmentSource);
	}

	get saturation(): number {
		return this.#saturation;
	}

	set saturation(value: number) {
		if (value < -100) value = -100
		if (value > 100) value = 100
		this.#saturation = value;
		float32Array_1[0] = value / 100
		this.redGPUContext.gpuDevice.queue.writeBuffer(
			this.uniformBuffer.gpuBuffer,
			this.uniformBuffer.descriptor.redGpuStructOffsetMap['saturation'],
			float32Array_1
		);
	}

	get hue(): number {
		return this.#hue;
	}

	set hue(value: number) {
		if (value < -180) value = -180
		if (value > 180) value = 180
		this.#hue = value;
		float32Array_1[0] = value / 180
		this.redGPUContext.gpuDevice.queue.writeBuffer(
			this.uniformBuffer.gpuBuffer,
			this.uniformBuffer.descriptor.redGpuStructOffsetMap['hue'],
			float32Array_1
		);
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
					resource: {
						buffer: this.uniformBuffer.gpuBuffer,
						offset: 0,
						size: this.uniformBuffer.gpuBuffer.size
					}
				},
				{
					binding: 1,
					resource: postEffectManager.sampler.gpuSampler,
				},
				{
					binding: 2,
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
		this.uniformBuffer = new UniformBufferFloat32(this.redGPUContext, new UniformBufferDescriptor(
			[
				{size: TypeSize.float32, valueName: 'hue'},
				{size: TypeSize.float32, valueName: 'saturation'},
			]
		))
		this.uniformsBindGroupLayout = gpuDevice.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.FRAGMENT,
					buffer: {
						type: 'uniform',
					},
				},
				{
					binding: 1,
					visibility: GPUShaderStage.FRAGMENT,
					sampler: {
						type: 'filtering',
					},
				},
				{
					binding: 2,
					visibility: GPUShaderStage.FRAGMENT,
					texture: {}
				}
			]
		});
		this.setPipeline(postEffectManager)
	}
}

export default PostEffectHueSaturation

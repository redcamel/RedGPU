import RedGPUContext from "../../context/RedGPUContext";
import createUUID from "../../utils/createUUID";

class PackedTexture {
	#redGPUContext: RedGPUContext;
	#pipeline: GPURenderPipeline;
	#sampler: GPUSampler;
	#gpuTexture: GPUTexture
	#gpuDevice: GPUDevice

	constructor(redGPUContext: RedGPUContext,) {
		this.#redGPUContext = redGPUContext;
		this.#gpuDevice = redGPUContext.gpuDevice;
		this.#pipeline = this.#createPipeline();
		this.#sampler = this.#createSampler();
	}

	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	async packing(
		textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture },
		width: number,
		height: number,
		label?: string
	) {
		const textureDescriptor: GPUTextureDescriptor = {
			size: [width, height, 1],
			format: 'rgba8unorm',
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
			label: label || `packedTexture_${createUUID()}'`
		};
		if (this.#gpuTexture) {
			this.#gpuTexture.destroy()
			this.#gpuTexture = null
		}
		const packedTexture = this.#gpuDevice.createTexture(textureDescriptor);
		const bindGroupEntries = [
			{
				binding: 0,
				resource: textures.r ? textures.r.createView({label: textures.r.label}) : this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{
				binding: 1,
				resource: textures.g ? textures.g.createView({label: textures.g.label}) : this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{
				binding: 2,
				resource: textures.b ? textures.b.createView({label: textures.b.label}) : this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{
				binding: 3,
				resource: textures.a ? textures.a.createView({label: textures.a.label}) : this.#redGPUContext.resourceManager.emptyBitmapTextureView
			},
			{binding: 4, resource: this.#sampler},
		];
		const bindGroup = this.#gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: bindGroupEntries,
		});
		const commandEncoder = this.#gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginRenderPass({
			colorAttachments: [
				{
					view: packedTexture.createView({label: packedTexture.label,}),
					loadOp: 'clear',
					storeOp: 'store',
					clearValue: [0, 0, 0, 0],
				},
			],
		});
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.setBindGroup(0, bindGroup);
		passEncoder.draw(6, 1, 0, 0);
		passEncoder.end();
		this.#gpuDevice.queue.submit([commandEncoder.finish()]);
		console.log('packedTexture2', packedTexture)
		this.#gpuTexture = packedTexture;
	}

	#createPipeline(): GPURenderPipeline {
		const shaderCode = `
	struct VertexOut {
		@builtin(position) position : vec4<f32>,
		@location(0) uv : vec2<f32>,
	};

	@vertex
	fn vertexMain(@builtin(vertex_index) VertexIndex : u32) -> VertexOut {
		var pos = array<vec2<f32>, 6>(
			vec2(-1.0, -1.0),
			vec2( 1.0, -1.0),
			vec2(-1.0,  1.0),
			vec2(-1.0,  1.0),
			vec2( 1.0, -1.0),
			vec2( 1.0,  1.0)
		);

		var uv = array<vec2<f32>, 6>(
			vec2(0.0, 1.0),
			vec2(1.0, 1.0),
			vec2(0.0, 0.0),
			vec2(0.0, 0.0),
			vec2(1.0, 1.0),
			vec2(1.0, 0.0)
		);

		var output : VertexOut;
		output.position = vec4(pos[VertexIndex], 0.0, 1.0);
		output.uv = uv[VertexIndex];
		return output;
	}


	@group(0) @binding(0) var textureR: texture_2d<f32>;
	@group(0) @binding(1) var textureG: texture_2d<f32>;
	@group(0) @binding(2) var textureB: texture_2d<f32>;
	@group(0) @binding(3) var textureA: texture_2d<f32>;
	@group(0) @binding(4) var sampler0: sampler;

	@fragment
	fn main(input: VertexOut) -> @location(0) vec4<f32> {
		let r = textureSample(textureR, sampler0, input.uv).r;
		let g = textureSample(textureG, sampler0, input.uv).g;
		let b = textureSample(textureB, sampler0, input.uv).b;
		let a = textureSample(textureA, sampler0, input.uv).a;

		return vec4(
			r,
			g,
			b,
			a
		);
	}
	`;
		return this.#gpuDevice.createRenderPipeline({
			layout: 'auto',
			vertex: {
				module: this.#gpuDevice.createShaderModule({code: shaderCode}),
				entryPoint: 'vertexMain',
			},
			fragment: {
				module: this.#gpuDevice.createShaderModule({code: shaderCode}),
				entryPoint: 'main',
				targets: [{format: 'rgba8unorm'}],
			},
			primitive: {topology: 'triangle-list'},
		});
	}

	#createSampler(): GPUSampler {
		return this.#gpuDevice.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
		});
	}
}

export default PackedTexture;

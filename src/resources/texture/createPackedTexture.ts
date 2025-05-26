import RedGPUContext from "../../context/RedGPUContext";

async function createPackedTexture(
	redGPUContext: RedGPUContext,
	device: GPUDevice,
	queue: GPUQueue,
	textures: { r: GPUTexture; g: GPUTexture; b: GPUTexture; a?: GPUTexture },
	width: number,
	height: number
): Promise<GPUTexture> {
	const packedTexture = device.createTexture({
		size: [width, height, 1],
		format: 'rgba8unorm',
		usage:
			GPUTextureUsage.RENDER_ATTACHMENT |
			GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.COPY_SRC,
	});

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
			select(1.0, 1.0, ${textures.a ? 'true' : 'false'})
		);
	}
	`;

	const renderPipeline = device.createRenderPipeline({
		layout: 'auto',
		vertex: {
			module: device.createShaderModule({ code: shaderCode }),
			entryPoint: 'vertexMain',
		},
		fragment: {
			module: device.createShaderModule({ code: shaderCode }),
			entryPoint: 'main',
			targets: [{ format: 'rgba8unorm' }],
		},
		primitive: { topology: 'triangle-list' },
	});

	const sampler = device.createSampler({
		magFilter: 'linear',
		minFilter: 'linear',
	});

	const bindGroupEntries = [
		{ binding: 0, resource: textures.r ? textures.r.createView() : redGPUContext.resourceManager.emptyBitmapTextureView },
		{ binding: 1, resource: textures.g ? textures.g.createView() : redGPUContext.resourceManager.emptyBitmapTextureView },
		{ binding: 2, resource: textures.b ? textures.b.createView() : redGPUContext.resourceManager.emptyBitmapTextureView },
		{ binding: 4, resource: sampler },
	];

	if (textures.a) {
		bindGroupEntries.push({ binding: 3, resource: textures.a.createView() });
	} else {
		const emptyTexture = device.createTexture({
			size: [1, 1],
			format: 'rgba8unorm',
			usage: GPUTextureUsage.TEXTURE_BINDING,
		});
		bindGroupEntries.push({ binding: 3, resource: emptyTexture.createView() });
	}

	const bindGroup = device.createBindGroup({
		layout: renderPipeline.getBindGroupLayout(0),
		entries: bindGroupEntries,
	});

	const commandEncoder = device.createCommandEncoder();
	const passEncoder = commandEncoder.beginRenderPass({
		colorAttachments: [
			{
				view: packedTexture.createView(),
				loadOp: 'clear',
				storeOp: 'store',
				clearValue: [0, 0, 0, 0],
			},
		],
	});

	passEncoder.setPipeline(renderPipeline);
	passEncoder.setBindGroup(0, bindGroup);
	passEncoder.draw(6, 1, 0, 0);
	passEncoder.end();

	queue.submit([commandEncoder.finish()]);

	return packedTexture;
}
export default createPackedTexture;

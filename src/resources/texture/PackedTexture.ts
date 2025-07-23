import RedGPUContext from "../../context/RedGPUContext";
import {keepLog} from "../../utils";
import createUUID from "../../utils/createUUID";

type ComponentMapping = {
	r?: 'r' | 'g' | 'b' | 'a';  // r 채널에서 사용할 컴포넌트
	g?: 'r' | 'g' | 'b' | 'a';  // g 채널에서 사용할 컴포넌트
	b?: 'r' | 'g' | 'b' | 'a';  // b 채널에서 사용할 컴포넌트
	a?: 'r' | 'g' | 'b' | 'a';  // a 채널에서 사용할 컴포넌트
};

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
	#prevR:GPUTexture
	#prevG:GPUTexture
	#prevB:GPUTexture
	#prevA:GPUTexture
	#prevMappingJson
	async packing(
		textures: { r?: GPUTexture; g?: GPUTexture; b?: GPUTexture; a?: GPUTexture },
		width: number,
		height: number,
		label?: string,
		componentMapping?: ComponentMapping
	) {
		const mapping = {
			r: 'r',
			g: 'g',
			b: 'b',
			a: 'a',
			...componentMapping
		}
		const mappingJson = JSON.stringify(mapping)
		if(mappingJson === this.#prevMappingJson){
			if(
				this.#prevR === textures.r
				&& this.#prevG === textures.g
				&& this.#prevB === textures.b
				&& this.#prevA === textures.a
			){
				// keepLog('packing 다시하지않고 기존꺼씀')
				return
			}
		}
		// keepLog('packing 함')
		this.#prevMappingJson = mappingJson
		this.#prevR = textures.r
		this.#prevG = textures.g
		this.#prevB = textures.b
		this.#prevA = textures.a

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
		// 컴포넌트 매핑 정보를 uniform buffer로 전달
		const mappingBuffer = this.#gpuDevice.createBuffer({
			size: 16, // 4개 컴포넌트 * 4바이트
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		const mappingData = new Uint32Array([
			['r', 'g', 'b', 'a'].indexOf(mapping.r),
			['r', 'g', 'b', 'a'].indexOf(mapping.g),
			['r', 'g', 'b', 'a'].indexOf(mapping.b),
			['r', 'g', 'b', 'a'].indexOf(mapping.a),
		]);
		this.#gpuDevice.queue.writeBuffer(mappingBuffer, 0, mappingData);
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
			{
				binding: 5,
				resource: {buffer: mappingBuffer}
			}
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
		// 임시 버퍼 정리
		mappingBuffer.destroy();
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

	struct ComponentMapping {
		r_component: u32,
		g_component: u32,
		b_component: u32,
		a_component: u32,
	};

	@group(0) @binding(0) var textureR: texture_2d<f32>;
	@group(0) @binding(1) var textureG: texture_2d<f32>;
	@group(0) @binding(2) var textureB: texture_2d<f32>;
	@group(0) @binding(3) var textureA: texture_2d<f32>;
	@group(0) @binding(4) var sampler0: sampler;
	@group(0) @binding(5) var<uniform> mapping: ComponentMapping;

	fn getComponent(color: vec4<f32>, componentIndex: u32) -> f32 {
		switch componentIndex {
			case 0u: { return color.r; }
			case 1u: { return color.g; }
			case 2u: { return color.b; }
			case 3u: { return color.a; }
			default: { return 0.0; }
		}
	}

	@fragment
	fn main(input: VertexOut) -> @location(0) vec4<f32> {
		let colorR = textureSample(textureR, sampler0, input.uv);
		let colorG = textureSample(textureG, sampler0, input.uv);
		let colorB = textureSample(textureB, sampler0, input.uv);
		let colorA = textureSample(textureA, sampler0, input.uv);

		let r = getComponent(colorR, mapping.r_component);
		let g = getComponent(colorG, mapping.g_component);
		let b = getComponent(colorB, mapping.b_component);
		let a = getComponent(colorA, mapping.a_component);

		return vec4(r, g, b, a);
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

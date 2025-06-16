import RedGPUContext from "../../../../context/RedGPUContext";
import GPU_LOAD_OP from "../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../gpuConst/GPU_STORE_OP";
import Sampler from "../../../sampler/Sampler";
import shaderSource from "./shader.wgsl";

const SHADER_MODULE_NAME = 'MODULE_MIP_MAP'
const FRAGMENT_BIND_GROUP_LAYOUT_NAME = 'FRAGMENT_BIND_GROUP_LAYOUT_NAME_MIP_MAP'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_FINAL_MIP_MAP'

class MipmapGenerator {
	readonly #redGPUContext: RedGPUContext
	readonly #sampler: GPUSampler
	#pipelineLayout: GPUPipelineLayout
	readonly #pipelines: { [key: string]: GPURenderPipeline }
	#bindGroupLayout: GPUBindGroupLayout
	#mipmapShaderModule: GPUShaderModule
	readonly #textureViewCache: Map<GPUTexture, Map<number, Map<number, GPUTextureView>>> = new Map();
	readonly #bindGroupCache: Map<GPUTextureView, GPUBindGroup> = new Map();

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'}).gpuSampler
		this.#pipelines = {};
	}

	getTextureView(texture: GPUTexture, baseMipLevel: number, baseArrayLayer: number): GPUTextureView {
		// 텍스쳐에 대한 캐시맵이 없으면 생성
		if (!this.#textureViewCache.has(texture)) {
			this.#textureViewCache.set(texture, new Map());
		}
		const mipLevelMap = this.#textureViewCache.get(texture)!;
		// 해당 밉맵 레벨에 대한 캐시맵이 없으면 생성
		if (!mipLevelMap.has(baseMipLevel)) {
			mipLevelMap.set(baseMipLevel, new Map());
		}
		const arrayLayerMap = mipLevelMap.get(baseMipLevel)!;
		// 해당 배열 레이어에 대한 뷰가 없으면 생성하고 캐시에 저장
		if (!arrayLayerMap.has(baseArrayLayer)) {
			const view = texture.createView({
				baseMipLevel,
				mipLevelCount: 1,
				dimension: '2d',
				baseArrayLayer,
				arrayLayerCount: 1,
				label: `mipmap_${baseMipLevel}_${baseArrayLayer}_${texture.label}`
			});
			arrayLayerMap.set(baseArrayLayer, view);
		}
		return arrayLayerMap.get(baseArrayLayer)!;
	}

	getBindGroup(textureView: GPUTextureView): GPUBindGroup {
		if (!this.#bindGroupCache.has(textureView)) {
			const {gpuDevice} = this.#redGPUContext;
			const bindGroup = gpuDevice.createBindGroup({
				layout: this.#bindGroupLayout,
				entries: [{
					binding: 0,
					resource: this.#sampler,
				}, {
					binding: 1,
					resource: textureView,
				}],
			});
			this.#bindGroupCache.set(textureView, bindGroup);
		}
		return this.#bindGroupCache.get(textureView)!;
	}

	// 캐시 정리 메서드
	clearCaches(texture?: GPUTexture) {
		if (texture) {
			// 특정 텍스쳐에 대한 텍스쳐 뷰를 찾아서 관련 바인드 그룹도 함께 제거
			if (this.#textureViewCache.has(texture)) {
				const mipLevelMaps = this.#textureViewCache.get(texture)!;
				for (const mipLevelMap of mipLevelMaps.values()) {
					for (const textureView of mipLevelMap.values()) {
						this.#bindGroupCache.delete(textureView);
					}
				}
				this.#textureViewCache.delete(texture);
			}
		} else {
			// 모든 캐시 정리
			this.#textureViewCache.clear();
			this.#bindGroupCache.clear();
		}
	}

	getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline {
		const {gpuDevice, resourceManager} = this.#redGPUContext
		let pipeline = this.#pipelines[format];
		if (!pipeline) {
			if (!this.#mipmapShaderModule) {
				this.#mipmapShaderModule = resourceManager.createGPUShaderModule(
					SHADER_MODULE_NAME,
					{code: shaderSource}
				)
				this.#bindGroupLayout = resourceManager.createBindGroupLayout(
					FRAGMENT_BIND_GROUP_LAYOUT_NAME,
					{
						entries: [
							{binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {}},
							{binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}}
						]
					}
				)
				this.#pipelineLayout = resourceManager.createGPUPipelineLayout(
					PIPELINE_DESCRIPTOR_LABEL,
					{
						bindGroupLayouts: [this.#bindGroupLayout],
					}
				)
			}
			pipeline = gpuDevice.createRenderPipeline({
				layout: this.#pipelineLayout,
				vertex: {
					module: this.#mipmapShaderModule,
					entryPoint: 'vertexMain',
				},
				fragment: {
					module: this.#mipmapShaderModule,
					entryPoint: 'fragmentMain',
					targets: [{format}],
				}
			});
			this.#pipelines[format] = pipeline;
		}
		return pipeline;
	}

	/**
	 *
	 * @param texture
	 * @param textureDescriptor
	 */
	generateMipmap(texture: GPUTexture, textureDescriptor: GPUTextureDescriptor) {
		const {gpuDevice,} = this.#redGPUContext
		// console.log(textureDescriptor.format)
		const pipeline: GPURenderPipeline = this.getMipmapPipeline(textureDescriptor.format);
		if (textureDescriptor.dimension == '3d' || textureDescriptor.dimension == '1d') {
			throw new Error('Generating mipmaps for non-2d textures is currently unsupported!');
		}
		let mipTexture = texture;
		const W = textureDescriptor.size[0]
		const H = textureDescriptor.size[1]
		const depthOrArrayLayers = textureDescriptor.size[2]
		const arrayLayerCount = depthOrArrayLayers || 1;
		const renderToSource = textureDescriptor.usage & GPUTextureUsage.RENDER_ATTACHMENT;
		if (!renderToSource) {
			const mipTextureDescriptor = {
				size: {
					width: Math.max(1, W >>> 1),
					height: Math.max(1, H >>> 1),
					depthOrArrayLayers: arrayLayerCount,
				},
				format: textureDescriptor.format,
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
				mipLevelCount: textureDescriptor.mipLevelCount - 1,
			};
			mipTexture = gpuDevice.createTexture(mipTextureDescriptor);
		}
		const commandEncoder = gpuDevice.createCommandEncoder({});
		for (let arrayLayer = 0; arrayLayer < arrayLayerCount; ++arrayLayer) {
			let srcView: GPUTextureView = this.getTextureView(texture, 0, arrayLayer);
			let dstMipLevel = renderToSource ? 1 : 0;
			for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
				const dstView: GPUTextureView = this.getTextureView(mipTexture, dstMipLevel++, arrayLayer);
				const passEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass({
					colorAttachments: [{
						view: dstView,
						clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
						loadOp: GPU_LOAD_OP.CLEAR,
						storeOp: GPU_STORE_OP.STORE
					}],
				});
				const bindGroup: GPUBindGroup = this.getBindGroup(srcView);
				passEncoder.setPipeline(pipeline);
				passEncoder.setBindGroup(0, bindGroup);
				passEncoder.draw(3, 1, 0, 0);
				passEncoder.end();
				srcView = dstView;
			}
		}
		// If we didn't render to the source texture, finish by copying the mip results from the temporary mipmap texture
		// to the source.
		if (!renderToSource) {
			const mipLevelSize = {
				width: Math.max(1, W >>> 1),
				height: Math.max(1, H >>> 1),
				depthOrArrayLayers: arrayLayerCount,
			};
			for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
				commandEncoder.copyTextureToTexture({
					texture: mipTexture,
					mipLevel: i - 1,
				}, {
					texture: texture,
					mipLevel: i,
				}, mipLevelSize);
				mipLevelSize.width = Math.max(1, mipLevelSize.width >>> 1);
				mipLevelSize.height = Math.max(1, mipLevelSize.height >>> 1);
			}
		}
		gpuDevice.queue.submit([commandEncoder.finish()]);
		if (!renderToSource) {
			this.clearCaches(mipTexture);
			mipTexture.destroy();
		}
		return texture;
	}
}

Object.freeze(MipmapGenerator)
export default MipmapGenerator

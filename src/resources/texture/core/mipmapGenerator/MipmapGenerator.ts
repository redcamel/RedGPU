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
	#tempViewCache: Map<string, GPUTextureView> = new Map();
	#tempBindGroupCache: Map<string, GPUBindGroup> = new Map();

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'}).gpuSampler
		this.#pipelines = {};
	}

	createTextureView(texture: GPUTexture, baseMipLevel: number, baseArrayLayer: number): GPUTextureView {
		const key = `${texture.label}_${baseMipLevel}_${baseArrayLayer}`;

		if (!this.#tempViewCache.has(key)) {
			const view = texture.createView({
				baseMipLevel,
				mipLevelCount: 1,
				dimension: '2d',
				baseArrayLayer,
				arrayLayerCount: 1,
				label: key
			});
			this.#tempViewCache.set(key, view);
		}

		return this.#tempViewCache.get(key)!;
	}


	createBindGroup(textureView: GPUTextureView): GPUBindGroup {
		const {gpuDevice} = this.#redGPUContext;
		return gpuDevice.createBindGroup({
			label: `${textureView.label}_bindGroup_${Date.now()}`,
			layout: this.#bindGroupLayout,
			entries: [{
				binding: 0,
				resource: this.#sampler,
			}, {
				binding: 1,
				resource: textureView,
			}],
		});
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
				label: `MipmapGenerator_Pipeline_${format}`,
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
	 * 밉맵 생성 메서드
	 */
	generateMipmap(texture: GPUTexture, textureDescriptor: GPUTextureDescriptor) {
		this.#clearTempCaches();

		const {gpuDevice} = this.#redGPUContext
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
			// 매번 새로운 뷰와 바인드그룹 생성
			let srcView: GPUTextureView = this.createTextureView(texture, 0, arrayLayer);
			let dstMipLevel = renderToSource ? 1 : 0;
			for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
				const dstView: GPUTextureView = this.createTextureView(mipTexture, dstMipLevel++, arrayLayer);
				const passEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass({
					colorAttachments: [{
						view: dstView,
						clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
						loadOp: GPU_LOAD_OP.CLEAR,
						storeOp: GPU_STORE_OP.STORE
					}],
				});
				// 매번 새로운 바인드그룹 생성
				const bindGroup: GPUBindGroup = this.createBindGroup(srcView);
				passEncoder.setPipeline(pipeline);
				passEncoder.setBindGroup(0, bindGroup);
				passEncoder.draw(3, 1, 0, 0);
				passEncoder.end();
				srcView = dstView;
			}
		}
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
			mipTexture.destroy();
		}
		this.#clearTempCaches();

		return texture;
	}
	#clearTempCaches() {
		this.#tempViewCache.clear();
		this.#tempBindGroupCache.clear();
	}

	destroy() {
	}
}

Object.freeze(MipmapGenerator)
export default MipmapGenerator

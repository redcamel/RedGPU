import RedGPUContext from "../../../../context/RedGPUContext";
import GPU_LOAD_OP from "../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../gpuConst/GPU_STORE_OP";
import Sampler from "../../../sampler/Sampler";
import shaderSource from "./shader.wgsl";

class MipmapGenerator {
	readonly #redGPUContext: RedGPUContext
	readonly #sampler: GPUSampler
	#pipelineLayout: GPUPipelineLayout
	readonly #pipelines: { [key: string]: GPURenderPipeline }
	#bindGroupLayout: GPUBindGroupLayout
	#mipmapShaderModule: GPUShaderModule
	#tempViewCache: Map<string, GPUTextureView> = new Map();
	#tempBindGroupCache: Map<string, GPUBindGroup> = new Map();
	// WeakMap을 사용한 바인드 그룹 캐시 (GPUTexture 키로 사용)
	#persistentBindGroupCache: WeakMap<GPUTexture, {bindGroup:GPUBindGroup,textureView:GPUTextureView}> = new WeakMap();
	// 텍스처 뷰용 persistent 캐시 추가
	#persistentViewCache: Map<string, GPUTextureView> = new Map();

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'}).gpuSampler
		this.#pipelines = {};
	}

	createTextureView(texture: GPUTexture, baseMipLevel: number, baseArrayLayer: number, useCache: boolean = false): GPUTextureView {
		const key = `MIPMAP_GENERATOR_${texture.label}_${baseMipLevel}_${baseArrayLayer}`;

		if (useCache) {
			// persistent 캐시 확인
			if (this.#persistentViewCache.has(key)) {
				return this.#persistentViewCache.get(key)!;
			}

			const view = texture.createView({
				baseMipLevel,
				mipLevelCount: 1,
				dimension: '2d',
				baseArrayLayer,
				arrayLayerCount: 1,
				label: key
			});

			// persistent 캐시에 저장
			this.#persistentViewCache.set(key, view);
			return view;
		} else {
			// 기존 temp 캐시 로직
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
	}

	createBindGroup(texture: GPUTexture, textureView: GPUTextureView, useCache: boolean = false): GPUBindGroup {
		const {gpuDevice} = this.#redGPUContext;

		if (useCache) {
			// WeakMap에서 캐시된 바인드 그룹 확인
			if (this.#persistentBindGroupCache.has(texture)) {
				return this.#persistentBindGroupCache.get(texture).bindGroup;
			}

			const bindGroup = gpuDevice.createBindGroup({
				label: `MIPMAP_GENERATOR_BIND_GROUP_CACHED_${texture.label}`,
				layout: this.#bindGroupLayout,
				entries: [{
					binding: 0,
					resource: this.#sampler,
				}, {
					binding: 1,
					resource: textureView,
				}],
			});

			// WeakMap에 캐시
			this.#persistentBindGroupCache.set(texture, {
				bindGroup,
				textureView,
			});
			return bindGroup;
		} else {
			return gpuDevice.createBindGroup({
				label: `MIPMAP_GENERATOR_BIND_GROUP_${Date.now()}`,
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
	}

	getMipmapPipeline(format: GPUTextureFormat): GPURenderPipeline {
		const {gpuDevice, resourceManager} = this.#redGPUContext
		let pipeline = this.#pipelines[format];
		if (!pipeline) {
			if (!this.#mipmapShaderModule) {
				this.#mipmapShaderModule = resourceManager.createGPUShaderModule(
					'MIPMAP_GENERATOR_SHADER_MODULE',
					{code: shaderSource}
				)
				this.#bindGroupLayout = resourceManager.createBindGroupLayout(
					'MIPMAP_GENERATOR_FRAGMENT_BIND_GROUP_LAYOUT',
					{
						entries: [
							{binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {}},
							{binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}}
						]
					}
				)
				this.#pipelineLayout = resourceManager.createGPUPipelineLayout(
					'MIPMAP_GENERATOR_PIPELINE_LAYOUT',
					{
						bindGroupLayouts: [this.#bindGroupLayout],
					}
				)
			}
			pipeline = gpuDevice.createRenderPipeline({
				label: `MIPMAP_GENERATOR_PIPELINE_${format}`,
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
	generateMipmap(texture: GPUTexture, textureDescriptor: GPUTextureDescriptor, useCache: boolean = false) {
		// useCache가 false일 때만 temp 캐시 클리어
		if (!useCache) {
			this.#clearTempCaches();
		}

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
			let srcView: GPUTextureView = this.createTextureView(texture, 0, arrayLayer, useCache);
			let dstMipLevel = renderToSource ? 1 : 0;
			for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) {
				const dstView: GPUTextureView = this.createTextureView(mipTexture, dstMipLevel++, arrayLayer, useCache);
				const passEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass({
					colorAttachments: [{
						view: dstView,
						clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
						loadOp: GPU_LOAD_OP.CLEAR,
						storeOp: GPU_STORE_OP.STORE
					}],
				});
				// useCache 매개변수에 따라 바인드그룹 캐시 사용 여부 결정
				const bindGroup: GPUBindGroup = this.createBindGroup(texture, srcView, useCache);
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

		// useCache가 false일 때만 temp 캐시 클리어
		if (!useCache) {
			this.#clearTempCaches();
		}

		return texture;
	}

	#clearTempCaches() {
		this.#tempViewCache.clear();
		this.#tempBindGroupCache.clear();
	}

	destroy() {
		// persistent 캐시도 정리
		this.#persistentViewCache.clear();
		// WeakMap은 자동으로 가비지 컬렉션되므로 별도 정리 불필요
	}
}

Object.freeze(MipmapGenerator)
export default MipmapGenerator

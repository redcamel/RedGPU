import RedGPUContext from "../../../../context/RedGPUContext";
import GPU_LOAD_OP from "../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../gpuConst/GPU_STORE_OP";
import getMipLevelCount from "../../../../utils/math/getMipLevelCount";
import Sampler from "../../../sampler/Sampler";
import parseWGSL from "../../../wgslParser/parseWGSL";
import shaderSource from "./shader.wgsl";
import cubemapDownsampleCode from "./cubemapDownsample.wgsl";

const SHADER_MODULE_NAME = 'MODULE_MIP_MAP'
const FRAGMENT_BIND_GROUP_LAYOUT_NAME = 'FRAGMENT_BIND_GROUP_LAYOUT_NAME_MIP_MAP'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_FINAL_MIP_MAP'

// 큐브맵 다운샘플링 관련 상수
const CUBEMAP_DOWNSAMPLER_SHADER_NAME = 'CUBEMAP_DOWNSAMPLER_COMPUTE'
const CUBEMAP_DOWNSAMPLER_BIND_GROUP_LAYOUT = 'CUBEMAP_DOWNSAMPLER_BIND_GROUP_LAYOUT'

class MipmapGenerator {
	readonly #redGPUContext: RedGPUContext
	readonly #sampler: GPUSampler
	#pipelineLayout: GPUPipelineLayout
	readonly #pipelines: { [key: string]: GPURenderPipeline }
	#bindGroupLayout: GPUBindGroupLayout
	#mipmapShaderModule: GPUShaderModule
	readonly #textureViewCache: Map<GPUTexture, Map<number, Map<number, GPUTextureView>>> = new Map();
	readonly #bindGroupCache: Map<GPUTextureView, GPUBindGroup> = new Map();

	// 큐브맵 다운샘플링 관련 필드
	#cubemapComputePipelines: Map<GPUTextureFormat, GPUComputePipeline> = new Map();
	#cubemapBindGroupLayouts: Map<GPUTextureFormat, GPUBindGroupLayout> = new Map();
	#cubemapShaderModule: GPUShaderModule | null = null;
	#cubemapUniformBuffer: GPUBuffer | null = null;
	#cubemapUniformStructInfo: any = null;
	#cubemapSampler: GPUSampler | null = null;

	readonly #COMPUTE_WORKGROUP_SIZE_X = 8;
	readonly #COMPUTE_WORKGROUP_SIZE_Y = 8;

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
	 * 큐브맵 다운샘플링 초기화
	 */
	#initCubemapDownsampler() {
		if (this.#cubemapShaderModule) return; // 이미 초기화됨

		const {gpuDevice, resourceManager} = this.#redGPUContext;

		// 큐브맵 전용 샘플러 생성
		this.#cubemapSampler = new Sampler(this.#redGPUContext, {
			minFilter: 'linear',
			magFilter: 'linear',
			mipmapFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
			addressModeW: 'clamp-to-edge'
		}).gpuSampler;

		// 셰이더 모듈 생성
		this.#cubemapShaderModule = resourceManager.createGPUShaderModule(
			CUBEMAP_DOWNSAMPLER_SHADER_NAME,
			{ code: cubemapDownsampleCode }
		);

		// 유니폼 버퍼 초기화
		this.#initCubemapUniforms();
	}

	/**
	 * 포맷별 큐브맵 컴퓨트 파이프라인 생성
	 */
	#getCubemapComputePipeline(format: GPUTextureFormat): GPUComputePipeline {
		if (!this.#cubemapComputePipelines.has(format)) {
			const {gpuDevice, resourceManager} = this.#redGPUContext;

			// 포맷별 바인드 그룹 레이아웃 생성
			const bindGroupLayout = resourceManager.createBindGroupLayout(
				`${CUBEMAP_DOWNSAMPLER_BIND_GROUP_LAYOUT}_${format}`,
				{
					entries: [
						{
							binding: 0,
							visibility: GPUShaderStage.COMPUTE,
							texture: {
								viewDimension: 'cube',
								sampleType: 'float'
							}
						},
						{
							binding: 1,
							visibility: GPUShaderStage.COMPUTE,
							storageTexture: {
								format: format,
								viewDimension: '2d-array'
							}
						},
						{
							binding: 2,
							visibility: GPUShaderStage.COMPUTE,
							sampler: { type: 'filtering' }
						},
						{
							binding: 3,
							visibility: GPUShaderStage.COMPUTE,
							buffer: { type: 'uniform' }
						}
					]
				}
			);

			// 컴퓨트 파이프라인 생성
			const computePipeline = gpuDevice.createComputePipeline({
				layout: gpuDevice.createPipelineLayout({
					bindGroupLayouts: [bindGroupLayout]
				}),
				compute: {
					module: this.#cubemapShaderModule!,
					entryPoint: 'main'
				}
			});

			this.#cubemapBindGroupLayouts.set(format, bindGroupLayout);
			this.#cubemapComputePipelines.set(format, computePipeline);
		}

		return this.#cubemapComputePipelines.get(format)!;
	}

	#initCubemapUniforms() {
		const {gpuDevice} = this.#redGPUContext;

		// 유니폼 구조체 정의 (수동으로 정의)
		this.#cubemapUniformStructInfo = {
			arrayBufferByteLength: 16, // 4개 float32 = 16 bytes
			properties: {
				targetSize: { byteOffset: 0, size: 4 },
				sourceMipLevel: { byteOffset: 4, size: 4 },
				targetMipLevel: { byteOffset: 8, size: 4 },
				padding: { byteOffset: 12, size: 4 }
			}
		};

		// 유니폼 버퍼 생성
		this.#cubemapUniformBuffer = gpuDevice.createBuffer({
			size: this.#cubemapUniformStructInfo.arrayBufferByteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: 'MipmapGenerator_CubemapDownsampler_UniformBuffer'
		});
	}

	/**
	 * 큐브맵 다운샘플링 메서드
	 * @param sourceCubemap 소스 큐브맵 텍스처
	 * @param targetSize 타겟 크기 (기본값: 256)
	 * @param format 텍스처 포맷 (기본값: 'rgba8unorm')
	 * @returns 다운샘플링된 큐브맵 텍스처
	 */
	async downsampleCubemap(
		sourceCubemap: GPUTexture,
		targetSize: number = 256,
		format: GPUTextureFormat = 'rgba8unorm'
	): Promise<GPUTexture> {
		try {
			// 초기화
			this.#initCubemapDownsampler();

			const {gpuDevice} = this.#redGPUContext;

			// 입력 검증
			if (!sourceCubemap ) {
				throw new Error('Invalid source cubemap texture');
			}

			if (targetSize <= 0 || !Number.isInteger(targetSize)) {
				throw new Error('Target size must be a positive integer');
			}

			const sourceMipLevels = sourceCubemap.mipLevelCount;
			const targetMipLevels = getMipLevelCount(targetSize, targetSize);

			console.log(`큐브맵 다운샘플링 시작: ${sourceCubemap.width}x${sourceCubemap.width} → ${targetSize}x${targetSize}`);

			// 타겟 큐브맵 생성 (밉맵 포함)
			const targetCubemap = gpuDevice.createTexture({
				size: [targetSize, targetSize, 6],
				format: format,
				usage: GPUTextureUsage.STORAGE_BINDING |
					GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.RENDER_ATTACHMENT,
				dimension: '2d',
				mipLevelCount: targetMipLevels,
				label: `MipmapGenerator_CubemapDownsampler_${targetSize}x${targetSize}_${targetMipLevels}mips_${Date.now()}`
			});

			// 각 밉맵 레벨별로 다운샘플링
			for (let mipLevel = 0; mipLevel < targetMipLevels; mipLevel++) {
				const currentTargetSize = Math.max(1, targetSize >> mipLevel);
				const sourceMipLevel = this.#calculateSourceMipLevel(
					sourceCubemap.width,
					targetSize,
					mipLevel,
					sourceMipLevels
				);

				console.log(`밉레벨 ${mipLevel}/${targetMipLevels-1} 처리 중... (크기: ${currentTargetSize}x${currentTargetSize})`);

				await this.#downsampleCubemapMipLevel(
					sourceCubemap,
					targetCubemap,
					sourceMipLevel,
					mipLevel,
					currentTargetSize,
					format
				);
			}

			console.log('큐브맵 다운샘플링 완료');
			return targetCubemap;

		} catch (error) {
			console.error('큐브맵 다운샘플링 실패:', error);
			throw error;
		}
	}

	#calculateSourceMipLevel(
		sourceSize: number,
		targetSize: number,
		targetMipLevel: number,
		sourceMipLevels: number
	): number {
		// 현재 타겟 밉레벨의 실제 크기
		const currentTargetSize = Math.max(1, targetSize >> targetMipLevel);

		// 소스에서 해당 크기에 맞는 밉레벨 계산
		const scaleFactor = sourceSize / currentTargetSize;
		const sourceMipLevel = Math.max(0, Math.floor(Math.log2(scaleFactor)));

		return Math.min(sourceMipLevel, sourceMipLevels - 1);
	}

	async #downsampleCubemapMipLevel(
		sourceCubemap: GPUTexture,
		targetCubemap: GPUTexture,
		sourceMipLevel: number,
		targetMipLevel: number,
		targetSize: number,
		format: GPUTextureFormat
	): Promise<void> {
		const {gpuDevice} = this.#redGPUContext;

		// 포맷별 파이프라인 및 바인드 그룹 레이아웃 가져오기
		const computePipeline = this.#getCubemapComputePipeline(format);
		const bindGroupLayout = this.#cubemapBindGroupLayouts.get(format)!;

		// 바인드 그룹 생성
		const bindGroup = gpuDevice.createBindGroup({
			layout: bindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: sourceCubemap.createView({
						dimension: 'cube',
						baseMipLevel: sourceMipLevel,
						mipLevelCount: 1
					})
				},
				{
					binding: 1,
					resource: targetCubemap.createView({
						dimension: '2d-array',
						baseMipLevel: targetMipLevel,
						mipLevelCount: 1,
						arrayLayerCount: 6
					})
				},
				{
					binding: 2,
					resource: this.#cubemapSampler!
				},
				{
					binding: 3,
					resource: { buffer: this.#cubemapUniformBuffer! }
				}
			]
		});

		// 유니폼 업데이트
		this.#updateCubemapUniforms(sourceMipLevel, targetMipLevel, targetSize);

		// 컴퓨트 패스 실행
		const commandEncoder = gpuDevice.createCommandEncoder({
			label: `MipmapGenerator_CubemapDownsampler_CommandEncoder_Mip${targetMipLevel}`
		});

		const computePassEncoder = commandEncoder.beginComputePass({
			label: `MipmapGenerator_CubemapDownsampler_ComputePass_Mip${targetMipLevel}`
		});

		computePassEncoder.setPipeline(computePipeline);
		computePassEncoder.setBindGroup(0, bindGroup);
		computePassEncoder.dispatchWorkgroups(
			Math.ceil(targetSize / this.#COMPUTE_WORKGROUP_SIZE_X),
			Math.ceil(targetSize / this.#COMPUTE_WORKGROUP_SIZE_Y),
			6  // 6개 면
		);

		computePassEncoder.end();

		// 명령 제출 및 완료 대기
		const commandBuffer = commandEncoder.finish();
		gpuDevice.queue.submit([commandBuffer]);

		// GPU 작업 완료 대기 (중요!)
		await gpuDevice.queue.onSubmittedWorkDone();
	}

	#updateCubemapUniforms(
		sourceMipLevel: number,
		targetMipLevel: number,
		targetSize: number
	) {
		const {gpuDevice} = this.#redGPUContext;

		// 유니폼 데이터 업데이트
		const uniformData = new Float32Array([
			targetSize,        // targetSize
			sourceMipLevel,    // sourceMipLevel
			targetMipLevel,    // targetMipLevel
			0                  // padding
		]);

		gpuDevice.queue.writeBuffer(
			this.#cubemapUniformBuffer!,
			0,
			uniformData
		);
	}

	/**
	 * 기존 generateMipmap 메서드 (변경 없음)
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

	/**
	 * 정리 메서드
	 */
	destroy() {
		this.clearCaches();
		if (this.#cubemapUniformBuffer) {
			this.#cubemapUniformBuffer.destroy();
			this.#cubemapUniformBuffer = null;
		}

		// 큐브맵 관련 리소스 정리
		this.#cubemapComputePipelines.clear();
		this.#cubemapBindGroupLayouts.clear();
		this.#cubemapShaderModule = null;
		this.#cubemapSampler = null;
	}
}

Object.freeze(MipmapGenerator)
export default MipmapGenerator

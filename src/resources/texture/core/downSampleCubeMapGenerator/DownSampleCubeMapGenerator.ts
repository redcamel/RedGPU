import RedGPUContext from "../../../../context/RedGPUContext";
import getMipLevelCount from "../../../../utils/math/getMipLevelCount";
import Sampler from "../../../sampler/Sampler";
import cubemapDownsampleCode from "./cubemapDownsample.wgsl";

class DownSampleCubeMapGenerator {
	readonly #redGPUContext: RedGPUContext

	#cubemapComputePipelines: Map<GPUTextureFormat, GPUComputePipeline> = new Map();
	#cubemapBindGroupLayouts: Map<GPUTextureFormat, GPUBindGroupLayout> = new Map();
	#cubemapShaderModule: GPUShaderModule | null = null;
	#cubemapUniformBuffer: GPUBuffer | null = null;
	#cubemapUniformStructInfo: any = null;
	#cubemapSampler: GPUSampler | null = null;
	readonly #COMPUTE_WORKGROUP_SIZE_X = 8;
	readonly #COMPUTE_WORKGROUP_SIZE_Y = 8;
	#tempViewCache: Map<string, GPUTextureView> = new Map();
	#tempBindGroupCache: Map<string, GPUBindGroup> = new Map();

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
	}

	createSourceTextureView(sourceCubemap: GPUTexture, sourceMipLevel: number): GPUTextureView {
		const key = `DOWN_SAMPLE_CUBE_GENERATOR_SOURCE_VIEW_${sourceCubemap.label}_${sourceMipLevel}`;

		if (!this.#tempViewCache.has(key)) {
			const view = sourceCubemap.createView({
				label: key,
				dimension: 'cube',
				baseMipLevel: sourceMipLevel,
				mipLevelCount: 1
			});
			this.#tempViewCache.set(key, view);
		}

		return this.#tempViewCache.get(key)!;
	}

	createTargetTextureView(targetCubemap: GPUTexture, targetMipLevel: number): GPUTextureView {
		const key = `DOWN_SAMPLE_CUBE_GENERATOR_TARGET_VIEW_${targetCubemap.label}_${targetMipLevel}`;

		if (!this.#tempViewCache.has(key)) {
			const view = targetCubemap.createView({
				label: key,
				dimension: '2d-array',
				baseMipLevel: targetMipLevel,
				mipLevelCount: 1,
				arrayLayerCount: 6
			});
			this.#tempViewCache.set(key, view);
		}

		return this.#tempViewCache.get(key)!;
	}

	createBindGroup(
		bindGroupLayout: GPUBindGroupLayout,
		sourceView: GPUTextureView,
		targetView: GPUTextureView
	): GPUBindGroup {
		const key = `DOWN_SAMPLE_CUBE_GENERATOR_BIND_GROUP_${sourceView.label}_${targetView.label}`;

		if (!this.#tempBindGroupCache.has(key)) {
			const {gpuDevice} = this.#redGPUContext;
			const bindGroup = gpuDevice.createBindGroup({
				label: key,
				layout: bindGroupLayout,
				entries: [
					{
						binding: 0,
						resource: sourceView
					},
					{
						binding: 1,
						resource: targetView
					},
					{
						binding: 2,
						resource: this.#cubemapSampler
					},
					{
						binding: 3,
						resource: {buffer: this.#cubemapUniformBuffer}
					}
				]
			});
			this.#tempBindGroupCache.set(key, bindGroup);
		}

		return this.#tempBindGroupCache.get(key)!;
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
			// 캐시 초기화
			this.#clearTempCaches();

			// 초기화
			this.#initCubemapDownsampler();
			const {gpuDevice,resourceManager} = this.#redGPUContext;

			// 입력 검증
			if (!sourceCubemap) {
				throw new Error('Invalid source cubemap texture');
			}
			if (targetSize <= 0 || !Number.isInteger(targetSize)) {
				throw new Error('Target size must be a positive integer');
			}

			const sourceMipLevels = sourceCubemap.mipLevelCount;
			const targetMipLevels = getMipLevelCount(targetSize, targetSize);
			console.log(`큐브맵 다운샘플링 시작: ${sourceCubemap.width}x${sourceCubemap.width} → ${targetSize}x${targetSize}`);

			// 타겟 큐브맵 생성 (밉맵 포함)
			const targetCubemap = resourceManager.createManagedTexture({
				size: [targetSize, targetSize, 6],
				format: format,
				usage: GPUTextureUsage.STORAGE_BINDING |
					GPUTextureUsage.TEXTURE_BINDING |
					GPUTextureUsage.RENDER_ATTACHMENT,
				dimension: '2d',
				mipLevelCount: targetMipLevels,
				label: `DOWN_SAMPLE_CUBE_GENERATOR_TEXTURE_${targetSize}x${targetSize}_${targetMipLevels}mips_${Date.now()}`
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
				console.log(`밉레벨 ${mipLevel}/${targetMipLevels - 1} 처리 중... (크기: ${currentTargetSize}x${currentTargetSize})`);

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

			// 캐시 정리
			this.#clearTempCaches();

			return targetCubemap;
		} catch (error) {
			console.error('큐브맵 다운샘플링 실패:', error);
			this.#clearTempCaches();
			throw error;
		}
	}

	/**
	 * 정리 메서드
	 */
	destroy() {
		// 캐시 정리
		this.#clearTempCaches();

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

	/**
	 * 임시 캐시 정리
	 */
	#clearTempCaches() {
		this.#tempViewCache.clear();
		this.#tempBindGroupCache.clear();
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
			'DOWN_SAMPLE_CUBE_GENERATOR_COMPUTE_SHADER',
			{code: cubemapDownsampleCode}
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
				`DOWN_SAMPLE_CUBE_GENERATOR_BIND_GROUP_LAYOUT_${format}`,
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
							sampler: {type: 'filtering'}
						},
						{
							binding: 3,
							visibility: GPUShaderStage.COMPUTE,
							buffer: {type: 'uniform'}
						}
					]
				}
			);

			// 컴퓨트 파이프라인 생성
			const computePipeline = gpuDevice.createComputePipeline({
				label: `DOWN_SAMPLE_CUBE_GENERATOR_COMPUTE_PIPELINE_${format}`,
				layout: gpuDevice.createPipelineLayout({
					label: `DOWN_SAMPLE_CUBE_GENERATOR_PIPELINE_LAYOUT_${format}`,
					bindGroupLayouts: [bindGroupLayout]
				}),
				compute: {
					module: this.#cubemapShaderModule,
					entryPoint: 'main'
				}
			});

			this.#cubemapBindGroupLayouts.set(format, bindGroupLayout);
			this.#cubemapComputePipelines.set(format, computePipeline);
		}
		return this.#cubemapComputePipelines.get(format);
	}

	#initCubemapUniforms() {
		const {gpuDevice,resourceManager} = this.#redGPUContext;

		// 유니폼 구조체 정의
		this.#cubemapUniformStructInfo = {
			arrayBufferByteLength: 16, // 4개 float32 = 16 bytes
			properties: {
				targetSize: {byteOffset: 0, size: 4},
				sourceMipLevel: {byteOffset: 4, size: 4},
				targetMipLevel: {byteOffset: 8, size: 4},
				padding: {byteOffset: 12, size: 4}
			}
		};

		// 유니폼 버퍼 생성
		this.#cubemapUniformBuffer = gpuDevice.createBuffer({
			size: this.#cubemapUniformStructInfo.arrayBufferByteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: 'DOWN_SAMPLE_CUBE_GENERATOR_UNIFORM_BUFFER'
		});
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
		const bindGroupLayout = this.#cubemapBindGroupLayouts.get(format);

		// 캐시된 뷰와 바인드그룹 사용
		const sourceView = this.createSourceTextureView(sourceCubemap, sourceMipLevel);
		const targetView = this.createTargetTextureView(targetCubemap, targetMipLevel);
		const bindGroup = this.createBindGroup(bindGroupLayout, sourceView, targetView);

		// 유니폼 업데이트
		this.#updateCubemapUniforms(sourceMipLevel, targetMipLevel, targetSize);

		// 컴퓨트 패스 실행
		const commandEncoder = gpuDevice.createCommandEncoder({
			label: `DOWN_SAMPLE_CUBE_GENERATOR_COMMAND_ENCODER_MIP${targetMipLevel}`
		});

		const computePassEncoder = commandEncoder.beginComputePass({
			label: `DOWN_SAMPLE_CUBE_GENERATOR_COMPUTE_PASS_MIP${targetMipLevel}`
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

		// GPU 작업 완료 대기
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
			this.#cubemapUniformBuffer,
			0,
			uniformData
		);
	}
}

Object.freeze(DownSampleCubeMapGenerator)
export default DownSampleCubeMapGenerator

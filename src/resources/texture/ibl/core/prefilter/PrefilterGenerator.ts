import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import GPU_LOAD_OP from "../../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../../gpuConst/GPU_STORE_OP";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import IBLCubeTexture from "../IBLCubeTexture";
import prefilterShaderCode from "./prefilterShaderCode.wgsl";

/**
 * [KO] Prefilter 맵을 생성하는 클래스입니다.
 * [EN] Class that generates a Prefilter map.
 *
 * [KO] 큐브맵으로부터 거칠기(Roughness) 단계별로 필터링된 반사광 정보를 추출하여 큐브맵의 밉맵에 저장합니다.
 * [EN] Extracts filtered reflection information for each roughness level from a cubemap and stores it in the cubemap's mipmaps.
 *
 * @category IBL
 */
class PrefilterGenerator {
	readonly #redGPUContext: RedGPUContext;
	#sampler: Sampler;
	#pipeline: GPUComputePipeline;
	#shaderModule: GPUShaderModule;

    /**
     * [KO] PrefilterGenerator 인스턴스를 생성합니다.
     * [EN] Creates a PrefilterGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#sampler = new Sampler(this.#redGPUContext, {
			magFilter: GPU_FILTER_MODE.LINEAR,
			minFilter: GPU_FILTER_MODE.LINEAR,
			addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
		});
	}

	/**
	 * [KO] 소스 큐브 텍스처로부터 프리필터링된 큐브맵을 생성하여 반환합니다.
	 * [EN] Generates and returns a pre-filtered cubemap from the source cube texture.
	 *
	 * ### Example
	 * ```typescript
	 * const prefilteredMap = await redGPUContext.resourceManager.prefilterGenerator.generate(sourceCubeTexture, 512);
	 * ```
	 *
	 * @param sourceCubeTexture -
	 * [KO] 소스 환경맵 (큐브)
	 * [EN] Source environment map (Cube)
	 * @param size -
	 * [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512)
	 * [EN] Size of one side of the generated cubemap (default: 512)
	 * @returns
	 * [KO] 생성된 Prefilter IBLCubeTexture
	 * [EN] Generated Prefilter IBLCubeTexture
	 */
	async generate(sourceCubeTexture: GPUTexture, size: number = 512): Promise<IBLCubeTexture> {
		const { gpuDevice, resourceManager } = this.#redGPUContext;
		const format: GPUTextureFormat = 'rgba16float';
		const mipLevelCount = getMipLevelCount(size, size);

		// 1. 결과용 큐브 텍스처 생성
		const prefilterGPUTexture = resourceManager.createManagedTexture({
			size: [size, size, 6],
			format: format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: mipLevelCount,
			label: `Prefilter_Map_Texture_${createUUID()}`
		});

		// 2. 파이프라인 생성 (지연 생성 및 캐싱)
		if (!this.#shaderModule) {
			this.#shaderModule = resourceManager.createGPUShaderModule(
				'PREFILTER_GENERATOR_SHADER_MODULE',
				{ code: prefilterShaderCode }
			);
		}

		if (!this.#pipeline) {
			this.#pipeline = gpuDevice.createComputePipeline({
				label: 'PREFILTER_GENERATOR_PIPELINE',
				layout: 'auto',
				compute: {
					module: this.#shaderModule,
					entryPoint: 'cs_main'
				},
			});
		}

		// 3. 밉맵 레벨별 연산 (6개 면 포함)
		const commandEncoder = gpuDevice.createCommandEncoder({ label: 'Prefilter_Generator_Command_Encoder' });
		const faceMatrices = this.#getCubeMapFaceMatrices();
		const uniformBuffers: GPUBuffer[] = [];

		for (let mip = 0; mip < mipLevelCount; mip++) {
			const mipSize = Math.max(1, size >> mip);
			const roughness = mip / (mipLevelCount - 1);
			
			const uniformData = new Float32Array(16 * 6 + 4); // faceMatrices(16*6) + roughness(1) + padding(3)
			faceMatrices.forEach((m, i) => uniformData.set(m, i * 16));
			uniformData[16 * 6] = roughness;

			const uniformBuffer = gpuDevice.createBuffer({
				size: uniformData.byteLength,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			});
			gpuDevice.queue.writeBuffer(uniformBuffer, 0, uniformData);
			uniformBuffers.push(uniformBuffer);

			const bindGroup = gpuDevice.createBindGroup({
				layout: this.#pipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: sourceCubeTexture.createView({ dimension: 'cube' }) },
					{ binding: 1, resource: this.#sampler.gpuSampler },
					{ 
						binding: 2, 
						resource: prefilterGPUTexture.createView({ 
							dimension: '2d-array',
							baseMipLevel: mip,
							mipLevelCount: 1
						}) 
					},
					{ binding: 3, resource: { buffer: uniformBuffer } }
				]
			});

			const computePass = commandEncoder.beginComputePass({
				label: `Prefilter_mip_${mip}_compute_pass`
			});
			computePass.setPipeline(this.#pipeline);
			computePass.setBindGroup(0, bindGroup);
			computePass.dispatchWorkgroups(Math.ceil(mipSize / 8), Math.ceil(mipSize / 8), 6);
			computePass.end();
		}

		gpuDevice.queue.submit([commandEncoder.finish()]);
		await gpuDevice.queue.onSubmittedWorkDone();

		// 임시 버퍼 정리
		uniformBuffers.forEach(buf => buf.destroy());

		return new IBLCubeTexture(this.#redGPUContext, `Prefilter_Map_${createUUID()}`, prefilterGPUTexture);
	}

	#getCubeMapFaceMatrices(): Float32Array[] {
		return [
			new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
			new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
			new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])
		];
	}
}

Object.freeze(PrefilterGenerator);
export default PrefilterGenerator;
import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import GPU_LOAD_OP from "../../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../../gpuConst/GPU_STORE_OP";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import IBLCubeTexture from "../IBLCubeTexture";
import irradianceShaderCode from "./irradianceShaderCode.wgsl";

/**
 * [KO] Irradiance 맵을 생성하는 클래스입니다.
 * [EN] Class that generates an Irradiance map.
 *
 * [KO] 큐브맵으로부터 저주파 조명 정보를 추출하여 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 베이킹합니다.
 * [EN] Extracts low-frequency lighting information from a cubemap to bake an Irradiance map for diffuse lighting.
 *
 * @category IBL
 */
class IrradianceGenerator {
	readonly #redGPUContext: RedGPUContext;
	#sampler: Sampler;
	#pipeline: GPUComputePipeline;
	#shaderModule: GPUShaderModule;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#sampler = new Sampler(this.#redGPUContext, {
			magFilter: GPU_FILTER_MODE.LINEAR,
			minFilter: GPU_FILTER_MODE.LINEAR,
			mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
			addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
		});
	}

	/**
	 * [KO] 소스 큐브 텍스처로부터 Irradiance 맵을 생성하여 반환합니다.
	 * [EN] Generates and returns an Irradiance map from the source cube texture.
	 *
	 * @param sourceCubeTexture - [KO] 소스 환경맵 (큐브) [EN] Source environment map (Cube)
	 * @param size - [KO] 생성될 Irradiance 맵의 크기 (기본값: 32) [EN] Size of the generated Irradiance map (default: 32)
	 * @returns [KO] 생성된 Irradiance IBLCubeTexture [EN] Generated Irradiance IBLCubeTexture
	 */
	async generate(sourceCubeTexture: GPUTexture, size: number = 32): Promise<IBLCubeTexture> {
		const { gpuDevice, resourceManager } = this.#redGPUContext;
		const format: GPUTextureFormat = 'rgba16float';

		// 1. 결과용 큐브 텍스처 생성
		const irradianceGPUTexture = resourceManager.createManagedTexture({
			size: [size, size, 6],
			format: format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: 1,
			label: `Irradiance_Map_Texture_${createUUID()}`
		});

		// 2. 파이프라인 생성 (지연 생성 및 캐싱)
		if (!this.#shaderModule) {
			this.#shaderModule = resourceManager.createGPUShaderModule(
				'IRRADIANCE_GENERATOR_SHADER_MODULE',
				{ code: irradianceShaderCode }
			);
		}

		if (!this.#pipeline) {
			this.#pipeline = gpuDevice.createComputePipeline({
				label: 'IRRADIANCE_GENERATOR_PIPELINE',
				layout: 'auto',
				compute: {
					module: this.#shaderModule,
					entryPoint: 'cs_main'
				},
			});
		}

		// 3. 6개 면 연산
		const commandEncoder = gpuDevice.createCommandEncoder({ label: 'Irradiance_Generator_Command_Encoder' });
		const faceMatrices = this.#getCubeMapFaceMatrices();
		
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64 * 6,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: `Irradiance_face_matrices_uniform`
		});
		const combinedMatrices = new Float32Array(16 * 6);
		faceMatrices.forEach((m, i) => combinedMatrices.set(m, i * 16));
		gpuDevice.queue.writeBuffer(uniformBuffer, 0, combinedMatrices);

		const bindGroup = gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: sourceCubeTexture.createView({ dimension: 'cube' }) },
				{ binding: 1, resource: this.#sampler.gpuSampler },
				{ binding: 2, resource: irradianceGPUTexture.createView({ dimension: '2d-array' }) },
				{ binding: 3, resource: { buffer: uniformBuffer } }
			]
		});

		const computePass = commandEncoder.beginComputePass({
			label: `Irradiance_Generator_Compute_Pass`
		});

		computePass.setPipeline(this.#pipeline);
		computePass.setBindGroup(0, bindGroup);
		computePass.dispatchWorkgroups(Math.ceil(size / 8), Math.ceil(size / 8), 6);
		computePass.end();

		gpuDevice.queue.submit([commandEncoder.finish()]);
		await gpuDevice.queue.onSubmittedWorkDone();

		// 임시 버퍼 정리
		uniformBuffer.destroy();

		return new IBLCubeTexture(this.#redGPUContext, `Irradiance_Map_${createUUID()}`, irradianceGPUTexture);
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

Object.freeze(IrradianceGenerator);
export default IrradianceGenerator;
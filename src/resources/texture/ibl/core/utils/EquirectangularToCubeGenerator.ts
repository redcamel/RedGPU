import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import GPU_LOAD_OP from "../../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../../gpuConst/GPU_STORE_OP";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import createUUID from "../../../../../utils/uuid/createUUID";
import Sampler from "../../../../sampler/Sampler";
import IBLCubeTexture from "../IBLCubeTexture";
import equirectangularToCubeShaderCode from "./equirectangularToCubeShaderCode.wgsl";

/**
 * [KO] Equirectangular(2D) 텍스처를 CubeMap으로 변환하는 클래스입니다.
 * [EN] Class that converts an Equirectangular (2D) texture to a CubeMap.
 *
 * @category IBL
 */
class EquirectangularToCubeGenerator {
	readonly #redGPUContext: RedGPUContext;
	#shaderModule: GPUShaderModule;
	#pipeline: GPURenderPipeline;
	#sampler: Sampler;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#sampler = new Sampler(this.#redGPUContext, {
			magFilter: GPU_FILTER_MODE.LINEAR,
			minFilter: GPU_FILTER_MODE.LINEAR,
			addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
		});
	}

	/**
	 * [KO] 2D Equirectangular 텍스처를 큐브맵으로 변환하여 반환합니다.
	 * [EN] Converts a 2D Equirectangular texture to a cubemap and returns it.
	 *
	 * @param sourceTexture - [KO] 소스 2D HDR 텍스처 [EN] Source 2D HDR texture
	 * @param size - [KO] 생성될 큐브맵의 한 면 크기 (기본값: 512) [EN] Size of one side of the generated cubemap (default: 512)
	 * @returns [KO] 생성된 IBLCubeTexture [EN] Generated IBLCubeTexture
	 */
	async generate(sourceTexture: GPUTexture, size: number = 512): Promise<IBLCubeTexture> {
		const { gpuDevice, resourceManager } = this.#redGPUContext;
		const format: GPUTextureFormat = 'rgba16float';
		const mipLevelCount = getMipLevelCount(size, size);

		// 1. 결과용 큐브 텍스처 생성 (밉맵 포함)
		const textureDesc: GPUTextureDescriptor = {
			size: [size, size, 6],
			format: format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
			dimension: '2d',
			mipLevelCount: mipLevelCount,
			label: `EquirectangularToCube_Texture_${createUUID()}`
		};
		const cubeGPUTexture = resourceManager.createManagedTexture(textureDesc);

		// 2. 파이프라인 생성
		if (!this.#shaderModule) {
			this.#shaderModule = resourceManager.createGPUShaderModule(
				'EQUIRECTANGULAR_TO_CUBE_GENERATOR_SHADER_MODULE',
				{ code: equirectangularToCubeShaderCode }
			);
		}

		if (!this.#pipeline) {
			this.#pipeline = gpuDevice.createRenderPipeline({
				label: 'EQUIRECTANGULAR_TO_CUBE_GENERATOR_PIPELINE',
				layout: 'auto',
				vertex: {
					module: this.#shaderModule,
					entryPoint: 'vs_main'
				},
				fragment: {
					module: this.#shaderModule,
					entryPoint: 'fs_main',
					targets: [{ format }]
				},
			});
		}

		// 3. 6개 면 렌더링
		const commandEncoder = gpuDevice.createCommandEncoder({ label: 'EquirectangularToCube_Generator_Command_Encoder' });
		const faceMatrices = this.#getCubeMapFaceMatrices();
		const uniformBuffers: GPUBuffer[] = [];

		for (let face = 0; face < 6; face++) {
			const uniformBuffer = gpuDevice.createBuffer({
				size: 64,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				label: `EquirectangularToCube_face_${face}_uniform`
			});
			gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrices[face] as BufferSource);
			uniformBuffers.push(uniformBuffer);

			const bindGroup = gpuDevice.createBindGroup({
				layout: this.#pipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: sourceTexture.createView() },
					{ binding: 1, resource: this.#sampler.gpuSampler },
					{ binding: 2, resource: { buffer: uniformBuffer } }
				]
			});

			const renderPass = commandEncoder.beginRenderPass({
				colorAttachments: [{
					view: cubeGPUTexture.createView({
						dimension: '2d',
						baseMipLevel: 0,
						mipLevelCount: 1,
						baseArrayLayer: face,
						arrayLayerCount: 1
					}),
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: GPU_LOAD_OP.CLEAR,
					storeOp: GPU_STORE_OP.STORE
				}],
				label: `EquirectangularToCube_face_${face}_renderpass`
			});

			renderPass.setPipeline(this.#pipeline);
			renderPass.setBindGroup(0, bindGroup);
			renderPass.draw(6, 1, 0, 0);
			renderPass.end();
		}

		gpuDevice.queue.submit([commandEncoder.finish()]);
		
		// 밉맵 생성
		resourceManager.mipmapGenerator.generateMipmap(cubeGPUTexture, textureDesc);
		
		await gpuDevice.queue.onSubmittedWorkDone();

		// 임시 버퍼 정리
		uniformBuffers.forEach(buf => buf.destroy());

		return new IBLCubeTexture(this.#redGPUContext, `CubeMap_From_Equirect_${createUUID()}`, cubeGPUTexture);
	}

	#getCubeMapFaceMatrices(): Float32Array[] {
		return [
			new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
			new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
			new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
			// WebGPU 큐브맵 렌더링을 위한 면 방향 보정
			new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
			new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])
		];
	}
}

Object.freeze(EquirectangularToCubeGenerator);
export default EquirectangularToCubeGenerator;

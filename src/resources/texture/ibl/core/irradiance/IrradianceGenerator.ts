import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import GPU_LOAD_OP from "../../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../../gpuConst/GPU_STORE_OP";
import Sampler from "../../../../sampler/Sampler";
import irradianceShaderCode from "./irradianceShaderCode.wgsl";

/**
 * [KO] Irradiance 맵을 생성하는 클래스입니다.
 * [EN] Class that generates an Irradiance map.
 *
 * [KO] 환경맵으로부터 저주파 조명 정보를 추출하여 난반사(Diffuse) 라이팅에 사용할 Irradiance 맵을 베이킹합니다.
 * [EN] Extracts low-frequency lighting information from the environment map to bake an Irradiance map for diffuse lighting.
 *
 * @category IBL
 */
class IrradianceGenerator {
	readonly #redGPUContext: RedGPUContext;
	#shaderModule: GPUShaderModule;
	#pipeline: GPURenderPipeline;
	#sampler: Sampler;

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
	 * @returns [KO] 생성된 Irradiance GPUTexture [EN] Generated Irradiance GPUTexture
	 */
	async generate(sourceCubeTexture: GPUTexture, size: number = 32): Promise<GPUTexture> {
		const { gpuDevice, resourceManager } = this.#redGPUContext;
		const format: GPUTextureFormat = 'rgba16float';

		const irradianceTexture = resourceManager.createManagedTexture({
			size: [size, size, 6],
			format: format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
			mipLevelCount: 1,
			label: `Irradiance_Map_Texture`
		});

		if (!this.#shaderModule) {
			this.#shaderModule = resourceManager.createGPUShaderModule(
				'IRRADIANCE_GENERATOR_SHADER_MODULE',
				{ code: irradianceShaderCode }
			);
		}

		if (!this.#pipeline) {
			this.#pipeline = gpuDevice.createRenderPipeline({
				label: 'IRRADIANCE_GENERATOR_PIPELINE',
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

		const faceMatrices = this.#getCubeMapFaceMatrices();
		for (let face = 0; face < 6; face++) {
			await this.#renderFace(this.#pipeline, face, faceMatrices[face], sourceCubeTexture, irradianceTexture);
		}

		return irradianceTexture;
	}

	async #renderFace(
		renderPipeline: GPURenderPipeline,
		face: number,
		faceMatrix: Float32Array,
		sourceCubeTexture: GPUTexture,
		irradianceTexture: GPUTexture
	): Promise<void> {
		const { gpuDevice } = this.#redGPUContext;
		const uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			label: `Irradiance_face_${face}_uniform`
		});
		gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrix as BufferSource);

		const bindGroup = gpuDevice.createBindGroup({
			layout: renderPipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: sourceCubeTexture.createView({ dimension: 'cube' }) },
				{ binding: 1, resource: this.#sampler.gpuSampler },
				{ binding: 2, resource: { buffer: uniformBuffer } }
			]
		});

		const commandEncoder = gpuDevice.createCommandEncoder({
			label: `Irradiance_face_${face}_encoder`
		});

		const renderPass = commandEncoder.beginRenderPass({
			colorAttachments: [{
				view: irradianceTexture.createView({
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
			label: `Irradiance_face_${face}_renderpass`
		});

		renderPass.setPipeline(renderPipeline);
		renderPass.setBindGroup(0, bindGroup);
		renderPass.draw(6, 1, 0, 0);
		renderPass.end();

		gpuDevice.queue.submit([commandEncoder.finish()]);
		uniformBuffer.destroy();
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

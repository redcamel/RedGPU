import RedGPUContext from "../../../../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import GPU_LOAD_OP from "../../../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../../../gpuConst/GPU_STORE_OP";
import createUUID from "../../../../../utils/uuid/createUUID";
import preprocessWGSL from "../../../../wgslParser/core/preprocessWGSL";
import Sampler from "../../../../sampler/Sampler";
import IBLCubeTexture from "../IBLCubeTexture";
import irradianceShaderCode from "./irradianceShaderCode.wgsl";

/**
 * [KO] Irradiance 맵을 생성하는 클래스입니다.
 * [EN] Class that generates an Irradiance map.
 *
 * @category IBL
 */
class IrradianceGenerator {
	readonly #redGPUContext: RedGPUContext;
	#sampler: Sampler;
	#pipelines: Map<string, GPURenderPipeline> = new Map();

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
	 * [KO] 소스 텍스처로부터 Irradiance 맵을 생성하여 반환합니다.
	 * [EN] Generates and returns an Irradiance map from the source texture.
	 */
	async generate(sourceTexture: GPUTexture, size: number = 32): Promise<IBLCubeTexture> {
		const { gpuDevice, resourceManager } = this.#redGPUContext;
		const is2D = sourceTexture.dimension === '2d';
		const pipelineKey = is2D ? '2D' : 'CUBE';
		const format: GPUTextureFormat = 'rgba16float';

		// 1. 결과용 큐브 텍스처 생성
		const irradianceGPUTexture = resourceManager.createManagedTexture({
			size: [size, size, 6],
			format: format,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
			dimension: '2d',
			mipLevelCount: 1,
			label: `Irradiance_Map_Texture_${createUUID()}`
		});

		// 2. 파이프라인 획득
		if (!this.#pipelines.has(pipelineKey)) {
			const preprocessed = preprocessWGSL(irradianceShaderCode);
			const variantCode = preprocessed.shaderSourceVariant.getVariant(is2D ? 'USE_2D_SOURCE' : 'none');
			const shaderModule = gpuDevice.createShaderModule({ code: variantCode });
			
			const pipeline = gpuDevice.createRenderPipeline({
				label: `IRRADIANCE_GENERATOR_PIPELINE_${pipelineKey}`,
				layout: 'auto',
				vertex: { module: shaderModule, entryPoint: 'vs_main' },
				fragment: { module: shaderModule, entryPoint: 'fs_main', targets: [{ format }] },
			});
			this.#pipelines.set(pipelineKey, pipeline);
		}
		const pipeline = this.#pipelines.get(pipelineKey);

		// 3. 6개 면 렌더링
		const commandEncoder = gpuDevice.createCommandEncoder({ label: 'Irradiance_Generator_Command_Encoder' });
		const faceMatrices = this.#getCubeMapFaceMatrices();
		const uniformBuffers: GPUBuffer[] = [];

		for (let face = 0; face < 6; face++) {
			const uniformBuffer = gpuDevice.createBuffer({
				size: 64,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
			});
			gpuDevice.queue.writeBuffer(uniformBuffer, 0, faceMatrices[face] as BufferSource);
			uniformBuffers.push(uniformBuffer);

			const bindGroup = gpuDevice.createBindGroup({
				layout: pipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: sourceTexture.createView({ dimension: is2D ? '2d' : 'cube' }) },
					{ binding: 1, resource: this.#sampler.gpuSampler },
					{ binding: 2, resource: { buffer: uniformBuffer } }
				]
			});

			const renderPass = commandEncoder.beginRenderPass({
				colorAttachments: [{
					view: irradianceGPUTexture.createView({
						dimension: '2d',
						baseMipLevel: 0,
						mipLevelCount: 1,
						baseArrayLayer: face,
						arrayLayerCount: 1
					}),
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: GPU_LOAD_OP.CLEAR,
					storeOp: GPU_STORE_OP.STORE
				}]
			});

			renderPass.setPipeline(pipeline);
			renderPass.setBindGroup(0, bindGroup);
			renderPass.draw(6, 1, 0, 0);
			renderPass.end();
		}

		gpuDevice.queue.submit([commandEncoder.finish()]);
		await gpuDevice.queue.onSubmittedWorkDone();

		// 임시 버퍼 정리
		uniformBuffers.forEach(buf => buf.destroy());

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

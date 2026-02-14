import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import CameraVolumeLUTTexture from "./CameraVolumeLUTTexture";
import cameraVolumeShaderCode from "./cameraVolumeShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import TransmittanceLUTTexture from "../transmittance/TransmittanceLUTTexture";
import MultiScatteringLUTTexture from "../multiScattering/MultiScatteringLUTTexture";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + cameraVolumeShaderCode);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

class CameraVolumeGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: CameraVolumeLUTTexture;
	#pipeline: GPUComputePipeline;
	#uniformBuffer: UniformBuffer;
	#sampler: Sampler;

	readonly width: number = 64;
	readonly height: number = 64;
	readonly depth: number = 32;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#sampler = new Sampler(this.#redGPUContext, { magFilter: 'linear', minFilter: 'linear' });
		this.#init();
	}

	get lutTexture(): CameraVolumeLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new CameraVolumeLUTTexture(this.#redGPUContext, this.width, this.height, this.depth);

		const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength);
		this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, vertexUniformData, 'CAMERA_VOLUME_GEN_UNIFORM_BUFFER');

		const shaderModule = gpuDevice.createShaderModule({ code: SHADER_INFO.defaultSource });
		this.#pipeline = gpuDevice.createComputePipeline({
			layout: 'auto',
			compute: { module: shaderModule, entryPoint: 'main' }
		});
	}

	render(transmittance: TransmittanceLUTTexture, multiScat: MultiScatteringLUTTexture, params: any): void {
		const {gpuDevice} = this.#redGPUContext;

		const {members} = UNIFORM_STRUCT;
		for (const [key, member] of Object.entries(members)) {
			const value = params[key];
			if (value !== undefined) this.#uniformBuffer.writeOnlyBuffer(member, value);
		}

		const bindGroup = gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: this.#lutTexture.gpuTextureView },
				{ binding: 1, resource: transmittance.gpuTextureView },
				{ binding: 2, resource: multiScat.gpuTextureView },
				{ binding: 3, resource: this.#sampler.gpuSampler },
				{ binding: 4, resource: { buffer: this.#uniformBuffer.gpuBuffer } }
			]
		});

		const commandEncoder = gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.setBindGroup(0, bindGroup);
		passEncoder.dispatchWorkgroups(
			Math.ceil(this.width / 4),
			Math.ceil(this.height / 4),
			Math.ceil(this.depth / 4)
		);
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		this.#lutTexture.notifyUpdate();
	}
}

export default CameraVolumeGenerator;

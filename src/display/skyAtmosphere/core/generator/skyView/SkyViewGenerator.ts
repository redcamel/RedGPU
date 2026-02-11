import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import SkyViewLUTTexture from "./SkyViewLUTTexture";
import skyViewShaderCode from "./skyViewShaderCode.wgsl";
import TransmittanceLUTTexture from "../transmittance/TransmittanceLUTTexture";
import MultiScatteringLUTTexture from "../multiScattering/MultiScatteringLUTTexture";

/**
 * [KO] Sky-View LUT를 생성하는 클래스입니다.
 */
class SkyViewGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: SkyViewLUTTexture;
	#pipeline: GPUComputePipeline;
	#uniformBuffer: GPUBuffer;
	#uniformData: Float32Array;
	#sampler: Sampler;

	readonly width: number = 200;
	readonly height: number = 200;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#sampler = new Sampler(this.#redGPUContext, { magFilter: 'linear', minFilter: 'linear' });
		this.#init();
	}

	get lutTexture(): SkyViewLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new SkyViewLUTTexture(this.#redGPUContext, this.width, this.height);
		this.#uniformData = new Float32Array(20); 
		this.#uniformBuffer = gpuDevice.createBuffer({
			size: 80,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		const shaderModule = gpuDevice.createShaderModule({ code: skyViewShaderCode });
		this.#pipeline = gpuDevice.createComputePipeline({
			layout: 'auto',
			compute: { module: shaderModule, entryPoint: 'main' }
		});
	}

	render(transmittance: TransmittanceLUTTexture, multiScat: MultiScatteringLUTTexture, params: any): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#uniformData[0] = params.earthRadius;
		this.#uniformData[1] = params.atmosphereHeight;
		this.#uniformData[2] = params.mieScattering;
		this.#uniformData[3] = params.mieExtinction;
		this.#uniformData[4] = params.rayleighScattering[0];
		this.#uniformData[5] = params.rayleighScattering[1];
		this.#uniformData[6] = params.rayleighScattering[2];
		this.#uniformData[7] = params.mieAnisotropy;
		this.#uniformData[8] = params.rayleighScaleHeight;
		this.#uniformData[9] = params.mieScaleHeight;
		this.#uniformData[10] = params.cameraHeight;
		this.#uniformData[12] = params.ozoneAbsorption[0];
		this.#uniformData[13] = params.ozoneAbsorption[1];
		this.#uniformData[14] = params.ozoneAbsorption[2];
		this.#uniformData[16] = params.sunDirection[0];
		this.#uniformData[17] = params.sunDirection[1];
		this.#uniformData[18] = params.sunDirection[2];

		gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as BufferSource);
		const bindGroup = gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: this.#lutTexture.gpuTextureView },
				{ binding: 1, resource: transmittance.gpuTextureView },
				{ binding: 2, resource: multiScat.gpuTextureView },
				{ binding: 3, resource: this.#sampler.gpuSampler },
				{ binding: 4, resource: { buffer: this.#uniformBuffer } }
			]
		});
		const commandEncoder = gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.setBindGroup(0, bindGroup);
		passEncoder.dispatchWorkgroups(Math.ceil(this.width / 16), Math.ceil(this.height / 16));
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		this.#lutTexture.notifyUpdate();
	}
}

export default SkyViewGenerator;

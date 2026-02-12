import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import SkyViewLUTTexture from "./SkyViewLUTTexture";
import skyViewShaderCode from "./skyViewShaderCode.wgsl";
import TransmittanceLUTTexture from "../transmittance/TransmittanceLUTTexture";
import MultiScatteringLUTTexture from "../multiScattering/MultiScatteringLUTTexture";

class SkyViewGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: SkyViewLUTTexture;
	#pipeline: GPUComputePipeline;
	#uniformBuffer: GPUBuffer;
	#uniformData: Float32Array;
	#sampler: Sampler;

	readonly width: number = 200;
	readonly height: number = 200;

	earthRadius: number = 6360.0;
	atmosphereHeight: number = 60.0;
	mieScattering: number = 0.021;
	mieExtinction: number = 0.021;
	rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
	mieAnisotropy: number = 0.8;
	rayleighScaleHeight: number = 8.0;
	mieScaleHeight: number = 1.2;
	cameraHeight: number = 0.2;
	multiScatAmbient: number = 0.05;
	ozoneAbsorption: [number, number, number] = [0.00065, 0.00188, 0.00008];
	ozoneLayerCenter: number = 25.0;
	ozoneLayerWidth: number = 15.0;
	sunDirection: [number, number, number] = [0, 1, 0];

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#sampler = new Sampler(this.#redGPUContext, { magFilter: 'linear', minFilter: 'linear' });
		this.#init();
	}

	get lutTexture(): SkyViewLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new SkyViewLUTTexture(this.#redGPUContext, this.width, this.height);

		// 5개의 vec4
		this.#uniformData = new Float32Array(20);
		this.#uniformBuffer = gpuDevice.createBuffer({
			size: this.#uniformData.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});

		const shaderModule = gpuDevice.createShaderModule({ code: skyViewShaderCode });
		this.#pipeline = gpuDevice.createComputePipeline({
			layout: 'auto',
			compute: { module: shaderModule, entryPoint: 'main' }
		});
	}

	render(transmittance: TransmittanceLUTTexture, multiScat: MultiScatteringLUTTexture): void {
		const {gpuDevice} = this.#redGPUContext;

		// p0: (earthRadius, atmHeight, mieScat, mieExt)
		this.#uniformData[0] = this.earthRadius;
		this.#uniformData[1] = this.atmosphereHeight;
		this.#uniformData[2] = this.mieScattering;
		this.#uniformData[3] = this.mieExtinction;

		// p1: (rayScat.rgb, mieAnisotropy)
		this.#uniformData[4] = this.rayleighScattering[0];
		this.#uniformData[5] = this.rayleighScattering[1];
		this.#uniformData[6] = this.rayleighScattering[2];
		this.#uniformData[7] = this.mieAnisotropy;

		// p2: (rayScaleH, mieScaleH, cameraH, multiScatAmbient)
		this.#uniformData[8] = this.rayleighScaleHeight;
		this.#uniformData[9] = this.mieScaleHeight;
		this.#uniformData[10] = this.cameraHeight;
		this.#uniformData[11] = this.multiScatAmbient;

		// p3: (ozoneAbs.rgb, ozoneCenter)
		this.#uniformData[12] = this.ozoneAbsorption[0];
		this.#uniformData[13] = this.ozoneAbsorption[1];
		this.#uniformData[14] = this.ozoneAbsorption[2];
		this.#uniformData[15] = this.ozoneLayerCenter;

		// p4: (sunDir.rgb, ozoneWidth)
		this.#uniformData[16] = this.sunDirection[0];
		this.#uniformData[17] = this.sunDirection[1];
		this.#uniformData[18] = this.sunDirection[2];
		this.#uniformData[19] = this.ozoneLayerWidth;

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

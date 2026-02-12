import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode from "./transmittanceShaderCode.wgsl";
import TransmittanceLUTTexture from "./TransmittanceLUTTexture";

class TransmittanceGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: TransmittanceLUTTexture;
	#pipeline: GPUComputePipeline;
	#bindGroup: GPUBindGroup;
	#uniformBuffer: GPUBuffer;
	#uniformData: Float32Array;

	readonly width: number = 256;
	readonly height: number = 64;

	earthRadius: number = 6360.0;
	atmosphereHeight: number = 60.0;
	mieExtinction: number = 0.021;
	rayleighScaleHeight: number = 8.0;
	mieScaleHeight: number = 1.2;
	ozoneLayerCenter: number = 25.0;
	ozoneLayerWidth: number = 15.0;
	rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
	ozoneAbsorption: [number, number, number] = [0.00065, 0.00188, 0.00008];

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#init();
	}

	get lutTexture(): TransmittanceLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new TransmittanceLUTTexture(this.#redGPUContext, this.width, this.height);

		// 4개의 vec4 = 16 floats
		this.#uniformData = new Float32Array(16);
		this.#uniformBuffer = gpuDevice.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});

		const shaderModule = gpuDevice.createShaderModule({ code: transmittanceShaderCode });
		this.#pipeline = gpuDevice.createComputePipeline({
			layout: 'auto',
			compute: { module: shaderModule, entryPoint: 'main' }
		});

		this.#bindGroup = gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: this.#lutTexture.gpuTextureView },
				{ binding: 1, resource: { buffer: this.#uniformBuffer } }
			]
		});
	}

	render(): void {
		const {gpuDevice} = this.#redGPUContext;

		// p0: (earthRadius, atmHeight, mieExtinction, rayScaleH)
		this.#uniformData[0] = this.earthRadius;
		this.#uniformData[1] = this.atmosphereHeight;
		this.#uniformData[2] = this.mieExtinction;
		this.#uniformData[3] = this.rayleighScaleHeight;

		// p1: (mieScaleH, ozoneCenter, ozoneWidth, padding)
		this.#uniformData[4] = this.mieScaleHeight;
		this.#uniformData[5] = this.ozoneLayerCenter;
		this.#uniformData[6] = this.ozoneLayerWidth;

		// p2: (rayleighScat.rgb, padding)
		this.#uniformData[8] = this.rayleighScattering[0];
		this.#uniformData[9] = this.rayleighScattering[1];
		this.#uniformData[10] = this.rayleighScattering[2];

		// p3: (ozoneAbs.rgb, padding)
		this.#uniformData[12] = this.ozoneAbsorption[0];
		this.#uniformData[13] = this.ozoneAbsorption[1];
		this.#uniformData[14] = this.ozoneAbsorption[2];

		gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as BufferSource);

		const commandEncoder = gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.setBindGroup(0, this.#bindGroup);
		passEncoder.dispatchWorkgroups(Math.ceil(this.width / 16), Math.ceil(this.height / 16));
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);
		this.#lutTexture.notifyUpdate();
	}
}

export default TransmittanceGenerator;

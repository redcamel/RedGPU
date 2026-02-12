import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode from "./transmittanceShaderCode.wgsl";
import TransmittanceLUTTexture from "./TransmittanceLUTTexture";

/**
 * [KO] Transmittance LUT를 생성하는 클래스입니다.
 */
class TransmittanceGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: TransmittanceLUTTexture;
	#pipeline: GPUComputePipeline;
	#bindGroup: GPUBindGroup;
	#uniformBuffer: GPUBuffer;
	#uniformData: Float32Array;

	readonly width: number = 256;
	readonly height: number = 64;

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#init();
	}

	get lutTexture(): TransmittanceLUTTexture { return this.#lutTexture; }

	#init(): void {
		const {gpuDevice} = this.#redGPUContext;
		this.#lutTexture = new TransmittanceLUTTexture(this.#redGPUContext, this.width, this.height);

		// 4 * vec4<f32> = 16 floats = 64 bytes
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

	render(params: any): void {
		const {gpuDevice} = this.#redGPUContext;

		this.#uniformData.fill(0);

		// p0: (earthRadius, atmosphereHeight, mieExtinction, rayleighScaleHeight)
		this.#uniformData[0] = Number(params.earthRadius);
		this.#uniformData[1] = Number(params.atmosphereHeight);
		this.#uniformData[2] = Number(params.mieExtinction);
		this.#uniformData[3] = Number(params.rayleighScaleHeight);

		// p1: (mieScaleHeight, ozoneLayerCenter, ozoneLayerWidth, reserved)
		this.#uniformData[4] = Number(params.mieScaleHeight);
		this.#uniformData[5] = Number(params.ozoneLayerCenter ?? 25.0);
		this.#uniformData[6] = Number(params.ozoneLayerWidth ?? 15.0);
		this.#uniformData[7] = 0;

		// p2: (rayleighScattering.rgb, reserved)
		this.#uniformData[8] = Number(params.rayleighScattering?.[0]);
		this.#uniformData[9] = Number(params.rayleighScattering?.[1]);
		this.#uniformData[10] = Number(params.rayleighScattering?.[2]);
		this.#uniformData[11] = 0;

		// p3: (ozoneAbsorption.rgb, reserved)
		this.#uniformData[12] = Number(params.ozoneAbsorption?.[0]);
		this.#uniformData[13] = Number(params.ozoneAbsorption?.[1]);
		this.#uniformData[14] = Number(params.ozoneAbsorption?.[2]);
		this.#uniformData[15] = 0;

		for (let i = 0; i < this.#uniformData.length; i++) {
			const v = this.#uniformData[i];
			if (!Number.isFinite(v)) {
				throw new Error(`TransmittanceGenerator uniformData[${i}] is not finite: ${String(v)}`);
			}
		}

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
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

		// [수정] 5개의 16바이트 청크 (총 20 floats = 80 bytes)
		// 데이터 정렬을 완벽하게 맞추기 위해 크기 조정
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

	render(transmittance: TransmittanceLUTTexture, multiScat: MultiScatteringLUTTexture, params: any): void {
		const {gpuDevice} = this.#redGPUContext;

		// [중요] WGSL의 struct와 완벽하게 매칭되는 16바이트 패킹 (Chunking) 전략

		// Chunk 1: 기본 스칼라 파라미터 (4 floats)
		this.#uniformData[0] = params.earthRadius;
		this.#uniformData[1] = params.atmosphereHeight;
		this.#uniformData[2] = params.mieScattering;
		this.#uniformData[3] = params.mieExtinction;

		// Chunk 2: Rayleigh(vec3) + MieAnisotropy(float) -> 16바이트 꽉 채움
		this.#uniformData[4] = params.rayleighScattering[0];
		this.#uniformData[5] = params.rayleighScattering[1];
		this.#uniformData[6] = params.rayleighScattering[2];
		this.#uniformData[7] = params.mieAnisotropy;

		// Chunk 3: 높이 관련 및 간접광 (4 floats)
		this.#uniformData[8] = params.rayleighScaleHeight;
		this.#uniformData[9] = params.mieScaleHeight;
		this.#uniformData[10] = params.cameraHeight;
		this.#uniformData[11] = params.multiScatAmbient || 0.1; // 기본값 약간 상향

		// Chunk 4: Ozone(vec3) + OzoneCenter(float)
		this.#uniformData[12] = params.ozoneAbsorption[0];
		this.#uniformData[13] = params.ozoneAbsorption[1];
		this.#uniformData[14] = params.ozoneAbsorption[2];
		this.#uniformData[15] = params.ozoneLayerCenter || 25.0;

		// Chunk 5: SunDir(vec3) + OzoneWidth(float)
		this.#uniformData[16] = params.sunDirection[0];
		this.#uniformData[17] = params.sunDirection[1];
		this.#uniformData[18] = params.sunDirection[2];
		this.#uniformData[19] = params.ozoneLayerWidth || 15.0;

		gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData.buffer, 0, this.#uniformData.byteLength);

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
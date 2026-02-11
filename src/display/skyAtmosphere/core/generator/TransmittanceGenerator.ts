import RedGPUContext from "../../../../context/RedGPUContext";
import transmittanceShaderCode from "./transmittanceShaderCode.wgsl";
import TransmittanceLUTTexture from "./TransmittanceLUTTexture";

/**
 * [KO] 대기 투과율(Transmittance) LUT를 생성하는 클래스입니다.
 * [EN] Class that generates the Atmospheric Transmittance LUT.
 *
 * [KO] 이 클래스는 Compute Shader를 사용하여 대기 밀도와 각도에 따른 빛의 투과율 정보를 계산하고 전용 텍스처에 저장합니다.
 * [EN] This class uses a Compute Shader to calculate light transmittance information based on atmospheric density and angle, and stores it in a dedicated texture.
 *
 * @category SkyAtmosphere
 */
class TransmittanceGenerator {
	#redGPUContext: RedGPUContext;
	#lutTexture: TransmittanceLUTTexture;
	#pipeline: GPUComputePipeline;
	#bindGroup: GPUBindGroup;
	#uniformBuffer: GPUBuffer;
	#uniformData: Float32Array;

	/** [KO] LUT 텍스처 너비 [EN] LUT texture width */
	readonly width: number = 256;
	/** [KO] LUT 텍스처 높이 [EN] LUT texture height */
	readonly height: number = 64;

	/**
	 * [KO] TransmittanceGenerator 인스턴스를 생성합니다.
	 * [EN] Creates a new TransmittanceGenerator instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPUContext 인스턴스
	 * [EN] RedGPUContext instance
	 */
	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext;
		this.#init();
	}

	/**
	 * [KO] 생성된 LUT 텍스처 객체를 반환합니다.
	 * [EN] Returns the generated LUT texture object.
	 *
	 * @returns
	 * [KO] 투과율 LUT 텍스처
	 * [EN] Transmittance LUT texture
	 */
	get lutTexture(): TransmittanceLUTTexture { return this.#lutTexture; }

	/**
	 * [KO] 리소스를 초기화합니다.
	 * @private
	 */
	#init(): void {
		const {gpuDevice} = this.#redGPUContext;

		// 1. 전용 LUT Texture 생성
		this.#lutTexture = new TransmittanceLUTTexture(this.#redGPUContext, this.width, this.height);

		// 2. Uniform Buffer 생성 (AtmosphereParameters)
		this.#uniformData = new Float32Array(8);
		this.#uniformBuffer = gpuDevice.createBuffer({
			size: 32,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});

		// 3. Compute Pipeline 생성
		const shaderModule = gpuDevice.createShaderModule({
			code: transmittanceShaderCode
		});

		this.#pipeline = gpuDevice.createComputePipeline({
			layout: 'auto',
			compute: {
				module: shaderModule,
				entryPoint: 'main'
			}
		});

		// 4. Bind Group 생성
		this.#bindGroup = gpuDevice.createBindGroup({
			layout: this.#pipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: this.#lutTexture.gpuTextureView
				},
				{
					binding: 1,
					resource: { buffer: this.#uniformBuffer }
				}
			]
		});
	}

	/**
	 * [KO] LUT를 렌더링(계산)합니다.
	 * [EN] Renders (calculates) the LUT.
	 *
	 * [KO] 주어진 대기 물리 파라미터를 기반으로 Compute Shader를 실행하여 투과율 데이터를 갱신합니다.
	 * [EN] Executes the Compute Shader based on given atmospheric physical parameters to update transmittance data.
	 *
	 * @param params -
	 * [KO] 대기 물리 파라미터 (지구 반지름, 대기층 두께, 산란 계수 등)
	 * [EN] Atmospheric physical parameters (earth radius, atmosphere height, scattering coefficients, etc.)
	 */
	render(params: {
		earthRadius: number,
		atmosphereHeight: number,
		mieScattering: number,
		mieExtinction: number,
		rayleighScattering: [number, number, number]
	}): void {
		const {gpuDevice} = this.#redGPUContext;

		this.#uniformData[0] = params.earthRadius;
		this.#uniformData[1] = params.atmosphereHeight;
		this.#uniformData[2] = params.mieScattering;
		this.#uniformData[3] = params.mieExtinction;
		this.#uniformData[4] = params.rayleighScattering[0];
		this.#uniformData[5] = params.rayleighScattering[1];
		this.#uniformData[6] = params.rayleighScattering[2];

		gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as BufferSource);

		const commandEncoder = gpuDevice.createCommandEncoder();
		const passEncoder = commandEncoder.beginComputePass();
		passEncoder.setPipeline(this.#pipeline);
		passEncoder.setBindGroup(0, this.#bindGroup);
		passEncoder.dispatchWorkgroups(Math.ceil(this.width / 16), Math.ceil(this.height / 16));
		passEncoder.end();
		gpuDevice.queue.submit([commandEncoder.finish()]);

		// 데이터 변경 알림 (ManagementResourceBase 시스템 연동)
		this.#lutTexture.notifyUpdate();
	}
}

export default TransmittanceGenerator;

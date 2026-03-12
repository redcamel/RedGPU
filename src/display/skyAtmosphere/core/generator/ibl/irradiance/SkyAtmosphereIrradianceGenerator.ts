import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import skyAtmosphereIrradianceShaderCode from "./skyAtmosphereIrradianceShaderCode.wgsl";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../../utils/uuid/createUUID";
import DirectCubeTexture from "../../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";

const SHADER_INFO = parseWGSL(skyAtmosphereIrradianceShaderCode, 'SKY_ATMOSPHERE_IRRADIANCE_GENERATOR');

/**
 * [KO] 실시간 대기 산란 데이터를 기반으로 물리적으로 일치하는 조도(Irradiance) 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a physically consistent irradiance cubemap based on real-time atmospheric scattering data.
 *
 * [KO] 대기 산란 데이터를 적분하여 주변 환경으로부터 오는 확산광 조도 데이터를 독립적으로 생성합니다.
 * [EN] Independently generates diffuse irradiance data by integrating atmospheric scattering data.
 *
 * @example
 * ```typescript
 * const skyAtmosphereIrradianceGenerator = new SkyAtmosphereIrradianceGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * skyAtmosphereIrradianceGenerator.render(transmittance, multiScat, skyView);
 * ```
 * @category SkyAtmosphere
 */
class SkyAtmosphereIrradianceGenerator extends ASkyAtmosphereLUTGenerator {
	#lutTexture: DirectCubeTexture;
	#bindGroup: GPUBindGroup;
	#pipeline: GPUComputePipeline;

	/**
	 * [KO] SkyAtmosphereIrradianceGenerator 인스턴스를 초기화합니다.
	 * [EN] Initializes a SkyAtmosphereIrradianceGenerator instance.
	 *
	 * @param redGPUContext -
	 * [KO] RedGPU 컨텍스트
	 * [EN] RedGPU context
	 * @param sharedUniformBuffer -
	 * [KO] 공유 유니폼 버퍼
	 * [EN] Shared uniform buffer
	 * @param sampler -
	 * [KO] LUT 샘플링에 사용할 샘플러
	 * [EN] Sampler to be used for LUT sampling
	 */
	constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
		super(redGPUContext, sharedUniformBuffer, sampler, 'SKY_ATMOSPHERE_IRRADIANCE_GEN', 32, 32, 6);
		this.#init();
	}

	/**
	 * [KO] 생성된 조도 큐브맵 텍스처를 반환합니다.
	 * [EN] Returns the generated irradiance cubemap texture.
	 */
	get lutTexture(): DirectCubeTexture {
		return this.#lutTexture;
	}

	/**
	 * [KO] 조도 큐브맵을 렌더링(Compute)합니다.
	 * [EN] Renders (computes) the irradiance cubemap.
	 *
	 * @example
	 * ```typescript
	 * skyAtmosphereIrradianceGenerator.render(transmittance, multiScat, skyView);
	 * ```
	 * @param transmittance -
	 * [KO] 투과율 LUT 텍스처
	 * [EN] Transmittance LUT texture
	 * @param multiScat -
	 * [KO] 다중 산란 LUT 텍스처
	 * [EN] Multi-Scattering LUT texture
	 * @param skyView -
	 * [KO] 스카이 뷰 LUT 텍스처
	 * [EN] Sky-View LUT texture
	 */
    render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): void {
		if (!this.#bindGroup) {
			const {gpuDevice} = this.redGPUContext;
			this.#bindGroup = gpuDevice.createBindGroup({
				label: 'SKY_ATMOSPHERE_IRRADIANCE_GEN_BG',
				layout: this.#pipeline.getBindGroupLayout(0),
				entries: [
					{binding: 0, resource: multiScat.gpuTextureView}, // multiScatLUT
					{binding: 1, resource: this.sampler.gpuSampler}, // skyAtmosphereSampler
					{binding: 2, resource: this.#lutTexture.gpuTexture.createView({dimension: '2d-array'})}, // skyAtmosphereIrradianceLUT
					{binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}, // params
					{binding: 4, resource: transmittance.gpuTextureView}, // transmittanceLUT
					{binding: 5, resource: skyView.gpuTextureView} // skyViewLUT
				]
			});
		}

		this.executeComputePass(this.#pipeline, this.#bindGroup, [8, 8, 1]);
	}

	#init(): void {
		const {gpuDevice} = this.redGPUContext;
		this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphereIrradianceCubeTexture_${createUUID()}`, this.createLUTTexture(false));

		this.#pipeline = gpuDevice.createComputePipeline({
			label: 'SKY_ATMOSPHERE_IRRADIANCE_GEN_PIPELINE',
			layout: 'auto',
			compute: {
				module: gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
				entryPoint: 'main'
			}
		});
	}
}

export default SkyAtmosphereIrradianceGenerator;

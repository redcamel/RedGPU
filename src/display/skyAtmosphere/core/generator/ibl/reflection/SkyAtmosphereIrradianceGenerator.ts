import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import irradianceShaderCode_wgsl from "./skyAtmosphereIrradianceShaderCode.wgsl";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import createUUID from "../../../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../../ASkyAtmosphereLUTGenerator";
import getMipLevelCount from "../../../../../../utils/texture/getMipLevelCount";
import AtmosphereShaderLibrary from "../../../AtmosphereShaderLibrary";

const IRRADIANCE_SHADER_INFO = parseWGSL('SkyAtmosphere_Irradiance_Generator', irradianceShaderCode_wgsl, AtmosphereShaderLibrary);

/**
 * [KO] 실시간 대기 산란 데이터를 기반으로 조도용(Diffuse) 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates an irradiance (diffuse) cubemap based on real-time atmospheric scattering data.
 *
 * @category SkyAtmosphere
 */
class SkyAtmosphereIrradianceGenerator extends ASkyAtmosphereLUTGenerator {
	#sourceCubeTexture: GPUTexture;
	#sourceCubeTextureView: GPUTextureView;
	#prefilteredTexture: DirectCubeTexture;
	#pipeline: GPUComputePipeline;
	#bindGroup: GPUBindGroup;

	/**
	 * [KO] SkyAtmosphereIrradianceGenerator 인스턴스를 초기화합니다.
	 * [EN] Initializes a SkyAtmosphereIrradianceGenerator instance.
	 *
	 * @param redGPUContext - RedGPU 컨텍스트
	 * @param sharedUniformBuffer - 공유 유니폼 버퍼
	 * @param sampler - LUT 샘플링에 사용할 샘플러
	 */
	constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
		super(redGPUContext, sharedUniformBuffer, sampler, 'Irradiance_Gen', 256, 256, 6);
		this.#init();
	}

	/**
	 * [KO] 렌더링 소스로 사용되는 원본 큐브맵 텍스처를 반환합니다.
	 * [EN] Returns the source cubemap texture used for rendering.
	 */
	get sourceCubeTexture(): GPUTexture {
		return this.#sourceCubeTexture;
	}

	/**
	 * [KO] 프리필터링이 완료된 결과 큐브맵 텍스처를 반환합니다.
	 * [EN] Returns the resulting pre-filtered cubemap texture.
	 */
	get prefilteredTexture(): DirectCubeTexture {
		return this.#prefilteredTexture;
	}

	/**
	 * [KO] 생성된 조도용 큐브맵을 반환합니다.
	 * [EN] Returns the generated irradiance cubemap.
	 */
	get lutTexture(): DirectCubeTexture {
		return this.#prefilteredTexture;
	}

	/**
	 * [KO] 조도 큐브맵을 생성하고 프리필터링을 수행합니다.
	 * [EN] Generates the irradiance cubemap and performs pre-filtering.
	 *
	 * @param transmittance - 투과율 LUT 텍스처
	 * @param multiScat - 다중 산란 LUT 텍스처
	 * @param skyView - 스카이 뷰 LUT 텍스처
	 */
	// @ts-ignore
	async render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void> {
		if (!this.#bindGroup) {
			this.#bindGroup = this.#createBindGroup(transmittance, multiScat, skyView);
		}
		await this.#processPass(this.#pipeline, this.#bindGroup, this.#prefilteredTexture);
	}

	#createBindGroup(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): GPUBindGroup {
		return this.createBindGroup(`SkyAtmosphere_Irradiance_BindGroup_${createUUID()}`, this.#pipeline, [
			{binding: 0, resource: this.#sourceCubeTextureView},
			{binding: 1, resource: multiScat.gpuTextureView},
			{binding: 2, resource: this.sampler.gpuSampler},
			{binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
			{binding: 4, resource: transmittance.gpuTextureView},
			{binding: 5, resource: skyView.gpuTextureView}
		]);
	}

	async #processPass(pipeline: GPUComputePipeline, bindGroup: GPUBindGroup, targetTexture: DirectCubeTexture): Promise<void> {
		const {resourceManager} = this.redGPUContext;
		this.#computeRender(pipeline, bindGroup, [8, 8, 1]);
		resourceManager.mipmapGenerator.generateMipmap(this.#sourceCubeTexture, {
			size: [this.width, this.height, 6],
			format: 'rgba16float',
			usage: this.#sourceCubeTexture.usage,
			mipLevelCount: getMipLevelCount(this.width, this.height),
			dimension: '2d'
		});
		await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, targetTexture);
	}

	#init(): void {
		const {gpuDevice} = this.redGPUContext;
		const mipLevelCount = getMipLevelCount(this.width, this.height);

		this.#sourceCubeTexture = gpuDevice.createTexture({
			label: 'SkyAtmosphere_Irradiance_Source_CubeTexture',
			size: [this.width, this.height, 6],
			format: 'rgba16float',
			usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
			mipLevelCount: mipLevelCount
		});
		this.#sourceCubeTextureView = this.#sourceCubeTexture.createView({
			dimension: '2d-array',
			baseMipLevel: 0,
			mipLevelCount: 1
		});

		this.#prefilteredTexture = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphere_Irradiance_LUTTexture_${createUUID()}`);
		this.#pipeline = this.createComputePipeline('Base', IRRADIANCE_SHADER_INFO.defaultSource);
	}

	#computeRender(
		pipeline: GPUComputePipeline,
		bindGroup: GPUBindGroup,
		workgroupSize: [number, number, number] = [16, 16, 1],
		width: number = this.width,
		height: number = this.height,
		depth: number = this.depth
	): void {
		const {gpuDevice} = this.redGPUContext;
		const commandEncoder = gpuDevice.createCommandEncoder({label: `SkyAtmosphere_${this.label}_CommandEncoder`});
		const passEncoder = commandEncoder.beginComputePass({label: `SkyAtmosphere_${this.label}_ComputePass`});

		passEncoder.setPipeline(pipeline);
		passEncoder.setBindGroup(0, bindGroup);
		passEncoder.dispatchWorkgroups(
			Math.ceil(width / workgroupSize[0]),
			Math.ceil(height / workgroupSize[1]),
			Math.ceil(depth / workgroupSize[2])
		);
		passEncoder.end();

		gpuDevice.queue.submit([commandEncoder.finish()]);
	}
}

export default SkyAtmosphereIrradianceGenerator;

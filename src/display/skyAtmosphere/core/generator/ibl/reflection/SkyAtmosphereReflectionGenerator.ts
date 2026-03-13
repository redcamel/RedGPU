import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import reflectionShaderCode_wgsl from "./skyAtmosphereReflectionShaderCode.wgsl";
import reflectionCombineShaderCode_wgsl from "./skyAtmosphereReflectionCombineShaderCode.wgsl";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import createUUID from "../../../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../../ASkyAtmosphereLUTGenerator";
import getMipLevelCount from "../../../../../../utils/texture/getMipLevelCount";
import AtmosphereShaderLibrary from "../../../AtmosphereShaderLibrary";

const REFLECTION_SHADER_INFO = parseWGSL('SkyAtmosphere_Reflection_Generator', reflectionShaderCode_wgsl, AtmosphereShaderLibrary);
const COMBINE_SHADER_INFO = parseWGSL('SkyAtmosphere_Reflection_Generator_Combine', reflectionCombineShaderCode_wgsl, AtmosphereShaderLibrary);

/**
 * [KO] 실시간 대기 산란 데이터를 기반으로 프리필터링된 반사 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a pre-filtered reflection cubemap based on real-time atmospheric scattering data.
 *
 * [KO] 대기 산란 데이터를 큐브맵으로 렌더링한 후 GGX 프리필터링을 통해 거칠기(Roughness)별 반사 데이터를 생성합니다.
 * [EN] Renders atmospheric scattering data to a cubemap, then generates reflection data by roughness through GGX pre-filtering.
 *
 * @example
 * ```typescript
 * const reflectionGenerator = new SkyAtmosphereReflectionGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * await reflectionGenerator.render(transmittance, multiScat, skyView);
 * ```
 * @category SkyAtmosphere
 */
class SkyAtmosphereReflectionGenerator extends ASkyAtmosphereLUTGenerator {
	#sourceCubeTexture: GPUTexture;
	#sourceCubeTextureView: GPUTextureView;
	#prefilteredTextureSoftCut: DirectCubeTexture;
	#prefilteredTextureNoSoftCut: DirectCubeTexture;
	#prefilteredTextureCombined: DirectCubeTexture;
	#combinedCubeTexture: GPUTexture;
	#reflectionPipeline: GPUComputePipeline;
	#combinePipeline: GPUComputePipeline;
	#combineUniformBuffer: UniformBuffer;
	#reflectionParamsUniformBuffer: UniformBuffer;

	#reflectionBindGroupSoftCut: GPUBindGroup;
	#reflectionBindGroupNoSoftCut: GPUBindGroup;
	#combineBindGroups: GPUBindGroup[] = [];

	/**
	 * [KO] SkyAtmosphereReflectionGenerator 인스턴스를 초기화합니다.
	 * [EN] Initializes a SkyAtmosphereReflectionGenerator instance.
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
		super(redGPUContext, sharedUniformBuffer, sampler, 'Reflection_Gen', 256, 256, 6);
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
		return this.#prefilteredTextureCombined;
	}

	/**
	 * [KO] 생성된 반사 큐브맵(프리필터링된 결과)을 반환합니다.
	 * [EN] Returns the generated reflection cubemap (pre-filtered result).
	 */
	get lutTexture(): DirectCubeTexture {
		return this.#prefilteredTextureCombined;
	}

	/**
	 * [KO] 반사 큐브맵을 생성하고 프리필터링을 수행합니다.
	 * [EN] Generates the reflection cubemap and performs pre-filtering.
	 *
	 * @example
	 * ```typescript
	 * await reflectionGenerator.render(transmittance, multiScat, skyView);
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
	// @ts-ignore
	async render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void> {
		const {gpuDevice} = this.redGPUContext;

		// [KO] 바인드 그룹이 없는 경우 초기화합니다.
		// [EN] Initialize bind groups if they don't exist.
		if (!this.#reflectionBindGroupSoftCut) {
			this.#reflectionBindGroupSoftCut = this.#createReflectionBindGroup(transmittance, multiScat, skyView);
			this.#reflectionBindGroupNoSoftCut = this.#createReflectionBindGroup(transmittance, multiScat, skyView);
		}

		// [KO] SoftCut 반사 패스 (모드 1u)
		// [EN] SoftCut reflection pass (mode 1u)
		this.#reflectionParamsUniformBuffer.dataViewU32[0] = 1;
		gpuDevice.queue.writeBuffer(this.#reflectionParamsUniformBuffer.gpuBuffer, 0, this.#reflectionParamsUniformBuffer.data);
		await this.#processReflectionPass(this.#reflectionPipeline, this.#reflectionBindGroupSoftCut, this.#prefilteredTextureSoftCut);

		// [KO] NoSoftCut 반사 패스 (모드 2u)
		// [EN] NoSoftCut reflection pass (mode 2u)
		this.#reflectionParamsUniformBuffer.dataViewU32[0] = 2;
		gpuDevice.queue.writeBuffer(this.#reflectionParamsUniformBuffer.gpuBuffer, 0, this.#reflectionParamsUniformBuffer.data);
		await this.#processReflectionPass(this.#reflectionPipeline, this.#reflectionBindGroupNoSoftCut, this.#prefilteredTextureNoSoftCut);

		// [KO] 컴바인 바인드 그룹 초기화 (뷰가 준비된 시점)
		if (this.#combineBindGroups.length === 0) {
			this.#initCombineBindGroups();
		}

		// [KO] 두 결과물을 거칠기에 따라 혼합
		this.#combinePrefilteredTextures();
	}

	/**
	 * [KO] 반사 렌더링을 위한 바인드 그룹을 생성합니다.
	 * [EN] Creates a bind group for reflection rendering.
	 */
	#createReflectionBindGroup(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): GPUBindGroup {
		return this.redGPUContext.gpuDevice.createBindGroup({
			label: `SkyAtmosphere_Reflection_BindGroup_${createUUID()}`,
			layout: this.#reflectionPipeline.getBindGroupLayout(0),
			entries: [
				{binding: 0, resource: this.#sourceCubeTextureView},
				{binding: 1, resource: multiScat.gpuTextureView},
				{binding: 2, resource: this.sampler.gpuSampler},
				{binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
				{binding: 4, resource: transmittance.gpuTextureView},
				{binding: 5, resource: skyView.gpuTextureView},
				{binding: 6, resource: {buffer: this.#reflectionParamsUniformBuffer.gpuBuffer}}
			]
		});
	}

	/**
	 * [KO] 단일 반사 패스를 처리합니다.
	 */
	async #processReflectionPass(pipeline: GPUComputePipeline, bindGroup: GPUBindGroup, targetTexture: DirectCubeTexture): Promise<void> {
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
			label: 'SkyAtmosphere_Reflection_Source_CubeTexture',
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

		this.#prefilteredTextureSoftCut = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphere_Reflection_SoftCut_LUTTexture_${createUUID()}`);
		this.#prefilteredTextureNoSoftCut = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphere_Reflection_NoSoftCut_LUTTexture_${createUUID()}`);

		this.#combinedCubeTexture = gpuDevice.createTexture({
			label: 'SkyAtmosphere_Reflection_Combined_CubeTexture',
			size: [this.width, this.height, 6],
			format: 'rgba16float',
			usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
			mipLevelCount: mipLevelCount
		});
		this.#prefilteredTextureCombined = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphere_Reflection_Combined_LUTTexture_${createUUID()}`, this.#combinedCubeTexture);

		// Uniform Buffers
		this.#combineUniformBuffer = new UniformBuffer(this.redGPUContext, new ArrayBuffer(16), 'SkyAtmosphere_Reflection_Combine_UniformBuffer');
		this.#reflectionParamsUniformBuffer = new UniformBuffer(this.redGPUContext, new ArrayBuffer(32), 'SkyAtmosphere_Reflection_Params_UniformBuffer');

		// Pipelines
		const createPipeline = (label: string, shaderInfo: any) => gpuDevice.createComputePipeline({
			label: `SkyAtmosphere_Reflection_Pipeline_${label}`,
			layout: 'auto',
			compute: {
				module: gpuDevice.createShaderModule({code: shaderInfo.defaultSource}),
				entryPoint: 'main'
			}
		});

		this.#reflectionPipeline = createPipeline('Base', REFLECTION_SHADER_INFO);
		this.#combinePipeline = createPipeline('Combine', COMBINE_SHADER_INFO);
	}

	#initCombineBindGroups(): void {
		const {gpuDevice} = this.redGPUContext;
		const mipLevelCount = getMipLevelCount(this.width, this.height);
		const layout = this.#combinePipeline.getBindGroupLayout(0);

		for (let mip = 0; mip < mipLevelCount; mip++) {
			const outputView = this.#combinedCubeTexture.createView({
				dimension: '2d-array',
				baseMipLevel: mip,
				mipLevelCount: 1,
				baseArrayLayer: 0,
				arrayLayerCount: 6
			});

			this.#combineBindGroups[mip] = gpuDevice.createBindGroup({
				label: `SkyAtmosphere_Reflection_BindGroup_Combine_Mip_${mip}`,
				layout: layout,
				entries: [
					{binding: 0, resource: this.#prefilteredTextureSoftCut.gpuTextureView},
					{binding: 1, resource: this.#prefilteredTextureNoSoftCut.gpuTextureView},
					{binding: 2, resource: this.sampler.gpuSampler},
					{binding: 3, resource: outputView},
					{binding: 4, resource: {buffer: this.#combineUniformBuffer.gpuBuffer}}
				]
			});
		}
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

	#combinePrefilteredTextures(): void {
		const {gpuDevice} = this.redGPUContext;
		const mipLevelCount = getMipLevelCount(this.width, this.height);

		for (let mip = 0; mip < mipLevelCount; mip++) {
			const mipWidth = Math.max(1, this.width >> mip);
			const mipHeight = Math.max(1, this.height >> mip);
			const roughness = mipLevelCount > 1 ? mip / (mipLevelCount - 1) : 0.0;

			const uniformView = this.#combineUniformBuffer.dataViewF32;
			uniformView[0] = roughness;
			uniformView[1] = mip;
			gpuDevice.queue.writeBuffer(this.#combineUniformBuffer.gpuBuffer, 0, this.#combineUniformBuffer.data);

			this.#computeRender(this.#combinePipeline, this.#combineBindGroups[mip], [8, 8, 1], mipWidth, mipHeight, 6);
		}

		this.#prefilteredTextureCombined.notifyUpdate();
	}
}

export default SkyAtmosphereReflectionGenerator;

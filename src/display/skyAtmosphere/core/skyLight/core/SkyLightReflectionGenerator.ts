import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import {COMMAND_ENCODER_TYPE} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import specularShaderCode_wgsl from "./skyLightReflectionShaderCode.wgsl";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import createUUID from "../../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../../generator/ASkyAtmosphereLUTGenerator";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";


/**
 * [KO] 대기 산란 데이터를 기반으로 간접 스펙큘러 조명(Reflection)용 큐브맵을 베이킹하고 거칠기(Roughness)별 밉맵을 프리필터링하는 생성기입니다.
 * [EN] Generator that bakes a cubemap for indirect specular lighting (Reflection) based on atmospheric scattering data and prefilters mipmaps by roughness.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
class SkyLightReflectionGenerator extends ASkyAtmosphereLUTGenerator {
    #sourceCubeTexture: GPUTexture;
    #sourceCubeTextureView: GPUTextureView;
    #lutTexture: DirectCubeTexture;
    #pipeline: GPUComputePipeline;
    #bindGroup: GPUBindGroup;

    /**
     * [KO] SkyLightReflectionGenerator 인스턴스를 생성합니다.
     * [EN] Creates a SkyLightReflectionGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     * @param sampler -
     * [KO] LUT 샘플링용 샘플러
     * [EN] Sampler for LUT sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SkyLight_Reflection_Gen', 256, 256, 6);
        this.#init();
    }

    /**
     * [KO] 거칠기별 프리필터링이 완료된 반사 LUT 큐브 텍스처를 반환합니다.
     * [EN] Returns the reflection LUT cube texture prefiltered by roughness.
     *
     * @returns
     * [KO] DirectCubeTexture 인스턴스
     * [EN] DirectCubeTexture instance
     */
    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 대기 LUT 텍스처들을 입력받아 스펙큘러 반사용 큐브맵을 렌더링하고 프리필터링합니다.
     * [EN] Renders and prefilters the specular reflection cubemap using atmospheric LUT textures as input.
     *
     * @param transmittance -
     * [KO] 대기 투과율(Transmittance) LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param skyView -
     * [KO] 스카이 뷰(Sky View) LUT 텍스처
     * [EN] Sky View LUT texture
     * @returns
     * [KO] 렌더링 완료 Promise (`Promise<void>`)
     * [EN] Render completion Promise (`Promise<void>`)
     */
    async render(transmittance: DirectTexture, skyView: DirectTexture): Promise<void> {
        if (!this.#bindGroup) {
            this.#bindGroup = this.#createBindGroup(transmittance, skyView);
        }
        await this.#processPass(this.#pipeline, this.#bindGroup, this.#lutTexture);
    }

    /**
     * [KO] 생성기 및 내부 큐브 텍스처 리소스를 해제합니다.
     * [EN] Releases the generator and internal cube texture resources.
     */
    destroy(): void {
        super.destroy();
        if (this.#sourceCubeTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#sourceCubeTexture);
        }
        this.#sourceCubeTexture = null;
        this.#sourceCubeTextureView = null;
        this.#lutTexture = null;
        this.#pipeline = null;
        this.#bindGroup = null;
    }

    #createBindGroup(transmittance: DirectTexture, skyView: DirectTexture): GPUBindGroup {
        return this.createBindGroup(`SkyLight_Reflection_BindGroup_${createUUID()}`, this.#pipeline, [
            {binding: 0, resource: this.#sourceCubeTextureView},
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
        }, true, COMMAND_ENCODER_TYPE.RESOURCE);
        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, targetTexture, COMMAND_ENCODER_TYPE.RESOURCE);
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);
        const SPECULAR_SHADER_INFO = this.resourceManager.wgslParser.parse('SkyLight_Reflection_Generator', specularShaderCode_wgsl);

        this.#sourceCubeTexture = gpuDevice.createTexture({
            label: 'SkyLight_Reflection_Source_CubeTexture',
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

        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `SkyLight_Reflection_LUTTexture_${createUUID()}`);
        this.#pipeline = this.createComputePipeline('Base', SPECULAR_SHADER_INFO.defaultSource);
    }

    #computeRender(
        pipeline: GPUComputePipeline,
        bindGroup: GPUBindGroup,
        workgroupSize: [number, number, number]
    ): void {
        const {commandEncoderManager} = this.redGPUContext;
        commandEncoderManager.addResourceComputePass(`SkyLight_${this.label}_ComputePass`, (passEncoder) => {
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(
                Math.ceil(this.width / workgroupSize[0]),
                Math.ceil(this.height / workgroupSize[1]),
                Math.ceil(this.depth / workgroupSize[2])
            );
        });
    }
}

Object.freeze(SkyLightReflectionGenerator);
export default SkyLightReflectionGenerator;

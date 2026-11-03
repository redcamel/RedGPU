import RedGPUContext from "../../../../context/RedGPUContext";
import SkyAtmosphere from "../../SkyAtmosphere";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import Sampler from "../../../../resources/sampler/Sampler";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../generator/ASkyAtmosphereLUTGenerator";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import createUUID from "../../../../utils/uuid/createUUID";
import sourceBakeShaderCode_wgsl from "./core/skyLightSourceBakeShaderCode.wgsl";

const IRRADIANCE_COPY_SIZE: GPUExtent3DStrict = Object.freeze({
    width: 32,
    height: 32,
    depthOrArrayLayers: 6
});

/**
 * [KO] SkyAtmosphere의 대기 산란 데이터를 기반으로 실시간 간접 조명(IBL)용 정반사(Reflection, Cube 0) 및 난반사(Irradiance, Cube 1) 통합 큐브맵 배열(`texture_cube_array<f32>`)을 생성하는 클래스입니다.
 * [EN] Class that generates an integrated specular (Reflection, Cube 0) and diffuse (Irradiance, Cube 1) cubemap array (`texture_cube_array<f32>`) for real-time indirect lighting (IBL) based on SkyAtmosphere's atmospheric scattering data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
class SkyLight extends ASkyAtmosphereLUTGenerator {
    #reflectionSourceTexture: GPUTexture;
    #reflectionSourceDescriptor: GPUTextureDescriptor;
    #irradianceSourceTexture: GPUTexture;
    #irradianceSourceDescriptor: GPUTextureDescriptor;
    #irradianceTargetTexture: GPUTexture;
    #skyLightTexture: DirectCubeTexture;
    #copySrcInfo: GPUTexelCopyTextureInfo;
    #copyDstInfo: GPUTexelCopyTextureInfo;
    #copyExecutor: (encoder: GPUCommandEncoder) => void;
    #pipeline: GPUComputePipeline;
    #bindGroup: GPUBindGroup;

    /**
     * [KO] SkyLight 인스턴스를 생성합니다.
     * [EN] Creates a SkyLight instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     * @param sampler -
     * [KO] 대기 산란 샘플링용 샘플러
     * [EN] Sampler for atmospheric scattering sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SkyLight_Source_Gen', 256, 256, 6);
        this.#init();
    }

    /**
     * [KO] 생성된 통합 IBL 큐브맵 배열 텍스처(`DirectCubeTexture`)를 반환합니다.
     * [EN] Returns the generated integrated IBL cubemap array texture (`DirectCubeTexture`).
     *
     * @returns
     * [KO] 통합 IBL `DirectCubeTexture` 인스턴스
     * [EN] Integrated IBL `DirectCubeTexture` instance
     */
    get lutTexture(): DirectCubeTexture {
        return this.#skyLightTexture;
    }

    /**
     * [KO] SkyAtmosphere의 LUT 데이터를 기반으로 정반사 및 난반사 소스 큐브맵을 단일 패스로 베이킹하고 통합 IBL 큐브맵 배열을 갱신합니다.
     * [EN] Bakes specular and diffuse source cubemaps in a single pass based on SkyAtmosphere's LUT data and updates the integrated IBL cubemap array.
     *
     * @param skyAtmosphere -
     * [KO] 소스 SkyAtmosphere 인스턴스
     * [EN] Source SkyAtmosphere instance
     */
    update(skyAtmosphere: SkyAtmosphere): void {
        const {transmittanceLUT, skyViewLUT} = skyAtmosphere;
        if (!this.#bindGroup) {
            this.#bindGroup = this.#createBindGroup(transmittanceLUT, skyViewLUT);
        }
        const {resourceManager, commandEncoderManager} = this.redGPUContext;
        this.executeComputePass(this.#pipeline, this.#bindGroup, 8, 8, 1, false);
        resourceManager.mipmapGenerator.generateMipmap(this.#reflectionSourceTexture, this.#reflectionSourceDescriptor, true, COMMAND_ENCODER_TYPE.RESOURCE);
        resourceManager.mipmapGenerator.generateMipmap(this.#irradianceSourceTexture, this.#irradianceSourceDescriptor, true, COMMAND_ENCODER_TYPE.RESOURCE);
        resourceManager.prefilterGenerator.generate(this.#reflectionSourceTexture, this.width, this.#skyLightTexture, COMMAND_ENCODER_TYPE.RESOURCE);
        resourceManager.irradianceGenerator.render(
            this.#irradianceSourceTexture,
            this.#irradianceTargetTexture,
            COMMAND_ENCODER_TYPE.RESOURCE
        );
        commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, this.#copyExecutor);
        this.#skyLightTexture.notifyUpdate();
    }

    /**
     * [KO] SkyLight 인스턴스 및 내부 GPU 텍스처 리소스를 해제합니다.
     * [EN] Releases the SkyLight instance and internal GPU texture resources.
     */
    destroy(): void {
        super.destroy();
        if (this.#reflectionSourceTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#reflectionSourceTexture);
        }
        if (this.#irradianceSourceTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#irradianceSourceTexture);
        }
        if (this.#irradianceTargetTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#irradianceTargetTexture);
        }
        this.#reflectionSourceTexture = null;
        this.#reflectionSourceDescriptor = null;
        this.#irradianceSourceTexture = null;
        this.#irradianceSourceDescriptor = null;
        this.#irradianceTargetTexture = null;
        this.#skyLightTexture = null;
        this.#copySrcInfo = null;
        this.#copyDstInfo = null;
        this.#copyExecutor = null;
        this.#pipeline = null;
        this.#bindGroup = null;
    }

    #createBindGroup(transmittance: DirectTexture, skyView: DirectTexture): GPUBindGroup {
        return this.createBindGroup('SkyLight_Source_Bake_BindGroup', this.#pipeline, [
            {
                binding: 0,
                resource: this.#reflectionSourceTexture.createView({
                    dimension: '2d-array',
                    baseMipLevel: 0,
                    mipLevelCount: 1
                })
            },
            {
                binding: 1,
                resource: this.#irradianceSourceTexture.createView({
                    dimension: '2d-array',
                    baseMipLevel: 0,
                    mipLevelCount: 1
                })
            },
            {binding: 2, resource: this.sampler.gpuSampler},
            {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
            {binding: 4, resource: transmittance.gpuTextureView},
            {binding: 5, resource: skyView.gpuTextureView}
        ]);
    }

    #init(): void {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);
        const SOURCE_BAKE_SHADER_INFO = resourceManager.wgslParser.parse('SkyLight_Source_Bake_Generator', sourceBakeShaderCode_wgsl);

        this.#reflectionSourceDescriptor = {
            label: 'SkyLight_Reflection_Source_CubeTexture',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount: mipLevelCount,
            dimension: '2d'
        };
        this.#reflectionSourceTexture = gpuDevice.createTexture(this.#reflectionSourceDescriptor);

        this.#irradianceSourceDescriptor = {
            label: 'SkyLight_Irradiance_Source_CubeTexture',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount: mipLevelCount,
            dimension: '2d'
        };
        this.#irradianceSourceTexture = gpuDevice.createTexture(this.#irradianceSourceDescriptor);

        this.#irradianceTargetTexture = resourceManager.createManagedTexture({
            label: 'SkyAtmosphere_Irradiance_LUT',
            size: [32, 32, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
            mipLevelCount: 1,
            dimension: '2d'
        });

        const skyLightGPUTexture = resourceManager.createManagedTexture({
            label: 'SkyAtmosphere_SkyLight_CubeArray_Texture',
            size: [this.width, this.height, 12],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            mipLevelCount: mipLevelCount,
            dimension: '2d'
        });
        this.#skyLightTexture = new DirectCubeTexture(
            this.redGPUContext,
            `SkyAtmosphere_SkyLight_CubeArray_${createUUID()}`,
            skyLightGPUTexture
        );

        this.#copySrcInfo = {
            texture: this.#irradianceTargetTexture,
            mipLevel: 0,
            origin: {x: 0, y: 0, z: 0}
        };
        this.#copyDstInfo = {
            texture: skyLightGPUTexture,
            mipLevel: 3,
            origin: {x: 0, y: 0, z: 6}
        };
        this.#copyExecutor = (encoder: GPUCommandEncoder) => {
            encoder.copyTextureToTexture(this.#copySrcInfo, this.#copyDstInfo, IRRADIANCE_COPY_SIZE);
        };

        this.#pipeline = this.createComputePipeline('SkyLight_Source_Bake_Pipeline', SOURCE_BAKE_SHADER_INFO.defaultSource);
    }
}

Object.freeze(SkyLight);
export default SkyLight;

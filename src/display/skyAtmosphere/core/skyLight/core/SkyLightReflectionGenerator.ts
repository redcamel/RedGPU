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
    #sourceTextureDescriptor: GPUTextureDescriptor;
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
     */
    render(transmittance: DirectTexture, skyView: DirectTexture): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.#createBindGroup(transmittance, skyView);
        }
        const {resourceManager} = this.redGPUContext;
        this.executeComputePass(this.#pipeline, this.#bindGroup, 8, 8, 1, false);
        resourceManager.mipmapGenerator.generateMipmap(this.#sourceCubeTexture, this.#sourceTextureDescriptor, true, COMMAND_ENCODER_TYPE.RESOURCE);
        resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, this.#lutTexture, COMMAND_ENCODER_TYPE.RESOURCE);
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
        this.#sourceTextureDescriptor = null;
        this.#lutTexture = null;
        this.#pipeline = null;
        this.#bindGroup = null;
    }

    #createBindGroup(transmittance: DirectTexture, skyView: DirectTexture): GPUBindGroup {
        return this.createBindGroup('SkyLight_Reflection_BindGroup', this.#pipeline, [
            {binding: 0, resource: this.#sourceCubeTextureView},
            {binding: 2, resource: this.sampler.gpuSampler},
            {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
            {binding: 4, resource: transmittance.gpuTextureView},
            {binding: 5, resource: skyView.gpuTextureView}
        ]);
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);
        const SPECULAR_SHADER_INFO = this.resourceManager.wgslParser.parse('SkyLight_Reflection_Generator', specularShaderCode_wgsl);

        this.#sourceTextureDescriptor = {
            label: 'SkyLight_Reflection_Source_CubeTexture',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount: mipLevelCount,
            dimension: '2d'
        };
        this.#sourceCubeTexture = gpuDevice.createTexture(this.#sourceTextureDescriptor);
        this.#sourceCubeTextureView = this.#sourceCubeTexture.createView({
            dimension: '2d-array',
            baseMipLevel: 0,
            mipLevelCount: 1
        });

        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `SkyLight_Reflection_LUTTexture_${createUUID()}`);
        this.#pipeline = this.createComputePipeline('SkyLight_Reflection_Pipeline', SPECULAR_SHADER_INFO.defaultSource);
    }
}

Object.freeze(SkyLightReflectionGenerator);
export default SkyLightReflectionGenerator;

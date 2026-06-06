import RedGPUContext from "../../../../context/RedGPUContext";
import Sampler from "../../../../resources/sampler/Sampler";
import irradianceShaderCode_wgsl from "./skyLightIrradianceShaderCode.wgsl";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import createUUID from "../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../../core/generator/ASkyAtmosphereLUTGenerator";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

const IRRADIANCE_SHADER_INFO = parseWGSL('SkyLight_Irradiance_Generator', irradianceShaderCode_wgsl);

/**
 * [KO] SkyLightIrradianceGenerator는 대기 산란 기반의 간접 디퓨즈 조명(Irradiance)을 생성합니다.
 * [EN] SkyLightIrradianceGenerator generates indirect diffuse lighting (Irradiance) based on atmospheric scattering.
 *
 * [KO] 하늘의 모든 방향에 대한 기초 산란광을 큐브맵에 베이킹하고, 이를 다시 디퓨즈 조명용으로 가공합니다.
 * [EN] Bakes base scattered light from all directions of the sky into a cubemap and processes it for diffuse lighting.
 */
class SkyLightIrradianceGenerator extends ASkyAtmosphereLUTGenerator {
    #sourceCubeTexture: GPUTexture;
    #sourceCubeTextureView: GPUTextureView;
    #prefilteredTexture: DirectCubeTexture;
    #pipeline: GPUComputePipeline;
    #bindGroup: GPUBindGroup;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SkyLight_Irradiance_Gen', 256, 256, 6);
        this.#init();
    }

    get sourceCubeTexture(): GPUTexture {
        return this.#sourceCubeTexture;
    }

    get prefilteredTexture(): DirectCubeTexture {
        return this.#prefilteredTexture;
    }

    get lutTexture(): DirectCubeTexture {
        return this.#prefilteredTexture;
    }

    // @ts-ignore
    async render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void> {
        if (!this.#bindGroup) {
            this.#bindGroup = this.#createBindGroup(transmittance, multiScat, skyView);
        }
        await this.#processPass(this.#pipeline, this.#bindGroup, this.#prefilteredTexture);
    }

    #createBindGroup(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): GPUBindGroup {
        return this.createBindGroup(`SkyLight_Irradiance_BindGroup_${createUUID()}`, this.#pipeline, [
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
        }, true, COMMAND_ENCODER_TYPE.RESOURCE);
        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, targetTexture, COMMAND_ENCODER_TYPE.RESOURCE);
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);

        this.#sourceCubeTexture = gpuDevice.createTexture({
            label: 'SkyLight_Irradiance_Source_CubeTexture',
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

        this.#prefilteredTexture = new DirectCubeTexture(this.redGPUContext, `SkyLight_Irradiance_LUTTexture_${createUUID()}`);
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
        const {commandEncoderManager} = this.redGPUContext;
        commandEncoderManager.addResourceComputePass(`SkyLight_${this.label}_ComputePass`, (passEncoder) => {
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(
                Math.ceil(width / workgroupSize[0]),
                Math.ceil(height / workgroupSize[1]),
                Math.ceil(depth / workgroupSize[2])
            );
        });
    }
}

Object.freeze(SkyLightIrradianceGenerator);
export default SkyLightIrradianceGenerator;
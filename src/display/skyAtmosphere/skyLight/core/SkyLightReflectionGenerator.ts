import RedGPUContext from "../../../../context/RedGPUContext";
import Sampler from "../../../../resources/sampler/Sampler";
import specularShaderCode_wgsl from "./skyLightReflectionShaderCode.wgsl";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import createUUID from "../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../../core/generator/ASkyAtmosphereLUTGenerator";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import AtmosphereShaderLibrary from "../../core/AtmosphereShaderLibrary";

const SPECULAR_SHADER_INFO = parseWGSL('SkyLight_Reflection_Generator', specularShaderCode_wgsl, AtmosphereShaderLibrary);

class SkyLightReflectionGenerator extends ASkyAtmosphereLUTGenerator {
    #sourceCubeTexture: GPUTexture;
    #sourceCubeTextureView: GPUTextureView;
    #prefilteredTexture: DirectCubeTexture;
    #pipeline: GPUComputePipeline;
    #bindGroup: GPUBindGroup;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SkyLight_Reflection_Gen', 256, 256, 6);
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
        return this.createBindGroup(`SkyLight_Reflection_BindGroup_${createUUID()}`, this.#pipeline, [
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

        this.#prefilteredTexture = new DirectCubeTexture(this.redGPUContext, `SkyLight_Reflection_LUTTexture_${createUUID()}`);
        this.#pipeline = this.createComputePipeline('Base', SPECULAR_SHADER_INFO.defaultSource);
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
        const commandEncoder = gpuDevice.createCommandEncoder({label: `SkyLight_${this.label}_CommandEncoder`});
        const passEncoder = commandEncoder.beginComputePass({label: `SkyLight_${this.label}_ComputePass`});

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

Object.freeze(SkyLightReflectionGenerator);
export default SkyLightReflectionGenerator;

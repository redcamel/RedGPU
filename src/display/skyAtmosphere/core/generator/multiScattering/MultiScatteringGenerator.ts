import RedGPUContext from "../../../../../context/RedGPUContext";
import multiScatteringShaderCode_wgsl from "./multiScatteringShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";
import AtmosphereShaderLibrary from "../../AtmosphereShaderLibrary";

const SHADER_INFO = parseWGSL('SkyAtmosphere_MultiScattering_Generator', multiScatteringShaderCode_wgsl, AtmosphereShaderLibrary);

class MultiScatteringGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'MultiScattering_Gen', 32, 32);
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    render(transmittanceLUT: DirectTexture): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_MultiScattering_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: transmittanceLUT.gpuTextureView},
                {binding: 2, resource: this.sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup, [8, 8, 1]);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_MultiScat_LUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_MultiScattering_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(MultiScatteringGenerator);
export default MultiScatteringGenerator;
import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode_wgsl from "./transmittanceShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";
import AtmosphereShaderLibrary from "../../AtmosphereShaderLibrary";

const SHADER_INFO = parseWGSL('SkyAtmosphere_Transmittance_Generator', transmittanceShaderCode_wgsl, AtmosphereShaderLibrary);

class TransmittanceGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'Transmittance_Gen', 256, 64);
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    render(): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_Transmittance_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_Transmittance_LUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_Transmittance_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(TransmittanceGenerator);
export default TransmittanceGenerator;
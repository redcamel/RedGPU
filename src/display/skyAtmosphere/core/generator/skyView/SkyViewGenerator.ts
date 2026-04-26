import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import skyViewShaderCode_wgsl from "./skyViewShaderCode.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";
import AtmosphereShaderLibrary from "../../AtmosphereShaderLibrary";

const SHADER_INFO = parseWGSL('SkyAtmosphere_SkyView_Generator', skyViewShaderCode_wgsl, AtmosphereShaderLibrary);

class SkyViewGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SkyView_Gen', 512, 256);
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    render(transmittanceLUT: DirectTexture, multiScatLUT: DirectTexture): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_SkyView_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView}, 
                {binding: 1, resource: transmittanceLUT.gpuTextureView}, 
                {binding: 2, resource: multiScatLUT.gpuTextureView}, 
                {binding: 3, resource: this.sampler.gpuSampler}, 
                {binding: 4, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}} 
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_SkyView_LUTTexture_${createUUID()}`, this.createLUTTexture(false));
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_SkyView_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(SkyViewGenerator);
export default SkyViewGenerator;
import RedGPUContext from "../../../../../context/RedGPUContext";
import multiScatteringShaderCode from "./multiScatteringShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + multiScatteringShaderCode, 'MULTI_SCATTERING_GENERATOR');

/**
 * [KO] 다중 산란(Multi-Scattering) 에너지 보정을 위한 LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating LUT for Multi-Scattering energy compensation.
 */
class MultiScatteringGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'MULTI_SCATTERING_GEN', 32, 32);
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    render(transmittanceTexture: DirectTexture): void {
        const {gpuDevice} = this.redGPUContext;
        const bindGroup = gpuDevice.createBindGroup({
            label: 'MULTI_SCATTERING_GEN_BG',
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]
        });
        this.gpuRender(bindGroup, [8, 8, 1]);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `MultiScatteringLUTTexture_${createUUID()}`, this.createLUTTexture());
        this.pipeline = this.redGPUContext.gpuDevice.createComputePipeline({
            label: 'MULTI_SCATTERING_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: this.redGPUContext.gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }
}

export default MultiScatteringGenerator;

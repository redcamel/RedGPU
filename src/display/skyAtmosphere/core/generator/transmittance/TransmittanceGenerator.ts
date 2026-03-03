import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode from "./transmittanceShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + transmittanceShaderCode, 'TRANSMITTANCE_GENERATOR');

/**
 * [KO] 대기 투과율(Transmittance) LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating Atmospheric Transmittance LUT.
 */
class TransmittanceGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'TRANSMITTANCE_GEN', 256, 64);
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    render(): void {
        const {gpuDevice} = this.redGPUContext;
        const bindGroup = gpuDevice.createBindGroup({
            label: 'TRANSMITTANCE_GEN_BG',
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]
        });
        this.gpuRender(bindGroup);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, 'TransmittanceLUTTexture', this.createLUTTexture());
        this.pipeline = this.redGPUContext.gpuDevice.createComputePipeline({
            label: 'TRANSMITTANCE_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: this.redGPUContext.gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }
}

export default TransmittanceGenerator;

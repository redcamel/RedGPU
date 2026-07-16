import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode_wgsl from "./transmittanceShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";


/**
 * [KO] TransmittanceGenerator는 대기 투과율(Transmittance) LUT를 생성합니다.
 * [EN] TransmittanceGenerator creates the Transmittance LUT.
 *
 * [KO] 이 LUT는 대기의 특정 고도와 시야각에서 빛이 대기를 통과할 때 얼마나 감쇠되는지를 미리 계산하여 저장합니다. 모든 대기 산란 연산의 가장 기초가 되는 데이터입니다.
 * [EN] This LUT precomputes and stores how much light is attenuated when passing through the atmosphere at specific altitudes and viewing angles. It is the most fundamental data for all atmospheric scattering calculations.
 *
 * @category SkyAtmosphere
 */
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
        this.executeComputePass(this.#pipeline, this.#bindGroup, [16, 16, 1]);
    }

    #init(): void {
        const SHADER_INFO = this.resourceManager.wgslParser.parse('SkyAtmosphere_Transmittance_Generator', transmittanceShaderCode_wgsl);

        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_Transmittance_LUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_Transmittance_Pipeline', SHADER_INFO.defaultSource);
    }

    destroy(): void {
        super.destroy();
        this.#lutTexture = null;
        this.#bindGroup = null;
        this.#pipeline = null;
    }
}

Object.freeze(TransmittanceGenerator);
export default TransmittanceGenerator;
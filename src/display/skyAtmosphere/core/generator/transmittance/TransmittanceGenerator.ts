import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode_wgsl from "./transmittanceShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";


/**
 * [KO] 대기의 고도와 시야각에 따른 빛의 감쇠율을 저장하는 대기 투과율(Transmittance) 2D LUT 생성기입니다.
 * [EN] Generator for the Transmittance 2D LUT that stores light attenuation rates according to atmospheric altitude and viewing angle.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
class TransmittanceGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;

    /**
     * [KO] TransmittanceGenerator 인스턴스를 생성합니다.
     * [EN] Creates a TransmittanceGenerator instance.
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
        super(redGPUContext, sharedUniformBuffer, sampler, 'Transmittance_Gen', 256, 64);
        this.#init();
    }

    /**
     * [KO] 생성된 대기 투과율(Transmittance) LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Transmittance LUT texture.
     *
     * @returns
     * [KO] DirectTexture 인스턴스
     * [EN] DirectTexture instance
     */
    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 공유 대기 파라미터를 기반으로 투과율 LUT를 계산합니다.
     * [EN] Computes the transmittance LUT based on shared atmospheric parameters.
     */
    render(): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_Transmittance_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup, [16, 16, 1]);
    }

    /**
     * [KO] 생성기 및 내부 리소스를 해제합니다.
     * [EN] Releases the generator and internal resources.
     */
    destroy(): void {
        super.destroy();
        this.#lutTexture = null;
        this.#bindGroup = null;
        this.#pipeline = null;
    }

    #init(): void {
        const SHADER_INFO = this.resourceManager.wgslParser.parse('SkyAtmosphere_Transmittance_Generator', transmittanceShaderCode_wgsl);

        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_Transmittance_LUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_Transmittance_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(TransmittanceGenerator);
export default TransmittanceGenerator;
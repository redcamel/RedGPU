import RedGPUContext from "../../../../../context/RedGPUContext";
import multiScatteringShaderCode_wgsl from "./multiScatteringShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";


/**
 * [KO] 대기 입자 간의 다중 산란(Multi-Scattering) 에너지를 계산하여 저장하는 2D LUT 생성기입니다.
 * [EN] Generator for the 2D LUT that computes and stores multi-scattering energy between atmospheric particles.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
class MultiScatteringGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;

    /**
     * [KO] MultiScatteringGenerator 인스턴스를 생성합니다.
     * [EN] Creates a MultiScatteringGenerator instance.
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
        super(redGPUContext, sharedUniformBuffer, sampler, 'MultiScattering_Gen', 32, 32);
        this.#init();
    }

    /**
     * [KO] 생성된 다중 산란(Multi-Scattering) LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Multi-Scattering LUT texture.
     *
     * @returns
     * [KO] DirectTexture 인스턴스
     * [EN] DirectTexture instance
     */
    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 투과율 LUT를 기반으로 다중 산란 LUT를 계산합니다.
     * [EN] Computes the multi-scattering LUT based on the transmittance LUT.
     *
     * @param transmittance -
     * [KO] 투과율(Transmittance) LUT 텍스처
     * [EN] Transmittance LUT texture
     */
    render(transmittance: DirectTexture): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_MultiScattering_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: transmittance.gpuTextureView},
                {binding: 2, resource: this.sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup, [1, 1, 1]);
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
        const SHADER_INFO = this.resourceManager.wgslParser.parse('SkyAtmosphere_MultiScattering_Generator', multiScatteringShaderCode_wgsl);
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_MultiScat_LUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_MultiScattering_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(MultiScatteringGenerator);
export default MultiScatteringGenerator;
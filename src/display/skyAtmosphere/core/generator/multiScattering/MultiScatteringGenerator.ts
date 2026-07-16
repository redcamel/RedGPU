import RedGPUContext from "../../../../../context/RedGPUContext";
import multiScatteringShaderCode_wgsl from "./multiScatteringShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";


/**
 * [KO] MultiScatteringGenerator는 다중 산란(Multi-Scattering) LUT를 생성합니다.
 * [EN] MultiScatteringGenerator creates the Multi-Scattering LUT.
 *
 * [KO] 빛이 대기 입자에 여러 번 부딪혀 발생하는 추가적인 산란광을 시뮬레이션합니다. 이를 통해 하늘의 전체적인 에너지 보존을 실현하고, 대기가 더 밝고 풍부하게 표현되도록 합니다.
 * [EN] Simulates additional scattered light caused by light hitting atmospheric particles multiple times. This achieves overall energy conservation in the sky and makes the atmosphere appear brighter and richer.
 *
 * @category SkyAtmosphere
 */
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

    render(transmittance: DirectTexture): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_MultiScattering_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: transmittance.gpuTextureView},
                {binding: 2, resource: this.sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup, [8, 8, 1]);
    }

    #init(): void {
        const SHADER_INFO = this.resourceManager.wgslParser.parse('SkyAtmosphere_MultiScattering_Generator', multiScatteringShaderCode_wgsl);
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_MultiScat_LUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_MultiScattering_Pipeline', SHADER_INFO.defaultSource);
    }

    destroy(): void {
        super.destroy();
        this.#lutTexture = null;
        this.#bindGroup = null;
        this.#pipeline = null;
    }
}

Object.freeze(MultiScatteringGenerator);
export default MultiScatteringGenerator;
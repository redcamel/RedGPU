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
 *
 * [KO] 단일 산란(Single Scattering) 모델에서 손실되는 에너지를 보정하여 대기의 밝기를 물리적으로 더 정확하게 시뮬레이션합니다.
 * [EN] Physically more accurately simulates atmospheric brightness by compensating for energy lost in Single Scattering models.
 *
 * @example
 * ```typescript
 * const multiScatteringGenerator = new MultiScatteringGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * multiScatteringGenerator.render(transmittanceTexture);
 * ```
 * @category SkyAtmosphere
 */
class MultiScatteringGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;

    /**
     * [KO] MultiScatteringGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes a MultiScatteringGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @param sharedUniformBuffer -
     * [KO] 공유 유니폼 버퍼
     * [EN] Shared uniform buffer
     * @param sampler -
     * [KO] LUT 샘플링에 사용할 샘플러
     * [EN] Sampler to be used for LUT sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'MULTI_SCATTERING_GEN', 32, 32);
        this.#init();
    }

    /**
     * [KO] 생성된 다중 산란 LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Multi-Scattering LUT texture.
     */
    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 다중 산란 LUT를 렌더링(Compute)합니다.
     * [EN] Renders (computes) the Multi-Scattering LUT.
     *
     * @example
     * ```typescript
     * multiScatteringGenerator.render(transmittanceTexture);
     * ```
     * @param transmittanceTexture -
     * [KO] 투과율 LUT 텍스처 (계산에 참조됨)
     * [EN] Transmittance LUT texture (referenced for calculation)
     */
    render(transmittanceTexture: DirectTexture): void {
        if (!this.#bindGroup) {
            const {gpuDevice} = this.redGPUContext;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: 'MULTI_SCATTERING_GEN_BG',
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    {binding: 0, resource: this.#lutTexture.gpuTextureView},
                    {binding: 1, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
                ]
            });
        }
        this.executeComputePass(this.#bindGroup, [8, 8, 1]);
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

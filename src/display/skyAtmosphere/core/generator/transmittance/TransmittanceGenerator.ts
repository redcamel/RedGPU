import RedGPUContext from "../../../../../context/RedGPUContext";
import transmittanceShaderCode_wgsl from "./transmittanceShaderCode.wgsl";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import skyAtmosphereFn_wgsl from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import Sampler from "../../../../../resources/sampler/Sampler";
import createUUID from "../../../../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL(skyAtmosphereFn_wgsl + transmittanceShaderCode_wgsl, 'TRANSMITTANCE_GENERATOR');

/**
 * [KO] 대기 투과율(Transmittance) LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating Atmospheric Transmittance LUT.
 *
 * [KO] 태양빛이 대기를 통과하며 감쇄되는 비율을 고도와 각도별로 사전 계산하여 저장합니다.
 * [EN] Pre-calculates and stores the ratio of sunlight attenuation as it passes through the atmosphere by altitude and angle.
 *
 * @example
 * ```typescript
 * const transmittanceGenerator = new TransmittanceGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * transmittanceGenerator.render();
 * ```
 * @category SkyAtmosphere
 */
class TransmittanceGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;

    /**
     * [KO] TransmittanceGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes a TransmittanceGenerator instance.
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
        super(redGPUContext, sharedUniformBuffer, sampler, 'TRANSMITTANCE_GEN', 256, 64);
        this.#init();
    }

    /**
     * [KO] 생성된 투과율 LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Transmittance LUT texture.
     */
    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 투과율 LUT를 렌더링(Compute)합니다.
     * [EN] Renders (computes) the Transmittance LUT.
     *
     * @example
     * ```typescript
     * transmittanceGenerator.render();
     * ```
     */
    render(): void {
        if (!this.#bindGroup) {
            const {gpuDevice} = this.redGPUContext;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: 'TRANSMITTANCE_GEN_BG',
                layout: this.#pipeline.getBindGroupLayout(0),
                entries: [
                    {binding: 0, resource: this.#lutTexture.gpuTextureView}, // transmittanceLUT
                    {binding: 1, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}} // params
                ]
            });
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `TransmittanceLUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.redGPUContext.gpuDevice.createComputePipeline({
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

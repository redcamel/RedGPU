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

/**
 * [KO] 카메라 시점에서의 전방위 하늘색 데이터를 담는 Sky-View LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating Sky-View LUT containing all-around sky color data from the camera perspective.
 *
 * [KO] 현재 카메라 위치에서 하늘의 모든 방향에 대한 산란광 휘도(Radiance)를 사전 계산하여 2D 텍스처로 저장합니다.
 * [EN] Pre-calculates and stores the scattered light radiance for all sky directions from the current camera position as a 2D texture.
 *
 * @example
 * ```typescript
 * const skyViewGenerator = new SkyViewGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * skyViewGenerator.render(transmittanceTexture, multiScatteringTexture);
 * ```
 * @category SkyAtmosphere
 */
class SkyViewGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;

    /**
     * [KO] SkyViewGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes a SkyViewGenerator instance.
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
        super(redGPUContext, sharedUniformBuffer, sampler, 'SkyView_Gen', 512, 256);
        this.#init();
    }

    /**
     * [KO] 생성된 스카이 뷰 LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Sky-View LUT texture.
     */
    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 스카이 뷰 LUT를 렌더링(Compute)합니다.
     * [EN] Renders (computes) the Sky-View LUT.
     *
     * @example
     * ```typescript
     * skyViewGenerator.render(transmittance, multiScat);
     * ```
     * @param transmittance -
     * [KO] 투과율 LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScat -
     * [KO] 다중 산란 LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     */
    render(transmittanceLUT: DirectTexture, multiScatLUT: DirectTexture): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_SkyView_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView}, // skyViewLUT
                {binding: 1, resource: transmittanceLUT.gpuTextureView}, // transmittanceLUT
                {binding: 2, resource: multiScatLUT.gpuTextureView}, // multiScatLUT
                {binding: 3, resource: this.sampler.gpuSampler}, // skyAtmosphereSampler
                {binding: 4, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}} // params
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_SkyView_LUTTexture_${createUUID()}`, this.createLUTTexture());
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_SkyView_Pipeline', SHADER_INFO.defaultSource);
    }
}

export default SkyViewGenerator;

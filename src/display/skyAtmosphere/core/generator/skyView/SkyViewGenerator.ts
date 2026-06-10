import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import skyViewShaderCode_wgsl from "./skyViewShaderCode.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL('SkyAtmosphere_SkyView_Generator', skyViewShaderCode_wgsl);

/**
 * [KO] SkyViewGenerator는 스카이 뷰(Sky View) LUT를 생성합니다.
 * [EN] SkyViewGenerator creates the Sky View LUT.
 *
 * [KO] 현재 카메라 위치를 기준으로 하늘의 모든 방향에 대한 산란광 강도를 미리 계산하여 2D 텍스처에 저장합니다. 이를 통해 배경(Skybox) 렌더링 시 복잡한 물리 연산 없이 고속으로 하늘을 그릴 수 있습니다.
 * [EN] Precomputes the scattered light intensity for all directions of the sky based on the current camera position and stores it in a 2D texture. This enables high-speed sky rendering without complex physical calculations during background rendering.
 *
 * @category SkyAtmosphere
 */
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

    render(transmittance: DirectTexture, multiScat: DirectTexture): void {
        if (!this.#bindGroup) {
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_SkyView_BindGroup', this.#pipeline, [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: transmittance.gpuTextureView},
                {binding: 2, resource: multiScat.gpuTextureView},
                {binding: 3, resource: this.sampler.gpuSampler},
                {binding: 4, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]);
        }
        this.executeComputePass(this.#pipeline, this.#bindGroup, [16, 16, 1]);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyAtmosphere_SkyView_LUTTexture_${createUUID()}`, this.createLUTTexture(false));
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_SkyView_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(SkyViewGenerator);
export default SkyViewGenerator;
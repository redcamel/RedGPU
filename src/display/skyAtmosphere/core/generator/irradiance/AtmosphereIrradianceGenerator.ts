import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import atmosphereIrradianceShaderCode from "./atmosphereIrradianceShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + atmosphereIrradianceShaderCode, 'ATMOSPHERE_IRRADIANCE_GENERATOR');

/**
 * [KO] Sky-View LUT를 기반으로 실시간 조도(Irradiance) LUT를 생성하는 클래스입니다.
 * [EN] Class that generates a real-time irradiance LUT based on the Sky-View LUT.
 */
class AtmosphereIrradianceGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'ATMOSPHERE_IRRADIANCE_GEN', 32, 32);
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    render(transmittance: DirectTexture, skyView: DirectTexture, multiScat: DirectTexture): void {
        const {gpuDevice} = this.redGPUContext;
        const bindGroup = gpuDevice.createBindGroup({
            label: 'ATMOSPHERE_IRRADIANCE_GEN_BG',
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: skyView.gpuTextureView},
                {binding: 2, resource: multiScat.gpuTextureView},
                {binding: 3, resource: this.sampler.gpuSampler},
                {binding: 4, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
                {binding: 5, resource: transmittance.gpuTextureView}
            ]
        });
        this.gpuRender(bindGroup, [8, 8, 1]);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `AtmosphereIrradianceLUTTexture_${createUUID()}`, this.createLUTTexture());
        this.pipeline = this.redGPUContext.gpuDevice.createComputePipeline({
            label: 'ATMOSPHERE_IRRADIANCE_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: this.redGPUContext.gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }
}

export default AtmosphereIrradianceGenerator;

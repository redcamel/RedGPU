import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import skyViewShaderCode from "./skyViewShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + skyViewShaderCode, 'SKY_VIEW_GENERATOR');

/**
 * [KO] 카메라 시점에서의 전방위 하늘색 데이터를 담는 Sky-View LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating Sky-View LUT containing all-around sky color data from the camera perspective.
 */
class SkyViewGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectTexture;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SKY_VIEW_GEN', 200, 200);
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    render(transmittance: DirectTexture, multiScat: DirectTexture): void {
        const {gpuDevice} = this.redGPUContext;
        const bindGroup = gpuDevice.createBindGroup({
            label: 'SKY_VIEW_GEN_BG',
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: transmittance.gpuTextureView},
                {binding: 2, resource: multiScat.gpuTextureView},
                {binding: 3, resource: this.sampler.gpuSampler},
                {binding: 4, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}
            ]
        });
        this.gpuRender(bindGroup);
    }

    #init(): void {
        this.#lutTexture = new DirectTexture(this.redGPUContext, `SkyViewLUTTexture_${createUUID()}`, this.createLUTTexture());
        this.pipeline = this.redGPUContext.gpuDevice.createComputePipeline({
            label: 'SKY_VIEW_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: this.redGPUContext.gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }
}

export default SkyViewGenerator;

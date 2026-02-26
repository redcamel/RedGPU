import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import SkyAtmosphereLUTTexture from "../SkyAtmosphereLUTTexture";
import atmosphereIrradianceShaderCode from "./atmosphereIrradianceShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + atmosphereIrradianceShaderCode, 'ATMOSPHERE_IRRADIANCE_GENERATOR');


/**
 * [KO] Sky-View LUT를 기반으로 실시간 조도(Irradiance) LUT를 생성하는 클래스입니다.
 * [EN] Class that generates a real-time irradiance LUT based on the Sky-View LUT.
 */
class AtmosphereIrradianceGenerator {
    /** [KO] 텍스처 가로 크기 (Zenith resolution) [EN] Texture width (Zenith resolution) */
    readonly width: number = 32;
    /** [KO] 텍스처 세로 크기 (Relative Azimuth resolution) [EN] Texture height (Relative Azimuth resolution) */
    readonly height: number = 32;
    #redGPUContext: RedGPUContext;
    #lutTexture: SkyAtmosphereLUTTexture;
    #pipeline: GPUComputePipeline;
    #sharedUniformBuffer: UniformBuffer;
    #sampler: Sampler;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer) {
        this.#redGPUContext = redGPUContext;
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = new Sampler(this.#redGPUContext, {magFilter: 'linear', minFilter: 'linear'});
        this.#init();
    }

    get lutTexture(): SkyAtmosphereLUTTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 조도 LUT를 렌더링합니다.
     * [EN] Renders the irradiance LUT.
     *
     * @param skyView - [KO] 스카이 뷰 LUT [EN] Sky-View LUT
     */
    render(skyView: SkyAtmosphereLUTTexture): void {
        const {gpuDevice} = this.#redGPUContext;

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: skyView.gpuTextureView},
                {binding: 2, resource: this.#sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.#sharedUniformBuffer.gpuBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(this.width / 8), Math.ceil(this.height / 8), 1);
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        this.#lutTexture.notifyUpdate();
    }

    #init(): void {
        const {gpuDevice} = this.#redGPUContext;
        this.#lutTexture = new SkyAtmosphereLUTTexture(this.#redGPUContext, 'AtmosphereIrradianceLUTTexture', this.width, this.height);

        const shaderModule = gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource});
        this.#pipeline = gpuDevice.createComputePipeline({
            layout: 'auto',
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }
}

export default AtmosphereIrradianceGenerator;

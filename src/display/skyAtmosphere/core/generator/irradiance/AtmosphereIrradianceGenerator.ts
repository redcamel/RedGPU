import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import atmosphereIrradianceShaderCode from "./atmosphereIrradianceShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + atmosphereIrradianceShaderCode, 'ATMOSPHERE_IRRADIANCE_GENERATOR');
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

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
    #lutTexture: DirectTexture;
    #pipeline: GPUComputePipeline;
    #sharedUniformBuffer: UniformBuffer;
    #sampler: Sampler;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer) {
        this.#redGPUContext = redGPUContext;
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = new Sampler(this.#redGPUContext, {magFilter: 'linear', minFilter: 'linear'});
        this.#init();
    }

    get lutTexture(): DirectTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 조도 LUT를 렌더링합니다.
     * [EN] Renders the irradiance LUT.
     *
     * @param skyView - [KO] 스카이 뷰 LUT [EN] Sky-View LUT
     * @param multiScat - [KO] 다중 산란 LUT [EN] Multi-Scattering LUT
     */
    render(skyView: DirectTexture, multiScat: DirectTexture): void {
        const {gpuDevice} = this.#redGPUContext;

        const bindGroup = gpuDevice.createBindGroup({
            label: 'ATMOSPHERE_IRRADIANCE_GEN_BG',
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: skyView.gpuTextureView},
                {binding: 2, resource: multiScat.gpuTextureView},
                {binding: 3, resource: this.#sampler.gpuSampler},
                {binding: 4, resource: {buffer: this.#sharedUniformBuffer.gpuBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder({label: 'ATMOSPHERE_IRRADIANCE_GEN_COMMAND_ENCODER'});
        const passEncoder = commandEncoder.beginComputePass({label: 'ATMOSPHERE_IRRADIANCE_GEN_COMPUTE_PASS'});
        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(this.width / 8), Math.ceil(this.height / 8), 1);
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        this.#lutTexture.notifyUpdate();
    }

    #init(): void {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        
        const gpuTexture = resourceManager.createManagedTexture({
            label: 'AtmosphereIrradianceLUTTexture',
            size: [this.width, this.height, 1],
            dimension: '2d',
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        });

        this.#lutTexture = new DirectTexture(this.#redGPUContext, 'AtmosphereIrradianceLUTTexture', gpuTexture);

        const shaderModule = gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource});
        this.#pipeline = gpuDevice.createComputePipeline({
            label: 'ATMOSPHERE_IRRADIANCE_GEN_PIPELINE',
            layout: 'auto',
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }
}

export default AtmosphereIrradianceGenerator;

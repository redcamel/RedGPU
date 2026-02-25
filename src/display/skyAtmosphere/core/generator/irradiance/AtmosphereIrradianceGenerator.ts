import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import AtmosphereIrradianceLUTTexture from "./AtmosphereIrradianceLUTTexture";
import atmosphereIrradianceShaderCode from "./atmosphereIrradianceShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import SkyViewLUTTexture from "../skyView/SkyViewLUTTexture";
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
    /** [KO] 텍스처 세로 크기 [EN] Texture height */
    readonly height: number = 1;
    #redGPUContext: RedGPUContext;
    #lutTexture: AtmosphereIrradianceLUTTexture;
    #pipeline: GPUComputePipeline;
    #uniformBuffer: UniformBuffer;
    #sampler: Sampler;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#sampler = new Sampler(this.#redGPUContext, {magFilter: 'linear', minFilter: 'linear'});
        this.#init();
    }

    get lutTexture(): AtmosphereIrradianceLUTTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 조도 LUT를 렌더링합니다.
     * [EN] Renders the irradiance LUT.
     *
     * @param skyView - [KO] 스카이 뷰 LUT [EN] Sky-View LUT
     * @param params - [KO] 대기 파라미터 [EN] Atmosphere parameters
     */
    render(skyView: SkyViewLUTTexture, params: any): void {
        const {gpuDevice} = this.#redGPUContext;

        const {members} = UNIFORM_STRUCT;
        for (const [key, member] of Object.entries(members)) {
            const value = params[key];
            if (value !== undefined) this.#uniformBuffer.writeOnlyBuffer(member, value);
        }

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: skyView.gpuTextureView},
                {binding: 2, resource: this.#sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(1, 1, 1); // 32 threads in one workgroup
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        this.#lutTexture.notifyUpdate();
    }

    #init(): void {
        const {gpuDevice} = this.#redGPUContext;
        this.#lutTexture = new AtmosphereIrradianceLUTTexture(this.#redGPUContext, this.width, this.height);

        const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength);
        this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, vertexUniformData, 'ATMOSPHERE_IRRADIANCE_GEN_UNIFORM_BUFFER');

        const shaderModule = gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource});
        this.#pipeline = gpuDevice.createComputePipeline({
            layout: 'auto',
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }
}

export default AtmosphereIrradianceGenerator;

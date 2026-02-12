import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import MultiScatteringLUTTexture from "./MultiScatteringLUTTexture";
import multiScatteringShaderCode from "./multiScatteringShaderCode.wgsl";
import TransmittanceLUTTexture from "../transmittance/TransmittanceLUTTexture";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";

const SHADER_INFO = parseWGSL(multiScatteringShaderCode);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

class MultiScatteringGenerator {
    #redGPUContext: RedGPUContext;
    #lutTexture: MultiScatteringLUTTexture;
    #pipeline: GPUComputePipeline;
    #uniformBuffer: UniformBuffer;
    #sampler: Sampler;

    readonly width: number = 256;
    readonly height: number = 256;

    earthRadius: number = 6360.0;
    atmosphereHeight: number = 60.0;
    mieScattering: number = 0.021;
    mieExtinction: number = 0.021;
    rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
    mieAnisotropy: number = 0.8;
    rayleighScaleHeight: number = 8.0;
    mieScaleHeight: number = 1.2;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#sampler = new Sampler(this.#redGPUContext, {magFilter: 'linear', minFilter: 'linear'});
        this.#init();
    }

    get lutTexture(): MultiScatteringLUTTexture { return this.#lutTexture; }

    #init(): void {
        const {gpuDevice} = this.#redGPUContext;
        this.#lutTexture = new MultiScatteringLUTTexture(this.#redGPUContext, this.width, this.height);

        const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength);
        this.#uniformBuffer = new UniformBuffer(this.#redGPUContext, vertexUniformData, 'MULTI_SCAT_GEN_UNIFORM_BUFFER');

        const shaderModule = gpuDevice.createShaderModule({code: multiScatteringShaderCode});
        this.#pipeline = gpuDevice.createComputePipeline({
            layout: 'auto',
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }

    render(transmittanceTexture: TransmittanceLUTTexture): void {
        const {gpuDevice} = this.#redGPUContext;

        const {members} = UNIFORM_STRUCT;
        for (const [key, member] of Object.entries(members)) {
            const value = (this as any)[key];
            if (value !== undefined) this.#uniformBuffer.writeOnlyBuffer(member, value);
        }
        
        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: transmittanceTexture.gpuTextureView},
                {binding: 2, resource: this.#sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.#uniformBuffer.gpuBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(this.width / 8), Math.ceil(this.height / 8));
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        this.#lutTexture.notifyUpdate();
    }
}

export default MultiScatteringGenerator;

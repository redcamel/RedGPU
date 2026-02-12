import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import MultiScatteringLUTTexture from "./MultiScatteringLUTTexture";
import multiScatteringShaderCode from "./multiScatteringShaderCode.wgsl";
import TransmittanceLUTTexture from "../transmittance/TransmittanceLUTTexture";

class MultiScatteringGenerator {
    #redGPUContext: RedGPUContext;
    #lutTexture: MultiScatteringLUTTexture;
    #pipeline: GPUComputePipeline;
    #uniformBuffer: GPUBuffer;
    #uniformData: Float32Array;
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

        // 3개의 vec4
        this.#uniformData = new Float32Array(12);
        this.#uniformBuffer = gpuDevice.createBuffer({
            size: this.#uniformData.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const shaderModule = gpuDevice.createShaderModule({code: multiScatteringShaderCode});
        this.#pipeline = gpuDevice.createComputePipeline({
            layout: 'auto',
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }

    render(transmittanceTexture: TransmittanceLUTTexture): void {
        const {gpuDevice} = this.#redGPUContext;

        // p0: (earthRadius, atmHeight, mieScat, mieExt)
        this.#uniformData[0] = this.earthRadius;
        this.#uniformData[1] = this.atmosphereHeight;
        this.#uniformData[2] = this.mieScattering;
        this.#uniformData[3] = this.mieExtinction;

        // p1: (rayScat.rgb, mieAnisotropy)
        this.#uniformData[4] = this.rayleighScattering[0];
        this.#uniformData[5] = this.rayleighScattering[1];
        this.#uniformData[6] = this.rayleighScattering[2];
        this.#uniformData[7] = this.mieAnisotropy;

        // p2: (rayScaleH, mieScaleH, padding, padding)
        this.#uniformData[8] = this.rayleighScaleHeight;
        this.#uniformData[9] = this.mieScaleHeight;

        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as BufferSource);
        
        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTextureView},
                {binding: 1, resource: transmittanceTexture.gpuTextureView},
                {binding: 2, resource: this.#sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.#uniformBuffer}}
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

import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import MultiScatteringLUTTexture from "./MultiScatteringLUTTexture";
import multiScatteringShaderCode from "./multiScatteringShaderCode.wgsl";
import TransmittanceLUTTexture from "../transmittance/TransmittanceLUTTexture";

/**
 * [KO] Multi-Scattering LUT를 생성하는 클래스입니다.
 */
class MultiScatteringGenerator {
    #redGPUContext: RedGPUContext;
    #lutTexture: MultiScatteringLUTTexture;
    #pipeline: GPUComputePipeline;
    #bindGroup: GPUBindGroup;
    #uniformBuffer: GPUBuffer;
    #uniformData: Float32Array;
    #sampler: Sampler;

    readonly width: number = 32;
    readonly height: number = 32;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#sampler = new Sampler(this.#redGPUContext, {magFilter: 'linear', minFilter: 'linear'});
        this.#init();
    }

    get lutTexture(): MultiScatteringLUTTexture {
        return this.#lutTexture;
    }

    #init(): void {
        const {gpuDevice} = this.#redGPUContext;
        this.#lutTexture = new MultiScatteringLUTTexture(this.#redGPUContext, this.width, this.height);

        // WGSL의 AtmosphereParameters 구조체 크기(16 floats = 64 bytes)와 일치시킵니다.
        this.#uniformData = new Float32Array(16);
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

    render(transmittanceTexture: TransmittanceLUTTexture, params: any): void {
        const {gpuDevice} = this.#redGPUContext;

        // 데이터 채우기 (기존 유지)
        this.#uniformData[0] = params.earthRadius;
        this.#uniformData[1] = params.atmosphereHeight;
        this.#uniformData[2] = params.mieScattering;
        this.#uniformData[3] = params.mieExtinction;
        this.#uniformData[4] = params.rayleighScattering[0];
        this.#uniformData[5] = params.rayleighScattering[1];
        this.#uniformData[6] = params.rayleighScattering[2];
        this.#uniformData[7] = 0;
        this.#uniformData[8] = params.mieAnisotropy;
        this.#uniformData[9] = params.rayleighScaleHeight;
        this.#uniformData[10] = params.mieScaleHeight;
        this.#uniformData[11] = params.cameraHeight;
        this.#uniformData[12] = params.ozoneAbsorption[0];
        this.#uniformData[13] = params.ozoneAbsorption[1];
        this.#uniformData[14] = params.ozoneAbsorption[2];
        this.#uniformData[15] = 0;

        // [수정] writeBuffer의 세 번째 인자로 명시적 TypedArray 전달
        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData.buffer, 0, this.#uniformData.byteLength);
        this.#bindGroup = gpuDevice.createBindGroup({
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
        passEncoder.setBindGroup(0, this.#bindGroup);

        // [수정] 쉐이더의 @workgroup_size(8, 8)와 연동 (32/8 = 4)
        const workgroupSize = 8;
        const dispatchX = Math.ceil(this.width / workgroupSize);
        const dispatchY = Math.ceil(this.height / workgroupSize);

        passEncoder.dispatchWorkgroups(dispatchX, dispatchY);

        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        this.#lutTexture.notifyUpdate();
    }
}

export default MultiScatteringGenerator;
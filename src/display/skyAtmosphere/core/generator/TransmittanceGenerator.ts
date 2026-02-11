import RedGPUContext from "../../../../context/RedGPUContext";
import transmittanceShaderCode from "./transmittanceShaderCode.wgsl";
import TransmittanceLUTTexture from "./TransmittanceLUTTexture";

/**
 * [KO] Transmittance LUT를 생성하는 클래스입니다.
 * [EN] Class that generates the Transmittance LUT.
 */
class TransmittanceGenerator {
    #redGPUContext: RedGPUContext;
    #lutTexture: TransmittanceLUTTexture;
    #pipeline: GPUComputePipeline;
    #bindGroup: GPUBindGroup;
    #uniformBuffer: GPUBuffer;
    #uniformData: Float32Array;

    readonly width: number = 256;
    readonly height: number = 64;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#init();
    }

    get lutTexture(): TransmittanceLUTTexture { return this.#lutTexture; }

    #init() {
        const {gpuDevice} = this.#redGPUContext;

        // 1. 전용 LUT Texture 생성
        this.#lutTexture = new TransmittanceLUTTexture(this.#redGPUContext, this.width, this.height);

        // 2. Uniform Buffer 생성 (AtmosphereParameters)
        this.#uniformData = new Float32Array(8); 
        this.#uniformBuffer = gpuDevice.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        // 3. Compute Pipeline 생성
        const shaderModule = gpuDevice.createShaderModule({
            code: transmittanceShaderCode
        });

        this.#pipeline = gpuDevice.createComputePipeline({
            layout: 'auto',
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });

        // 4. Bind Group 생성
        this.#bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: this.#lutTexture.gpuTextureView
                },
                {
                    binding: 1,
                    resource: { buffer: this.#uniformBuffer }
                }
            ]
        });
    }

    /**
     * [KO] LUT를 렌더링(계산)합니다.
     * @param params - 대기 파라미터
     */
    render(params: {
        earthRadius: number,
        atmosphereHeight: number,
        mieScattering: number,
        mieExtinction: number,
        rayleighScattering: [number, number, number]
    }) {
        const {gpuDevice} = this.#redGPUContext;
        
        this.#uniformData[0] = params.earthRadius;
        this.#uniformData[1] = params.atmosphereHeight;
        this.#uniformData[2] = params.mieScattering;
        this.#uniformData[3] = params.mieExtinction;
        this.#uniformData[4] = params.rayleighScattering[0];
        this.#uniformData[5] = params.rayleighScattering[1];
        this.#uniformData[6] = params.rayleighScattering[2];
        
        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as BufferSource);

        const commandEncoder = gpuDevice.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, this.#bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(this.width / 16), Math.ceil(this.height / 16));
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        
        // 데이터 변경 알림 (ManagementResourceBase 시스템 연동)
        this.#lutTexture.notifyUpdate();
    }
}

export default TransmittanceGenerator;

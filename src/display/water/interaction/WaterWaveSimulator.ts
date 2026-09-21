import RedGPUContext from "../../../context/RedGPUContext";
import computeShaderCode from "./shader/waterWaveSimulation.wgsl";

/**
 * [KO] 2D 파동 방정식(Wave Equation FDTD) 기반 실시간 물결 시뮬레이터
 * [EN] Real-time ripple simulator based on 2D wave equation FDTD
 */
export class WaterWaveSimulator {
    readonly redGPUContext: RedGPUContext;
    readonly textureSize: number = 512;

    rippleNormalTexture: GPUTexture;
    rippleNormalTextureView: GPUTextureView;

    waveSpeed: number = 0.32;
    damping: number = 0.012;
    normalStrength: number = 1.0;

    // 핑퐁 시뮬레이션 버퍼 (R: h_curr, G: h_prev)
    #waveBufferA: GPUTexture;
    #waveBufferAView: GPUTextureView;
    #waveBufferB: GPUTexture;
    #waveBufferBView: GPUTextureView;
    #uniformBuffer: GPUBuffer;
    #pipeline: GPUComputePipeline;
    #bindGroupA: GPUBindGroup; // Read A, Write B
    #bindGroupB: GPUBindGroup; // Read B, Write A
    #isBufferAPrimary: boolean = true;
    readonly #uniformData: Float32Array = new Float32Array(8);
    readonly #computePassDescriptor: GPUComputePassDescriptor = {
        label: 'WaterWave_ComputePass'
    };
    readonly #workgroups: number;

    constructor(redGPUContext: RedGPUContext, textureSize: number = 512) {
        this.redGPUContext = redGPUContext;
        this.textureSize = textureSize;
        this.#workgroups = Math.ceil(textureSize / 16);

        this.#createTextures();
        this.#createPipeline();
    }

    /**
     * [KO] 캡처 텍스처 뷰가 결정되었을 때 핑퐁 바인드그룹을 생성합니다.
     */
    updateCaptureBinding(captureTextureView: GPUTextureView): void {
        const device = this.redGPUContext.gpuDevice;
        const bgl = this.#pipeline.getBindGroupLayout(0);

        // BindGroup A: Read A, Write B
        this.#bindGroupA = device.createBindGroup({
            layout: bgl,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer}},
                {binding: 1, resource: this.#waveBufferAView},
                {binding: 2, resource: captureTextureView},
                {binding: 3, resource: this.#waveBufferBView},
                {binding: 4, resource: this.rippleNormalTextureView}
            ],
            label: 'WaterWave_BindGroupA'
        });

        // BindGroup B: Read B, Write A
        this.#bindGroupB = device.createBindGroup({
            layout: bgl,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer}},
                {binding: 1, resource: this.#waveBufferBView},
                {binding: 2, resource: captureTextureView},
                {binding: 3, resource: this.#waveBufferAView},
                {binding: 4, resource: this.rippleNormalTextureView}
            ],
            label: 'WaterWave_BindGroupB'
        });
    }

    /**
     * [KO] 2D 파동 방정식 1스텝 시뮬레이션을 수행합니다 (월드 텍셀 스크롤 보정 지원).
     * [EN] Executes 1-step 2D wave equation simulation (supports world texel scroll compensation).
     */
    simulate(commandEncoder: GPUCommandEncoder, shiftX: number = 0, shiftZ: number = 0): void {
        if (!this.#bindGroupA || !this.#bindGroupB) return;

        const device = this.redGPUContext.gpuDevice;

        // 1. 유니폼 버퍼 갱신 (텍셀 스크롤 오프셋 포함)
        this.#uniformData[0] = this.waveSpeed;
        this.#uniformData[1] = this.damping;
        this.#uniformData[2] = this.normalStrength;
        this.#uniformData[3] = shiftX;
        this.#uniformData[4] = shiftZ;
        this.#uniformData[5] = 0;
        this.#uniformData[6] = 0;
        this.#uniformData[7] = 0;
        device.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as unknown as BufferSource);

        // 2. 컴퓨트 패스 인코딩 (Zero-GC: 캐시된 디스크립터 사용)
        const passEncoder = commandEncoder.beginComputePass(this.#computePassDescriptor);

        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, this.#isBufferAPrimary ? this.#bindGroupA : this.#bindGroupB);

        // 512x512 텍스처 -> 16x16 워크그룹 = (32, 32)
        passEncoder.dispatchWorkgroups(this.#workgroups, this.#workgroups);

        passEncoder.end();

        // 핑퐁 버퍼 전환
        this.#isBufferAPrimary = !this.#isBufferAPrimary;
    }

    destroy(): void {
        if (this.#waveBufferA) this.#waveBufferA.destroy();
        if (this.#waveBufferB) this.#waveBufferB.destroy();
        if (this.rippleNormalTexture) this.rippleNormalTexture.destroy();
        if (this.#uniformBuffer) this.#uniformBuffer.destroy();
    }

    #createTextures(): void {
        const device = this.redGPUContext.gpuDevice;

        const createStorageTexture = (label: string) => {
            return device.createTexture({
                size: [this.textureSize, this.textureSize, 1],
                format: 'rgba16float',
                usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
                label
            });
        };

        this.#waveBufferA = createStorageTexture('WaterWave_BufferA');
        this.#waveBufferAView = this.#waveBufferA.createView();

        this.#waveBufferB = createStorageTexture('WaterWave_BufferB');
        this.#waveBufferBView = this.#waveBufferB.createView();

        this.rippleNormalTexture = createStorageTexture('WaterWave_RippleNormalTexture');
        this.rippleNormalTextureView = this.rippleNormalTexture.createView();
    }

    #createPipeline(): void {
        const device = this.redGPUContext.gpuDevice;

        const shaderModule = device.createShaderModule({
            code: computeShaderCode,
            label: 'WaterWaveSimulationShader'
        });

        this.#uniformBuffer = device.createBuffer({
            size: 32, // 8 floats = 32 bytes (16-byte aligned)
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: 'WaterWave_SimUniformBuffer'
        });

        const bgl = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'uniform'}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'unfilterable-float'}
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'unfilterable-float'}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: 'write-only',
                        format: 'rgba16float'
                    }
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: 'write-only',
                        format: 'rgba16float'
                    }
                }
            ],
            label: 'WaterWave_ComputeBGL'
        });

        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bgl],
            label: 'WaterWave_ComputePipelineLayout'
        });

        this.#pipeline = device.createComputePipeline({
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'cs_main'
            },
            label: 'WaterWave_ComputePipeline'
        });
    }
}

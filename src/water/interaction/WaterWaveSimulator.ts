import RedGPUContext from "../../context/RedGPUContext";
import computeShaderCode from "./shader/waterWaveSimulation.wgsl";

export class WaterWaveSimulator {
    readonly redGPUContext: RedGPUContext;
    readonly textureSize: number = 512;

    rippleNormalTexture: GPUTexture;
    rippleNormalTextureView: GPUTextureView;

    waveSpeed: number = 0.32;
    damping: number = 0.012;
    normalStrength: number = 1.0;

    #waveBufferA: GPUTexture;
    #waveBufferAView: GPUTextureView;
    #waveBufferB: GPUTexture;
    #waveBufferBView: GPUTextureView;
    #uniformBuffer: GPUBuffer;
    #pipeline: GPUComputePipeline;
    #bindGroupA: GPUBindGroup;
    #bindGroupB: GPUBindGroup;
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

    updateCaptureBinding(captureTextureView: GPUTextureView): void {
        const device = this.redGPUContext.gpuDevice;
        const bgl = this.#pipeline.getBindGroupLayout(0);

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

    simulate(commandEncoder: GPUCommandEncoder, shiftX: number = 0, shiftZ: number = 0): void {
        if (!this.#bindGroupA || !this.#bindGroupB) return;

        const device = this.redGPUContext.gpuDevice;

        this.#uniformData[0] = this.waveSpeed;
        this.#uniformData[1] = this.damping;
        this.#uniformData[2] = this.normalStrength;
        this.#uniformData[3] = shiftX;
        this.#uniformData[4] = shiftZ;
        this.#uniformData[5] = 0;
        this.#uniformData[6] = 0;
        this.#uniformData[7] = 0;
        device.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as unknown as BufferSource);

        const passEncoder = commandEncoder.beginComputePass(this.#computePassDescriptor);

        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, this.#isBufferAPrimary ? this.#bindGroupA : this.#bindGroupB);

        passEncoder.dispatchWorkgroups(this.#workgroups, this.#workgroups);

        passEncoder.end();

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
            size: 32,
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

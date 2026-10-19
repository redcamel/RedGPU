import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import computeShaderCode from "./shader/lakeWaveSimulation.wgsl";

/**
 * [KO] FDTD 기반 수면 파동 방정식을 시뮬레이션하고 리플 노멀 텍스처를 생성하는 컴퓨트 시뮬레이터 클래스입니다.
 * [EN] Compute simulator class that simulates FDTD-based water wave equations and generates ripple normal textures.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Water
 */
class LakeWaveSimulator extends RedGPUObject {
    textureSize: number = 512;

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
    #uniformData: Float32Array = new Float32Array(8);
    #computePassDescriptor: GPUComputePassDescriptor = {
        label: 'WaterWave_ComputePass'
    };
    #workgroups: number;

    constructor(redGPUContext: RedGPUContext, textureSize: number = 512) {
        super(redGPUContext);
        this.textureSize = textureSize;
        this.#workgroups = Math.ceil(textureSize / 16);

        this.#createTextures();
        this.#createPipeline();
    }

    updateCaptureBinding(captureTextureView: GPUTextureView): void {
        const {gpuDevice} = this;
        const bgl = this.#pipeline.getBindGroupLayout(0);

        this.#bindGroupA = gpuDevice.createBindGroup({
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

        this.#bindGroupB = gpuDevice.createBindGroup({
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

        const {gpuDevice} = this;

        this.#uniformData[0] = this.waveSpeed;
        this.#uniformData[1] = this.damping;
        this.#uniformData[2] = this.normalStrength;
        this.#uniformData[3] = shiftX;
        this.#uniformData[4] = shiftZ;
        this.#uniformData[5] = 0;
        this.#uniformData[6] = 0;
        this.#uniformData[7] = 0;
        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, this.#uniformData as unknown as BufferSource);

        const passEncoder = commandEncoder.beginComputePass(this.#computePassDescriptor);

        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, this.#isBufferAPrimary ? this.#bindGroupA : this.#bindGroupB);

        passEncoder.dispatchWorkgroups(this.#workgroups, this.#workgroups);

        passEncoder.end();

        this.#isBufferAPrimary = !this.#isBufferAPrimary;
    }

    /**
     * [KO] 파동 버퍼, 리플 노멀 텍스처, 유니폼 버퍼 GPU 리소스를 해제합니다.
     * [EN] Releases the wave buffers, ripple normal texture, and uniform buffer GPU resources.
     */
    destroy(): void {
        if (this.#waveBufferA) this.#waveBufferA.destroy();
        if (this.#waveBufferB) this.#waveBufferB.destroy();
        if (this.rippleNormalTexture) this.rippleNormalTexture.destroy();
        if (this.#uniformBuffer) this.#uniformBuffer.destroy();
    }

    #createTextures(): void {
        const {gpuDevice} = this;

        const createStorageTexture = (label: string) => {
            return gpuDevice.createTexture({
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
        const {gpuDevice} = this;

        const shaderModule = gpuDevice.createShaderModule({
            code: computeShaderCode,
            label: 'WaterWaveSimulationShader'
        });

        this.#uniformBuffer = gpuDevice.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: 'WaterWave_SimUniformBuffer'
        });

        const bgl = gpuDevice.createBindGroupLayout({
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

        const pipelineLayout = gpuDevice.createPipelineLayout({
            bindGroupLayouts: [bgl],
            label: 'WaterWave_ComputePipelineLayout'
        });

        this.#pipeline = gpuDevice.createComputePipeline({
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'cs_main'
            },
            label: 'WaterWave_ComputePipeline'
        });
    }
}

Object.freeze(LakeWaveSimulator);
export default LakeWaveSimulator;


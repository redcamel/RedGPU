import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import computeShaderCode from "./shader/lakeWaveSimulation.wgsl";

/**
 * [KO] 호수 수면의 파동 전파를 시뮬레이션하고 리플 노멀 텍스처를 생성하는 클래스입니다.
 * [EN] Class that simulates lake surface wave propagation and generates a ripple normal texture.
 *
 * [KO] `Lake` 인스턴스 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Automatically created internally when a `Lake` instance is constructed.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Water
 */
class LakeWaveSimulator extends RedGPUObject {
    /**
     * [KO] 파동 시뮬레이션 텍스처의 가로·세로 해상도(픽셀)입니다. (기본값: `512`)
     * [EN] Width and height resolution of the wave simulation texture in pixels. (Default: `512`)
     */
    textureSize: number = 512;

    /**
     * [KO] 시뮬레이션 결과 리플 노멀이 저장되는 `GPUTexture`입니다.
     * [EN] `GPUTexture` storing the simulated ripple normals.
     */
    rippleNormalTexture: GPUTexture;
    /**
     * [KO] `rippleNormalTexture`의 `GPUTextureView`입니다.
     * [EN] `GPUTextureView` of `rippleNormalTexture`.
     */
    rippleNormalTextureView: GPUTextureView;

    /**
     * [KO] 파동 전파 속도입니다. (기본값: `0.32`)
     * [EN] Wave propagation speed. (Default: `0.32`)
     */
    waveSpeed: number = 0.32;
    /**
     * [KO] 프레임당 파동 에너지 감쇠율입니다. (기본값: `0.012`)
     * [EN] Wave energy damping factor per frame. (Default: `0.012`)
     */
    damping: number = 0.012;
    /**
     * [KO] 생성되는 리플 노멀의 강도입니다. (기본값: `1.0`)
     * [EN] Strength of the generated ripple normal. (Default: `1.0`)
     */
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
        label: 'LakeWave_ComputePass'
    };
    #clearPassDescriptor: GPURenderPassDescriptor;
    #workgroups: number;

    /**
     * [KO] `LakeWaveSimulator` 인스턴스를 생성합니다.
     * [EN] Creates a `LakeWaveSimulator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param textureSize -
     * [KO] 시뮬레이션 텍스처 해상도 (기본값: `512`)
     * [EN] Simulation texture resolution (default: `512`)
     */
    constructor(redGPUContext: RedGPUContext, textureSize: number = 512) {
        super(redGPUContext);
        this.textureSize = textureSize;
        this.#workgroups = Math.ceil(textureSize / 16);

        this.#createTextures();
        this.#createPipeline();
    }

    /**
     * [KO] 캡처 패스의 침투 깊이 텍스처 뷰를 바인드 그룹에 연결합니다.
     * [EN] Binds the penetration depth texture view from the capture pass to the bind groups.
     *
     * @param captureTextureView -
     * [KO] 캡처 패스의 `GPUTextureView`
     * [EN] `GPUTextureView` from the capture pass
     */
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
            label: 'LakeWave_BindGroupA'
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
            label: 'LakeWave_BindGroupB'
        });
    }

    /**
     * [KO] 파동 시뮬레이션 컴퓨트 패스를 실행합니다.
     * [EN] Executes the wave simulation compute pass.
     *
     * @param commandEncoder -
     * [KO] 컴퓨트 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the compute pass
     * @param shiftX -
     * [KO] 도메인 이동에 따른 X축 텍셀 오프셋 (기본값: `0`)
     * [EN] X-axis texel offset from domain movement (default: `0`)
     * @param shiftZ -
     * [KO] 도메인 이동에 따른 Z축 텍셀 오프셋 (기본값: `0`)
     * [EN] Z-axis texel offset from domain movement (default: `0`)
     */
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
     * [KO] 파동 버퍼와 리플 노멀 텍스처를 0으로 초기화합니다.
     * [EN] Clears the wave buffers and ripple normal texture to zero.
     *
     * @param commandEncoder -
     * [KO] 클리어 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the clear pass
     */
    clear(commandEncoder: GPUCommandEncoder): void {
        if (!this.#clearPassDescriptor) return;
        const passEncoder = commandEncoder.beginRenderPass(this.#clearPassDescriptor);
        passEncoder.end();
    }

    /**
     * [KO] 할당된 GPU 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU resources.
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
                usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
                label
            });
        };

        this.#waveBufferA = createStorageTexture('LakeWave_BufferA');
        this.#waveBufferAView = this.#waveBufferA.createView();

        this.#waveBufferB = createStorageTexture('LakeWave_BufferB');
        this.#waveBufferBView = this.#waveBufferB.createView();

        this.rippleNormalTexture = createStorageTexture('LakeWave_RippleNormalTexture');
        this.rippleNormalTextureView = this.rippleNormalTexture.createView();

        this.#clearPassDescriptor = {
            colorAttachments: [
                {
                    view: this.#waveBufferAView,
                    clearValue: {r: 0, g: 0, b: 0, a: 0},
                    loadOp: 'clear',
                    storeOp: 'store'
                },
                {
                    view: this.#waveBufferBView,
                    clearValue: {r: 0, g: 0, b: 0, a: 0},
                    loadOp: 'clear',
                    storeOp: 'store'
                },
                {
                    view: this.rippleNormalTextureView,
                    clearValue: {r: 0, g: 0, b: 0, a: 0},
                    loadOp: 'clear',
                    storeOp: 'store'
                }
            ],
            label: 'LakeWave_ClearPass'
        };
    }

    #createPipeline(): void {
        const {gpuDevice} = this;

        const shaderModule = gpuDevice.createShaderModule({
            code: computeShaderCode,
            label: 'LakeWaveSimulationShader'
        });

        this.#uniformBuffer = gpuDevice.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: 'LakeWave_SimUniformBuffer'
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
            label: 'LakeWave_ComputeBGL'
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            bindGroupLayouts: [bgl],
            label: 'LakeWave_ComputePipelineLayout'
        });

        this.#pipeline = gpuDevice.createComputePipeline({
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'cs_main'
            },
            label: 'LakeWave_ComputePipeline'
        });
    }
}

Object.freeze(LakeWaveSimulator);
export default LakeWaveSimulator;

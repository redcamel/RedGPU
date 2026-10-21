import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import computeShaderCode from "./shader/lakeWaveSimulation.wgsl";

/**
 * [KO] 2D 유한차분 시간영역(FDTD) 파동 방정식을 컴퓨트 셰이더로 시뮬레이션하고 리플 노멀 텍스처를 생성하는 클래스입니다.
 * [EN] Class that simulates 2D Finite-Difference Time-Domain (FDTD) wave equations via a compute shader and generates a ripple normal texture.
 *
 * [KO] 핑퐁(Ping-pong) 스토리지 텍스처 버퍼를 사용하여 도메인 이동(Shift) 보정 및 파동 감쇠를 처리하며, `Lake` 인스턴스 내부에서 자동으로 생성됩니다.
 * [EN] Uses ping-pong storage texture buffers to handle domain shift compensation and wave damping, and is automatically created inside a `Lake` instance.
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
     * [KO] 시뮬레이션 결과로 계산된 리플 노멀이 저장되는 `rgba16float` 포맷의 `GPUTexture`입니다.
     * [EN] `GPUTexture` in `rgba16float` format storing the computed ripple normals from the simulation.
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
     * [KO] 생성되는 리플 노멀의 기울기 강도입니다. (기본값: `1.0`)
     * [EN] Gradient strength of the generated ripple normal. (Default: `1.0`)
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
     * [EN] Creates an instance of `LakeWaveSimulator`.
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
     * [KO] `LakeCapturePass`에서 생성된 침투 깊이 텍스처 뷰를 컴퓨트 바인드 그룹에 연결합니다.
     * [EN] Binds the penetration depth texture view from `LakeCapturePass` to the compute bind groups.
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
     * [KO] 1스텝의 파동 방정식 컴퓨트 패스를 디스패치하고 핑퐁 버퍼를 교체합니다.
     * [EN] Dispatches one step of the wave equation compute pass and swaps the ping-pong buffers.
     *
     * @param commandEncoder -
     * [KO] 컴퓨트 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the compute pass
     * @param shiftX -
     * [KO] 도메인 스냅 이동에 따른 X축 텍셀 오프셋 (기본값: `0`)
     * [EN] X-axis texel offset from domain snap movement (default: `0`)
     * @param shiftZ -
     * [KO] 도메인 스냅 이동에 따른 Z축 텍셀 오프셋 (기본값: `0`)
     * [EN] Z-axis texel offset from domain snap movement (default: `0`)
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
     * [KO] 파동 핑퐁 버퍼(`#waveBufferA`, `#waveBufferB`)와 리플 노멀 텍스처(`rippleNormalTexture`)를 0으로 초기화합니다.
     * [EN] Clears the ping-pong wave buffers (`#waveBufferA`, `#waveBufferB`) and the ripple normal texture (`rippleNormalTexture`) to zero.
     *
     * @param commandEncoder -
     * [KO] 클리어 렌더 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the clear render pass
     */
    clear(commandEncoder: GPUCommandEncoder): void {
        if (!this.#clearPassDescriptor) return;
        const passEncoder = commandEncoder.beginRenderPass(this.#clearPassDescriptor);
        passEncoder.end();
    }

    /**
     * [KO] 핑퐁 파동 버퍼, 리플 노멀 텍스처 및 유니폼 버퍼 GPU 리소스를 해제합니다.
     * [EN] Releases the ping-pong wave buffers, ripple normal texture, and uniform buffer GPU resources.
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

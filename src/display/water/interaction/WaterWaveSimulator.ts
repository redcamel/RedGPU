import RedGPUContext from "../../../context/RedGPUContext";
import computeShaderCode from "./shader/waterWaveSimulation.wgsl";

/**
 * [KO] WebGPU 2D 파동 방정식 FDTD 실시간 시뮬레이터 (Ping-Pong Compute Pass)
 * [EN] WebGPU 2D wave equation FDTD real-time simulator (Ping-Pong Compute Pass)
 */
export class WaterWaveSimulator {
    readonly redGPUContext: RedGPUContext;
    readonly textureSize: number = 512;
    // 수면 셰이더 샘플링용 최종 결과물 (RG: N.xz, B: h, A: foam)
    rippleNormalTexture: GPUTexture;
    rippleNormalTextureView: GPUTextureView;
    // 시뮬레이션 파라미터 (발자국 첨벙임 동심원 파문 최적 튜닝)
    waveSpeed: number = 0.19;
    damping: number = 0.024;
    foamDecay: number = 0.95;
    normalStrength: number = 1.8;
    // 핑퐁 시뮬레이션 버퍼 (R: h_curr, G: h_prev, B: foam)
    private _waveBufferA: GPUTexture;
    private _waveBufferAView: GPUTextureView;
    private _waveBufferB: GPUTexture;
    private _waveBufferBView: GPUTextureView;
    private _uniformBuffer: GPUBuffer;
    private _pipeline: GPUComputePipeline;
    private _bindGroupA: GPUBindGroup; // Read A, Write B
    private _bindGroupB: GPUBindGroup; // Read B, Write A
    private _isBufferAPrimary: boolean = true;
    private readonly _uniformData: Float32Array = new Float32Array(8);

    constructor(redGPUContext: RedGPUContext, textureSize: number = 512) {
        this.redGPUContext = redGPUContext;
        this.textureSize = textureSize;

        this._createTextures();
        this._createPipeline();
    }

    /**
     * [KO] 캡처 텍스처 뷰가 결정되었을 때 핑퐁 바인드그룹을 생성합니다.
     */
    updateCaptureBinding(captureTextureView: GPUTextureView): void {
        const device = this.redGPUContext.gpuDevice;
        const bgl = this._pipeline.getBindGroupLayout(0);

        // BindGroup A: Read A, Write B
        this._bindGroupA = device.createBindGroup({
            layout: bgl,
            entries: [
                {binding: 0, resource: {buffer: this._uniformBuffer}},
                {binding: 1, resource: this._waveBufferAView},
                {binding: 2, resource: captureTextureView},
                {binding: 3, resource: this._waveBufferBView},
                {binding: 4, resource: this.rippleNormalTextureView}
            ],
            label: 'WaterWave_BindGroupA'
        });

        // BindGroup B: Read B, Write A
        this._bindGroupB = device.createBindGroup({
            layout: bgl,
            entries: [
                {binding: 0, resource: {buffer: this._uniformBuffer}},
                {binding: 1, resource: this._waveBufferBView},
                {binding: 2, resource: captureTextureView},
                {binding: 3, resource: this._waveBufferAView},
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
        if (!this._bindGroupA || !this._bindGroupB) return;

        const device = this.redGPUContext.gpuDevice;

        // 1. 유니폼 버퍼 갱신 (텍셀 스크롤 오프셋 포함)
        this._uniformData[0] = this.waveSpeed;
        this._uniformData[1] = this.damping;
        this._uniformData[2] = this.foamDecay;
        this._uniformData[3] = this.normalStrength;
        this._uniformData[4] = shiftX;
        this._uniformData[5] = shiftZ;
        this._uniformData[6] = 0;
        this._uniformData[7] = 0;
        device.queue.writeBuffer(this._uniformBuffer, 0, this._uniformData as unknown as BufferSource);

        // 2. 컴퓨트 패스 인코딩
        const passEncoder = commandEncoder.beginComputePass({
            label: 'WaterWave_ComputePass'
        });

        passEncoder.setPipeline(this._pipeline);
        passEncoder.setBindGroup(0, this._isBufferAPrimary ? this._bindGroupA : this._bindGroupB);

        // 512x512 텍스처 -> 16x16 워크그룹 = (32, 32)
        const workgroups = Math.ceil(this.textureSize / 16);
        passEncoder.dispatchWorkgroups(workgroups, workgroups);

        passEncoder.end();

        // 핑퐁 버퍼 전환
        this._isBufferAPrimary = !this._isBufferAPrimary;
    }

    destroy(): void {
        if (this._waveBufferA) this._waveBufferA.destroy();
        if (this._waveBufferB) this._waveBufferB.destroy();
        if (this.rippleNormalTexture) this.rippleNormalTexture.destroy();
        if (this._uniformBuffer) this._uniformBuffer.destroy();
    }

    private _createTextures(): void {
        const device = this.redGPUContext.gpuDevice;

        const createStorageTexture = (label: string) => {
            return device.createTexture({
                size: [this.textureSize, this.textureSize, 1],
                format: 'rgba16float',
                usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
                label
            });
        };

        this._waveBufferA = createStorageTexture('WaterWave_BufferA');
        this._waveBufferAView = this._waveBufferA.createView();

        this._waveBufferB = createStorageTexture('WaterWave_BufferB');
        this._waveBufferBView = this._waveBufferB.createView();

        this.rippleNormalTexture = createStorageTexture('WaterWave_RippleNormalTexture');
        this.rippleNormalTextureView = this.rippleNormalTexture.createView();
    }

    private _createPipeline(): void {
        const device = this.redGPUContext.gpuDevice;

        const shaderModule = device.createShaderModule({
            code: computeShaderCode,
            label: 'WaterWaveSimulationShader'
        });

        this._uniformBuffer = device.createBuffer({
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

        this._pipeline = device.createComputePipeline({
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'cs_main'
            },
            label: 'WaterWave_ComputePipeline'
        });
    }
}

import RedGPUContext from "../../../context/RedGPUContext";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] Landscape GPU Compute Shader 기반 런타임 거대 아틀라스 베이크 제너레이터 공통 추상 클래스입니다 (Zero-GC Dynamic Frame-Pool 지원).
 * [EN] Common abstract class for Landscape GPU Compute Shader-based runtime mega-atlas bake generators (supports Zero-GC Dynamic Frame-Pool).
 */
export abstract class ALandscapeAtlasGenerator {
    readonly redGPUContext: RedGPUContext;
    computePipeline: GPUComputePipeline | null = null;
    bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformBufferPool: GPUBuffer[] = [];
    #poolIndex: number = 0;
    #lastFrameId: number = -1;
    #generatorLabel: string;

    constructor(redGPUContext: RedGPUContext, generatorLabel: string) {
        this.redGPUContext = redGPUContext;
        this.#generatorLabel = generatorLabel;
    }

    /**
     * [KO] 프레임별 Zero-GC Dynamic Frame-Pool에서 Uniform GPUBuffer를 대여합니다 (필요 시 자동 확장).
     * [EN] Acquires a Uniform GPUBuffer from the per-frame Zero-GC Dynamic Frame-Pool (auto-expanding on demand).
     */
    acquireUniformBuffer(byteLength: number): GPUBuffer {
        const device = this.redGPUContext.gpuDevice;
        const curFrame = this.redGPUContext.currentRequestAnimationFrame;

        if (this.#lastFrameId !== curFrame) {
            this.#lastFrameId = curFrame;
            this.#poolIndex = 0;
        }

        if (this.#poolIndex >= this.#uniformBufferPool.length) {
            this.#uniformBufferPool.push(device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${this.#uniformBufferPool.length}`,
                size: Math.max(16, byteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }));
        }

        return this.#uniformBufferPool[this.#poolIndex++];
    }

    /**
     * [KO] 표준화된 RESOURCE 커맨드 인코더를 통해 Compute Pass를 디스패치합니다 (Zero-GC).
     * [EN] Dispatches Compute Pass via standardized RESOURCE command encoder (Zero-GC).
     */
    dispatchBakePass(
        bindGroup: GPUBindGroup,
        pixelW: number,
        pixelH: number,
        pixelX: number,
        pixelZ: number
    ): void {
        if (!this.computePipeline) return;
        if (pixelW <= 0 || pixelH <= 0) return;

        const workgroupCountX = Math.max(1, Math.ceil(pixelW / 16));
        const workgroupCountY = Math.max(1, Math.ceil(pixelH / 16));

        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const pass = commandEncoder.beginComputePass({
                label: `Landscape_${this.#generatorLabel}_ComputePass_[${pixelX},${pixelZ}]`
            });
            pass.setPipeline(this.computePipeline!);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
            pass.end();
        });
    }

    /**
     * [KO] WebGPU Compute Pipeline, BindGroupLayout 및 ShaderModule을 생성/캐싱합니다.
     * [EN] Creates and caches WebGPU Compute Pipeline, BindGroupLayout, and ShaderModule.
     */
    initBaseComputePipeline(
        shaderModuleKey: string,
        shaderCode: string,
        layoutEntries: GPUBindGroupLayoutEntry[],
        defaultUniformByteLength: number = 16
    ): void {
        const device = this.redGPUContext.gpuDevice;
        const resourceManager = this.redGPUContext.resourceManager;
        if (!device) return;

        // 1. 초기 16개 슬롯의 프레임 풀 버퍼 사전 할당
        this.#uniformBufferPool = [];
        for (let i = 0; i < 16; i++) {
            this.#uniformBufferPool.push(device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${i}`,
                size: Math.max(16, defaultUniformByteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }));
        }

        // 2. 셰이더 모듈 캐싱 및 획득
        let shaderModule = resourceManager.getGPUShaderModule(shaderModuleKey);
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule(shaderModuleKey, {
                code: shaderCode
            });
        }

        // 3. BindGroupLayout 생성
        this.bindGroupLayout = device.createBindGroupLayout({
            label: `Landscape_${this.#generatorLabel}_BindGroupLayout`,
            entries: layoutEntries
        });

        // 4. PipelineLayout 생성
        const pipelineLayout = device.createPipelineLayout({
            label: `Landscape_${this.#generatorLabel}_PipelineLayout`,
            bindGroupLayouts: [this.bindGroupLayout]
        });

        // 5. ComputePipeline 생성
        this.computePipeline = device.createComputePipeline({
            label: `Landscape_${this.#generatorLabel}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }
}

export default ALandscapeAtlasGenerator;

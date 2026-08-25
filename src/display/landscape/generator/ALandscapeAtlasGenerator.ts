import RedGPUContext from "../../../context/RedGPUContext";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

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

        const buf = this.#uniformBufferPool[this.#poolIndex++];
        if (buf.size < byteLength) {
            const newBuf = device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${this.#poolIndex - 1}`,
                size: Math.max(16, byteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            this.#uniformBufferPool[this.#poolIndex - 1] = newBuf;
            return newBuf;
        }

        return buf;
    }

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

    initBaseComputePipeline(
        shaderModuleKey: string,
        shaderCode: string,
        layoutEntries: Iterable<GPUBindGroupLayoutEntry>,
        defaultUniformByteLength: number = 16
    ): void {
        const device = this.redGPUContext.gpuDevice;
        const resourceManager = this.redGPUContext.resourceManager;
        if (!device) return;

        this.#uniformBufferPool = [];
        for (let i = 0; i < 16; i++) {
            this.#uniformBufferPool.push(device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${i}`,
                size: Math.max(16, defaultUniformByteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }));
        }

        let shaderModule = resourceManager.getGPUShaderModule(shaderModuleKey);
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule(shaderModuleKey, {
                code: shaderCode
            });
        }

        this.bindGroupLayout = device.createBindGroupLayout({
            label: `Landscape_${this.#generatorLabel}_BindGroupLayout`,
            entries: layoutEntries
        });

        const pipelineLayout = device.createPipelineLayout({
            label: `Landscape_${this.#generatorLabel}_PipelineLayout`,
            bindGroupLayouts: [this.bindGroupLayout]
        });

        this.computePipeline = device.createComputePipeline({
            label: `Landscape_${this.#generatorLabel}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }

    destroy(): void {
        const count = this.#uniformBufferPool.length;
        for (let i = 0; i < count; i++) {
            try {
                this.#uniformBufferPool[i]?.destroy();
            } catch (e) {
            }
        }
        this.#uniformBufferPool.length = 0;
        this.computePipeline = null;
        this.bindGroupLayout = null;
    }
}

export default ALandscapeAtlasGenerator;

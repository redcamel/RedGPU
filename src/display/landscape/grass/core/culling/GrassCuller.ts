import RedGPUContext from "../../../../../context/RedGPUContext";
import grassCullComputeSource from "./grassCullCompute.wgsl";
import GrassMegaBuffer from "../buffer/GrassMegaBuffer";

export class GrassCuller {
    #redGPUContext: RedGPUContext;
    #cullPipeline: GPUComputePipeline | null = null;
    #cullBindGroupLayout: GPUBindGroupLayout | null = null;
    #cullBindGroup: GPUBindGroup | null = null;

    #globalUniformGPUBuffer: GPUBuffer | null = null;
    #globalUniformCPUBuffer: Float32Array;
    #globalUniformUintBuffer: Uint32Array;

    #cachedRawBuffer: GPUBuffer | null = null;
    #cachedTypeParamsBuffer: GPUBuffer | null = null;
    #cachedCulledBuffer: GPUBuffer | null = null;
    #cachedIndirectBuffer: GPUBuffer | null = null;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;

        this.#globalUniformCPUBuffer = new Float32Array(32);
        this.#globalUniformUintBuffer = new Uint32Array(this.#globalUniformCPUBuffer.buffer);

        this.#init();
    }

    invalidateBindGroup(): void {
        this.#cullBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
    }

    updateUniforms(
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanes: Float32Array | null,
        totalInstances: number,
        typeCount: number = 1
    ): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#globalUniformGPUBuffer) return;

        const f32 = this.#globalUniformCPUBuffer;
        const u32 = this.#globalUniformUintBuffer;

        f32[0] = camX;
        f32[1] = camY;
        f32[2] = camZ;
        f32[3] = 1.0;

        if (frustumPlanes && frustumPlanes.length >= 24) {
            for (let i = 0; i < 24; i++) {
                f32[4 + i] = frustumPlanes[i];
            }
        } else {
            f32.fill(0, 4, 28);
        }

        u32[28] = totalInstances;
        u32[29] = typeCount;
        u32[30] = 0;
        u32[31] = 0;

        gpuDevice.queue.writeBuffer(
            this.#globalUniformGPUBuffer,
            0,
            this.#globalUniformCPUBuffer.buffer,
            0,
            32 * 4
        );
    }

    updateBindGroup(megaBuffer: GrassMegaBuffer): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#cullBindGroupLayout || !this.#globalUniformGPUBuffer) return;

        if (
            !this.#cullBindGroup ||
            this.#cachedRawBuffer !== megaBuffer.rawGPUBuffer ||
            this.#cachedTypeParamsBuffer !== megaBuffer.typeParamsGPUBuffer ||
            this.#cachedCulledBuffer !== megaBuffer.culledGPUBuffer ||
            this.#cachedIndirectBuffer !== megaBuffer.indirectGPUBuffer
        ) {
            if (!megaBuffer.rawGPUBuffer || !megaBuffer.typeParamsGPUBuffer ||
                !megaBuffer.culledGPUBuffer || !megaBuffer.indirectGPUBuffer) {
                return;
            }

            this.#cachedRawBuffer = megaBuffer.rawGPUBuffer;
            this.#cachedTypeParamsBuffer = megaBuffer.typeParamsGPUBuffer;
            this.#cachedCulledBuffer = megaBuffer.culledGPUBuffer;
            this.#cachedIndirectBuffer = megaBuffer.indirectGPUBuffer;

            this.#cullBindGroup = gpuDevice.createBindGroup({
                label: 'GrassCuller_BindGroup',
                layout: this.#cullBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: megaBuffer.rawGPUBuffer}},
                    {binding: 1, resource: {buffer: this.#globalUniformGPUBuffer}},
                    {binding: 2, resource: {buffer: megaBuffer.typeParamsGPUBuffer}},
                    {binding: 3, resource: {buffer: megaBuffer.culledGPUBuffer}},
                    {binding: 4, resource: {buffer: megaBuffer.indirectGPUBuffer}},
                ],
            });
        }
    }

    dispatchPass(computePass: GPUComputePassEncoder, totalInstances: number): void {
        if (!this.#cullPipeline || !this.#cullBindGroup || totalInstances <= 0) return;

        computePass.setPipeline(this.#cullPipeline);
        computePass.setBindGroup(0, this.#cullBindGroup);
        const workgroupCount = Math.ceil(totalInstances / 64);
        computePass.dispatchWorkgroups(workgroupCount, 1, 1);
    }

    destroy(): void {
        this.#globalUniformGPUBuffer?.destroy();
        this.#globalUniformGPUBuffer = null;
        this.#cullPipeline = null;
        this.#cullBindGroupLayout = null;
        this.#cullBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
    }

    #init(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#globalUniformGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassCuller_GlobalUniformBuffer',
            size: this.#globalUniformCPUBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const shaderModule = gpuDevice.createShaderModule({
            label: 'GrassCullComputeModule',
            code: grassCullComputeSource,
        });

        this.#cullBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'GrassCuller_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
            ],
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'GrassCuller_PipelineLayout',
            bindGroupLayouts: [this.#cullBindGroupLayout],
        });

        this.#cullPipeline = gpuDevice.createComputePipeline({
            label: 'GrassCuller_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main',
            },
        });
    }
}

export default GrassCuller;

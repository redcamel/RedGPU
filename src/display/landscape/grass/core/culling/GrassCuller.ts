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

    #fallbackHZBTexture: GPUTexture | null = null;
    #fallbackHZBTextureView: GPUTextureView | null = null;

    #cachedRawBuffer: GPUBuffer | null = null;
    #cachedTypeParamsBuffer: GPUBuffer | null = null;
    #cachedCulledBuffer: GPUBuffer | null = null;
    #cachedIndirectBuffer: GPUBuffer | null = null;
    #cachedHZBTextureView: GPUTextureView | null = null;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;

        this.#globalUniformCPUBuffer = new Float32Array(64);
        this.#globalUniformUintBuffer = new Uint32Array(this.#globalUniformCPUBuffer.buffer);

        this.#init();
    }

    invalidateBindGroup(): void {
        this.#cullBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
        this.#cachedHZBTextureView = null;
    }

    updateUniforms(
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanes: Float32Array | null,
        totalInstances: number,
        typeCount: number = 1,
        viewProjectionMatrix: Float32Array | null = null,
        hzbEnabled: boolean = false,
        depthBias: number = 0.003,
        hzbWidth: number = 512.0,
        hzbHeight: number = 256.0
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

        if (viewProjectionMatrix && viewProjectionMatrix.length >= 16) {
            for (let i = 0; i < 16; i++) {
                f32[28 + i] = viewProjectionMatrix[i];
            }
        } else {
            f32.fill(0, 28, 44);
        }

        u32[44] = totalInstances;
        u32[45] = typeCount;
        u32[46] = (hzbEnabled && viewProjectionMatrix) ? 1 : 0;
        f32[47] = depthBias;
        f32[48] = hzbWidth;
        f32[49] = hzbHeight;
        f32[50] = 0.0;
        f32[51] = 0.0;

        gpuDevice.queue.writeBuffer(
            this.#globalUniformGPUBuffer,
            0,
            this.#globalUniformCPUBuffer.buffer,
            0,
            52 * 4
        );
    }

    updateBindGroup(megaBuffer: GrassMegaBuffer, hzbTextureView?: GPUTextureView | null): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#cullBindGroupLayout || !this.#globalUniformGPUBuffer) return;

        if (!this.#fallbackHZBTextureView) {
            this.#fallbackHZBTexture = gpuDevice.createTexture({
                label: 'GrassCuller_FallbackHZBTexture',
                size: [1, 1, 1],
                format: 'r32float',
                usage: GPUTextureUsage.TEXTURE_BINDING,
            });
            this.#fallbackHZBTextureView = this.#fallbackHZBTexture.createView({
                label: 'GrassCuller_FallbackHZBTextureView',
            });
        }

        const targetHZBView = hzbTextureView || this.#fallbackHZBTextureView;

        if (
            !this.#cullBindGroup ||
            this.#cachedRawBuffer !== megaBuffer.rawGPUBuffer ||
            this.#cachedTypeParamsBuffer !== megaBuffer.typeParamsGPUBuffer ||
            this.#cachedCulledBuffer !== megaBuffer.culledGPUBuffer ||
            this.#cachedIndirectBuffer !== megaBuffer.indirectGPUBuffer ||
            this.#cachedHZBTextureView !== targetHZBView
        ) {
            if (!megaBuffer.rawGPUBuffer || !megaBuffer.typeParamsGPUBuffer ||
                !megaBuffer.culledGPUBuffer || !megaBuffer.indirectGPUBuffer) {
                return;
            }

            this.#cachedRawBuffer = megaBuffer.rawGPUBuffer;
            this.#cachedTypeParamsBuffer = megaBuffer.typeParamsGPUBuffer;
            this.#cachedCulledBuffer = megaBuffer.culledGPUBuffer;
            this.#cachedIndirectBuffer = megaBuffer.indirectGPUBuffer;
            this.#cachedHZBTextureView = targetHZBView;

            this.#cullBindGroup = gpuDevice.createBindGroup({
                label: 'GrassCuller_BindGroup',
                layout: this.#cullBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: megaBuffer.rawGPUBuffer}},
                    {binding: 1, resource: {buffer: this.#globalUniformGPUBuffer}},
                    {binding: 2, resource: {buffer: megaBuffer.typeParamsGPUBuffer}},
                    {binding: 3, resource: {buffer: megaBuffer.culledGPUBuffer}},
                    {binding: 4, resource: {buffer: megaBuffer.indirectGPUBuffer}},
                    {binding: 5, resource: targetHZBView},
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
        this.#fallbackHZBTexture?.destroy();
        this.#fallbackHZBTexture = null;
        this.#fallbackHZBTextureView = null;
        this.#cullPipeline = null;
        this.#cullBindGroupLayout = null;
        this.#cullBindGroup = null;
        this.#cachedRawBuffer = null;
        this.#cachedTypeParamsBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
        this.#cachedHZBTextureView = null;
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
                {binding: 5, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'unfilterable-float'}},
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

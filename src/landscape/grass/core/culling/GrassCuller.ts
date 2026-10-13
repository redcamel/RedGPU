import RedGPUContext from "../../../../context/RedGPUContext";
import grassCullWGSL from "./grassCull.wgsl";
import type GrassMegaBuffer from "../buffer/GrassMegaBuffer";
import AScatterCuller from "../../../core/scatter/AScatterCuller";
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";

class GrassCuller extends AScatterCuller {
    #globalUniformBuffer: GPUBuffer | null = null;

    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.initComputePipeline('Grass_Cull_ShaderModule', grassCullWGSL, 'Grass_Cull');

        const {gpuDevice} = this;
        const {UNIFORM, COPY_DST} = GPUBufferUsage;
        this.#globalUniformBuffer = gpuDevice.createBuffer({
            label: 'Grass_Cull_GlobalUniformBuffer',
            size: this.#uniformArrayBuffer.byteLength,
            usage: UNIFORM | COPY_DST
        });
    }

    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassMegaBuffer,
        renderViewStateData: RenderViewStateData
    ): void {
        const {totalAllocatedInstances} = megaBuffer;
        if (totalAllocatedInstances <= 0) return;

        const {bindGroupLayout, gpuDevice} = this;
        const {view, frustumPlanesFlat} = renderViewStateData;
        const {rawCamera} = view;
        const {x, y, z} = rawCamera;
        const uf = this.#uniformFloat32View;
        const uu = this.#uniformUint32View;

        uf[0] = x;
        uf[1] = y;
        uf[2] = z;
        uu[3] = totalAllocatedInstances;

        uf.set(frustumPlanesFlat, 4);

        gpuDevice.queue.writeBuffer(this.#globalUniformBuffer, 0, this.#uniformArrayBuffer, 0, 112);

        const unifiedBG = megaBuffer.getOrCreateUnifiedCullingBindGroup(
            bindGroupLayout,
            this.#globalUniformBuffer
        );
        if (!unifiedBG) return;

        this.dispatchCompute(computePass, unifiedBG, totalAllocatedInstances, 64);
    }

    override destroy(): void {
        super.destroy();
        this.#globalUniformBuffer.destroy();
        this.#globalUniformBuffer = null;
    }
}

Object.freeze(GrassCuller);
export default GrassCuller;


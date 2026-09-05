import Geometry from "../../../../../geometry/Geometry";

export interface FoliageShadowMergedSubMeshInitOptions {
    lodIndex: number;
    geometry: Geometry;
    vertexCount: number;
    indexCount: number;
    isIndexed: boolean;
    indexFormat?: GPUIndexFormat;
    strideBytes?: number;
    vertexUniformBuffer: GPUBuffer;
    vertexUniformBindGroup: GPUBindGroup;
    instanceBufferOffset?: number;
    indirectOffsetBytes?: number;
}


class FoliageShadowMergedSubMesh {
    readonly lodIndex: number;
    readonly geometry: Geometry;
    readonly vertexCount: number;
    readonly indexCount: number;
    readonly isIndexed: boolean;
    readonly indexFormat: GPUIndexFormat;
    readonly strideBytes: number;
    readonly vertexUniformBuffer: GPUBuffer;
    readonly vertexUniformBindGroup: GPUBindGroup;

    instanceBufferOffset: number;
    indirectOffsetBytes: number;

    constructor(init: FoliageShadowMergedSubMeshInitOptions) {
        this.lodIndex = init.lodIndex;
        this.geometry = init.geometry;
        this.vertexCount = init.vertexCount;
        this.indexCount = init.indexCount;
        this.isIndexed = init.isIndexed;
        this.indexFormat = init.indexFormat || 'uint32';
        this.strideBytes = init.strideBytes ?? 12;
        this.vertexUniformBuffer = init.vertexUniformBuffer;
        this.vertexUniformBindGroup = init.vertexUniformBindGroup;
        this.instanceBufferOffset = init.instanceBufferOffset ?? 0;
        this.indirectOffsetBytes = init.indirectOffsetBytes ?? 0;
    }

    draw(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder, indirectGPUBuffer: GPUBuffer, offsetBytes?: number): void {
        const offset = offsetBytes !== undefined ? offsetBytes : this.indirectOffsetBytes;
        if (this.isIndexed && this.geometry.indexBuffer?.gpuBuffer) {
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, offset);
        } else {
            passEncoder.drawIndirect(indirectGPUBuffer, offset);
        }
    }

    destroy(): void {
        this.vertexUniformBuffer?.destroy();
        this.geometry?.destroy();
    }
}

Object.freeze(FoliageShadowMergedSubMesh);
export default FoliageShadowMergedSubMesh;

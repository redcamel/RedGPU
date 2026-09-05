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

/**
 * [KO] LOD 단위 그림자 전용 단일 병합 서브메시 (Shadow Proxy)
 * - Position(Float32x3 = 12B)만 담긴 초경량 지오메트리
 * - 재질 분리 없이 특정 LOD 내 모든 서브메시(기둥 + 나뭇잎)가 1개로 통합됨
 * - 섀도우 패스에서 드로우콜 50% 절감 및 VRAM 대역폭 50% 절감 실현
 *
 * [EN] LOD-level single merged submesh for shadow pass (Shadow Proxy)
 * - Ultra-lightweight geometry containing only Position (Float32x3 = 12B)
 * - All submeshes within an LOD (Trunk + Leaves) are merged into a single mesh
 * - Reduces shadow draw calls by 50% and cuts VRAM fetch bandwidth by 50%
 */
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

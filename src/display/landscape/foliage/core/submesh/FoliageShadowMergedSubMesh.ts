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
    static readonly #windFloatBuffer: Float32Array = new Float32Array(12);
    static readonly #windUintBuffer: Uint32Array = new Uint32Array(FoliageShadowMergedSubMesh.#windFloatBuffer.buffer);

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

    updateWindParams(
        gpuDevice: GPUDevice,
        windDirX: number,
        windDirY: number,
        windSpeed: number,
        windStrength: number,
        windFreq: number,
        windFlutterStrength: number,
        windEnabled: boolean,
        windMultiplier: number,
        windFlutterMultiplier: number,
        useVertexColorWind: boolean,
        treeHeight: number
    ): void {
        if (!this.vertexUniformBuffer || !gpuDevice) return;
        const fView = FoliageShadowMergedSubMesh.#windFloatBuffer;
        const uView = FoliageShadowMergedSubMesh.#windUintBuffer;
        fView[0] = windDirX;
        fView[1] = windDirY;
        fView[2] = windSpeed;
        fView[3] = windStrength;
        fView[4] = windFreq;
        fView[5] = windFlutterStrength;
        uView[6] = windEnabled ? 1 : 0;
        fView[7] = windMultiplier;
        fView[8] = windFlutterMultiplier;
        uView[9] = useVertexColorWind ? 1 : 0;
        fView[10] = treeHeight;
        uView[11] = 0;

        gpuDevice.queue.writeBuffer(
            this.vertexUniformBuffer,
            36 * 4,
            fView.buffer,
            fView.byteOffset,
            48
        );
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

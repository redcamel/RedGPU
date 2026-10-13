import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";

export interface ScatterRenderUnitInitOptions {
    geometry: Geometry;

    vertexCount?: number;

    indexCount?: number;

    isIndexed?: boolean;

    indexFormat?: GPUIndexFormat;

    strideBytes?: number;

    indirectOffsetBytes?: number;

    instanceBufferOffset?: number;

    firstIndex?: number;

    material?: any;

    baseColorTexture?: BitmapTexture | null;

    lodIndex?: number;

    isMasked?: boolean;
}

class ScatterRenderUnit {
    #geometry: Geometry;
    #vertexCount: number;
    #indexCount: number;
    #firstIndex: number;
    #isIndexed: boolean;
    #indexFormat: GPUIndexFormat;
    #strideBytes: number;
    #indirectOffsetBytes: number;
    #instanceBufferOffset: number;

    #material?: any;
    #baseColorTexture?: BitmapTexture | null;
    #lodIndex: number;
    #isMasked: boolean;

    constructor(init: ScatterRenderUnitInitOptions) {
        const {
            geometry,
            firstIndex = 0,
            indexFormat = 'uint32',
            indirectOffsetBytes = 0,
            instanceBufferOffset = 0,
            material,
            baseColorTexture = null,
            lodIndex = 0,
            isMasked = false,
            vertexCount: initVertexCount,
            indexCount: initIndexCount,
            isIndexed: initIsIndexed,
            strideBytes: initStrideBytes
        } = init;

        const {vertexBuffer, indexBuffer} = geometry;
        const vertexCount = initVertexCount ?? vertexBuffer.vertexCount ?? 0;
        const isIndexed = initIsIndexed ?? !!indexBuffer;
        const indexCount = initIndexCount ?? (indexBuffer ? indexBuffer.indexCount : vertexCount);
        const strideBytes = initStrideBytes ?? (vertexBuffer.stride ? vertexBuffer.stride * 4 : 72);

        this.#geometry = geometry;
        this.#vertexCount = vertexCount;
        this.#indexCount = indexCount;
        this.#firstIndex = firstIndex;
        this.#isIndexed = isIndexed;
        this.#indexFormat = indexFormat;
        this.#strideBytes = strideBytes;
        this.#indirectOffsetBytes = indirectOffsetBytes;
        this.#instanceBufferOffset = instanceBufferOffset;

        this.#material = material;
        this.#baseColorTexture = baseColorTexture ?? material?.baseColorTexture ?? null;
        this.#lodIndex = lodIndex;
        this.#isMasked = isMasked;
    }

    get geometry(): Geometry {
        return this.#geometry;
    }

    get vertexCount(): number {
        return this.#vertexCount;
    }

    get indexCount(): number {
        return this.#indexCount;
    }

    get firstIndex(): number {
        return this.#firstIndex;
    }

    get isIndexed(): boolean {
        return this.#isIndexed;
    }

    get indexFormat(): GPUIndexFormat {
        return this.#indexFormat;
    }

    get strideBytes(): number {
        return this.#strideBytes;
    }

    get indirectOffsetBytes(): number {
        return this.#indirectOffsetBytes;
    }

    set indirectOffsetBytes(val: number) {
        this.#indirectOffsetBytes = val;
    }

    get instanceBufferOffset(): number {
        return this.#instanceBufferOffset;
    }

    set instanceBufferOffset(val: number) {
        this.#instanceBufferOffset = val;
    }

    get material(): any {
        return this.#material;
    }

    get baseColorTexture(): BitmapTexture | null | undefined {
        return this.#baseColorTexture;
    }

    set baseColorTexture(val: BitmapTexture | null | undefined) {
        this.#baseColorTexture = val;
    }

    get lodIndex(): number {
        return this.#lodIndex;
    }

    get isMasked(): boolean {
        return this.#isMasked;
    }

    draw(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder, indirectGPUBuffer: GPUBuffer, offsetBytes?: number): void {
        const offset = offsetBytes ?? this.#indirectOffsetBytes;
        passEncoder.drawIndexedIndirect(indirectGPUBuffer, offset);
    }

    destroy(): void {
        this.#geometry.destroy();
    }
}

Object.freeze(ScatterRenderUnit);
export default ScatterRenderUnit;


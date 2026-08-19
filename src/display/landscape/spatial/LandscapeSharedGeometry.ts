import RedGPUContext from "../../../context/RedGPUContext";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";

export interface LandscapeLODGeometryRange {
    lodLevel: number;
    firstIndex: number;
    indexCount: number;
    wireframeFirstIndex: number;
    wireframeIndexCount: number;
    baseVertex: number;
}

export class LandscapeSharedGeometry {
    #redGPUContext: RedGPUContext;
    #tileSizeX: number;
    #tileSizeZ: number;
    #componentSizeQuads: number;
    #maxLODLevel: number;

    #combinedVertexBuffer: VertexBuffer | null = null;
    #combinedIndexBuffer: IndexBuffer | null = null;
    #combinedWireframeIndexBuffer: IndexBuffer | null = null;
    #lodRanges: LandscapeLODGeometryRange[] = [];

    constructor(redGPUContext: RedGPUContext, tileSizeX: number, tileSizeZ: number, componentSizeQuads: number, maxLODLevel: number) {
        this.#redGPUContext = redGPUContext;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#componentSizeQuads = componentSizeQuads;
        this.#maxLODLevel = maxLODLevel;

        this.#buildCombinedGeometry();
    }

    get combinedVertexBuffer(): VertexBuffer | null {
        return this.#combinedVertexBuffer;
    }

    get combinedIndexBuffer(): IndexBuffer | null {
        return this.#combinedIndexBuffer;
    }

    get combinedWireframeIndexBuffer(): IndexBuffer | null {
        return this.#combinedWireframeIndexBuffer;
    }

    get lodRanges(): LandscapeLODGeometryRange[] {
        return this.#lodRanges;
    }

    get maxLODLevel(): number {
        return this.#maxLODLevel;
    }

    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    updateTileSize(tileSizeX: number, tileSizeZ: number): void {
        if (this.#tileSizeX !== tileSizeX || this.#tileSizeZ !== tileSizeZ) {
            this.#tileSizeX = tileSizeX;
            this.#tileSizeZ = tileSizeZ;
            this.#buildCombinedGeometry();
        }
    }

    getLODRange(lodLevel: number): LandscapeLODGeometryRange {
        const index = Math.min(Math.max(0, lodLevel), this.#lodRanges.length - 1);
        return this.#lodRanges[index];
    }

    #buildCombinedGeometry(): void {
        const maxLODLevel = this.#maxLODLevel;
        const baseComponentSizeQuads = this.#componentSizeQuads;
        const halfSizeX = this.#tileSizeX / 2;
        const halfSizeZ = this.#tileSizeZ / 2;
        const SKIRT_DEPTH = -25.0;

        const allInterleavedData: number[] = [];
        const allIndices: number[] = [];
        const allWireframeIndices: number[] = [];
        this.#lodRanges.length = 0;

        let totalVertexOffset = 0;
        let totalIndexOffset = 0;
        let totalWireframeIndexOffset = 0;

        for (let lod = 0; lod < maxLODLevel; lod++) {
            const step = Math.pow(2, lod);
            const segmentsX = Math.max(1, Math.floor(baseComponentSizeQuads / step));
            const segmentsZ = Math.max(1, Math.floor(baseComponentSizeQuads / step));

            const innerVertexCount = (segmentsX + 1) * (segmentsZ + 1);
            const baseVertex = totalVertexOffset;
            const firstIndex = totalIndexOffset;
            const wireframeFirstIndex = totalWireframeIndexOffset;

            for (let z = 0; z <= segmentsZ; z++) {
                const percentZ = z / segmentsZ;
                const posZ = percentZ * this.#tileSizeZ - halfSizeZ;

                for (let x = 0; x <= segmentsX; x++) {
                    const percentX = x / segmentsX;
                    const posX = percentX * this.#tileSizeX - halfSizeX;

                    allInterleavedData.push(posX, posZ, 0.0);

                    allInterleavedData.push(0, 1, 0);

                    allInterleavedData.push(percentX, percentZ);
                }
            }

            for (let z = 0; z < segmentsZ; z++) {
                for (let x = 0; x < segmentsX; x++) {
                    const row1 = z * (segmentsX + 1);
                    const row2 = (z + 1) * (segmentsX + 1);

                    const a = row1 + x;
                    const b = row1 + x + 1;
                    const c = row2 + x;
                    const d = row2 + x + 1;

                    allIndices.push(a, c, b);
                    allIndices.push(b, c, d);

                    allWireframeIndices.push(a, c, c, b, b, a);
                    allWireframeIndices.push(b, c, c, d, d, b);
                }
            }

            let currentSkirtLocalIndex = innerVertexCount;

            const northSkirtStartIndex = currentSkirtLocalIndex;
            for (let x = 0; x <= segmentsX; x++) {
                const percentX = x / segmentsX;
                const posX = percentX * this.#tileSizeX - halfSizeX;
                const posZ = -halfSizeZ;
                allInterleavedData.push(posX, posZ, SKIRT_DEPTH);
                allInterleavedData.push(0, 1, 0);
                allInterleavedData.push(percentX, 0.0);
                currentSkirtLocalIndex++;
            }
            for (let x = 0; x < segmentsX; x++) {
                const innerA = x;
                const innerB = x + 1;
                const skirtA = northSkirtStartIndex + x;
                const skirtB = northSkirtStartIndex + x + 1;
                allIndices.push(innerA, skirtB, skirtA);
                allIndices.push(innerA, innerB, skirtB);
                allWireframeIndices.push(innerA, skirtA, skirtA, skirtB, skirtB, innerB);
            }

            const southSkirtStartIndex = currentSkirtLocalIndex;
            const southInnerRow = segmentsZ * (segmentsX + 1);
            for (let x = 0; x <= segmentsX; x++) {
                const percentX = x / segmentsX;
                const posX = percentX * this.#tileSizeX - halfSizeX;
                const posZ = halfSizeZ;
                allInterleavedData.push(posX, posZ, SKIRT_DEPTH);
                allInterleavedData.push(0, 1, 0);
                allInterleavedData.push(percentX, 1.0);
                currentSkirtLocalIndex++;
            }
            for (let x = 0; x < segmentsX; x++) {
                const innerA = southInnerRow + x;
                const innerB = southInnerRow + x + 1;
                const skirtA = southSkirtStartIndex + x;
                const skirtB = southSkirtStartIndex + x + 1;
                allIndices.push(innerA, skirtA, skirtB);
                allIndices.push(innerA, skirtB, innerB);
                allWireframeIndices.push(innerA, skirtA, skirtA, skirtB, skirtB, innerB);
            }

            const westSkirtStartIndex = currentSkirtLocalIndex;
            for (let z = 0; z <= segmentsZ; z++) {
                const percentZ = z / segmentsZ;
                const posX = -halfSizeX;
                const posZ = percentZ * this.#tileSizeZ - halfSizeZ;
                allInterleavedData.push(posX, posZ, SKIRT_DEPTH);
                allInterleavedData.push(0, 1, 0);
                allInterleavedData.push(0.0, percentZ);
                currentSkirtLocalIndex++;
            }
            for (let z = 0; z < segmentsZ; z++) {
                const innerA = z * (segmentsX + 1);
                const innerB = (z + 1) * (segmentsX + 1);
                const skirtA = westSkirtStartIndex + z;
                const skirtB = westSkirtStartIndex + z + 1;
                allIndices.push(innerA, skirtA, skirtB);
                allIndices.push(innerA, skirtB, innerB);
                allWireframeIndices.push(innerA, skirtA, skirtA, skirtB, skirtB, innerB);
            }

            const eastSkirtStartIndex = currentSkirtLocalIndex;
            for (let z = 0; z <= segmentsZ; z++) {
                const percentZ = z / segmentsZ;
                const posX = halfSizeX;
                const posZ = percentZ * this.#tileSizeZ - halfSizeZ;
                allInterleavedData.push(posX, posZ, SKIRT_DEPTH);
                allInterleavedData.push(0, 1, 0);
                allInterleavedData.push(1.0, percentZ);
                currentSkirtLocalIndex++;
            }
            for (let z = 0; z < segmentsZ; z++) {
                const innerA = z * (segmentsX + 1) + segmentsX;
                const innerB = (z + 1) * (segmentsX + 1) + segmentsX;
                const skirtA = eastSkirtStartIndex + z;
                const skirtB = eastSkirtStartIndex + z + 1;
                allIndices.push(innerA, skirtB, skirtA);
                allIndices.push(innerA, innerB, skirtB);
                allWireframeIndices.push(innerA, skirtA, skirtA, skirtB, skirtB, innerB);
            }

            const totalLodVertexCount = currentSkirtLocalIndex;
            const totalLodIndexCount = allIndices.length - firstIndex;
            const totalLodWireframeIndexCount = allWireframeIndices.length - wireframeFirstIndex;

            this.#lodRanges.push({
                lodLevel: lod,
                firstIndex: firstIndex,
                indexCount: totalLodIndexCount,
                wireframeFirstIndex: wireframeFirstIndex,
                wireframeIndexCount: totalLodWireframeIndexCount,
                baseVertex: baseVertex
            });

            totalVertexOffset += totalLodVertexCount;
            totalIndexOffset += totalLodIndexCount;
            totalWireframeIndexOffset += totalLodWireframeIndexCount;
        }

        const vertexStruct = new VertexInterleavedStruct({
            aVertexPosition: VertexInterleaveType.float32x3,
            aVertexNormal: VertexInterleaveType.float32x3,
            aTexcoord: VertexInterleaveType.float32x2
        });

        this.#combinedVertexBuffer = new VertexBuffer(
            this.#redGPUContext,
            new Float32Array(allInterleavedData),
            vertexStruct
        );

        this.#combinedIndexBuffer = new IndexBuffer(
            this.#redGPUContext,
            new Uint32Array(allIndices)
        );

        this.#combinedWireframeIndexBuffer = new IndexBuffer(
            this.#redGPUContext,
            new Uint32Array(allWireframeIndices)
        );
    }
}

export default LandscapeSharedGeometry;

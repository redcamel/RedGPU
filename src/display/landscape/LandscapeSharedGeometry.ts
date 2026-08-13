import RedGPUContext from "../../context/RedGPUContext";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../resources/buffer/vertexBuffer/VertexInterleaveType";

export interface LandscapeLODGeometryRange {
    lodLevel: number;
    firstIndex: number;
    indexCount: number;
    baseVertex: number;
}

/**
 * [KO] Landscape LOD 0 ~ LOD N 전체 단계 지오메트리를 단 하나의 거대한 GPU 통합 버퍼(Combined Buffer)로 보관 및 관리하는 클래스입니다.
 * [EN] Class that retains and manages Landscape LOD 0 ~ LOD N geometries as a single giant GPU Combined Buffer.
 */
export class LandscapeSharedGeometry {
    #redGPUContext: RedGPUContext;
    #tileSizeX: number;
    #tileSizeZ: number;
    #componentSizeQuads: number;
    #maxLODLevel: number;

    #combinedVertexBuffer: VertexBuffer | null = null;
    #combinedIndexBuffer: IndexBuffer | null = null;
    #lodRanges: LandscapeLODGeometryRange[] = [];

    /**
     * [KO] LandscapeSharedGeometry 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeSharedGeometry.
     */
    constructor(redGPUContext: RedGPUContext, tileSizeX: number, tileSizeZ: number, componentSizeQuads: number, maxLODLevel: number) {
        this.#redGPUContext = redGPUContext;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#componentSizeQuads = componentSizeQuads;
        this.#maxLODLevel = maxLODLevel;

        this.#buildCombinedGeometry();
    }

    /** [KO] 거대 단일 통합 VertexBuffer 반환 */
    get combinedVertexBuffer(): VertexBuffer | null {
        return this.#combinedVertexBuffer;
    }

    /** [KO] 거대 단일 통합 IndexBuffer 반환 */
    get combinedIndexBuffer(): IndexBuffer | null {
        return this.#combinedIndexBuffer;
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

    /** [KO] 지정된 LOD 레벨의 오프셋 범위를 반환합니다. */
    getLODRange(lodLevel: number): LandscapeLODGeometryRange {
        const index = Math.min(Math.max(0, lodLevel), this.#lodRanges.length - 1);
        return this.#lodRanges[index];
    }

    /**
     * [KO] 전체 LOD 단계 지오메트리를 단 하나의 거대 GPU 버퍼로 결합 생성합니다.
     */
    #buildCombinedGeometry(): void {
        const maxLODLevel = this.#maxLODLevel;
        const baseComponentSizeQuads = this.#componentSizeQuads;
        const halfSizeX = this.#tileSizeX / 2;
        const halfSizeZ = this.#tileSizeZ / 2;

        const allInterleavedData: number[] = [];
        const allIndices: number[] = [];
        this.#lodRanges.length = 0;

        let totalVertexOffset = 0;
        let totalIndexOffset = 0;

        for (let lod = 0; lod < maxLODLevel; lod++) {
            const step = Math.pow(2, lod);
            const segmentsX = Math.max(1, Math.floor(baseComponentSizeQuads / step));
            const segmentsZ = Math.max(1, Math.floor(baseComponentSizeQuads / step));

            const vertexCount = (segmentsX + 1) * (segmentsZ + 1);
            const indexCount = segmentsX * segmentsZ * 6;
            const baseVertex = totalVertexOffset;
            const firstIndex = totalIndexOffset;

            // 버텍스 생성 (Interleaved: position x,y,z, normal x,y,z, uv u,v)
            for (let z = 0; z <= segmentsZ; z++) {
                const percentZ = z / segmentsZ;
                const posZ = percentZ * this.#tileSizeZ - halfSizeZ;

                for (let x = 0; x <= segmentsX; x++) {
                    const percentX = x / segmentsX;
                    const posX = percentX * this.#tileSizeX - halfSizeX;

                    // Position (x, y, z)
                    allInterleavedData.push(posX, posZ, 0);
                    // Normal (x, y, z)
                    allInterleavedData.push(0, 1, 0);
                    // UV (u, v)
                    allInterleavedData.push(percentX, percentZ);
                }
            }

            // 인덱스 생성 (drawIndexed의 baseVertex 오프셋과 연동되는 0 기반 상대 인덱스 생성)
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
                }
            }

            this.#lodRanges.push({
                lodLevel: lod,
                firstIndex: firstIndex,
                indexCount: indexCount,
                baseVertex: baseVertex
            });

            totalVertexOffset += vertexCount;
            totalIndexOffset += indexCount;
        }

        // 단 1개의 거대한 GPU VertexBuffer & IndexBuffer 생성
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
    }
}

export default LandscapeSharedGeometry;

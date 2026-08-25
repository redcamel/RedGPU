import RedGPUContext from "../../../context/RedGPUContext";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import {validateLandscapeBaseGridSize} from "../core/LANDSCAPE_BASE_GRID_SIZE";

/**
 * [KO] Landscape LOD별 결합 지오메트리 버퍼 범위 인터페이스입니다.
 * [EN] Interface for Landscape LOD geometry buffer ranges.
 */
export interface LandscapeLODGeometryRange {
    lodLevel: number;
    firstIndex: number;
    indexCount: number;
    wireframeFirstIndex: number;
    wireframeIndexCount: number;
    baseVertex: number;
}

/**
 * [KO] Landscape 타일 전체 LOD에 대한 정점 및 인덱스 버퍼를 단일 결합 버퍼로 생성/관리하는 공유 지오메트리 클래스입니다.
 * [EN] Shared geometry class that generates and manages combined vertex and index buffers across all LOD levels for Landscape tiles.
 *
 * [KO] 정점 속성은 위치(`aVertexPosition: float32x3`)와 UV(`aTexcoord: float32x2`)로 구성되어 버텍스당 20바이트의 메모리를 사용합니다.
 * [EN] Vertex attributes consist of position (`aVertexPosition: float32x3`) and UV (`aTexcoord: float32x2`), utilizing 20 bytes per vertex.
 */
export class LandscapeSharedGeometry {
    #redGPUContext: RedGPUContext;
    #tileSizeX: number;
    #tileSizeZ: number;
    #componentSizeQuads: number;
    #lod0SizeQuads: number = 512;
    #maxLODLevel: number;

    #combinedVertexBuffer: VertexBuffer | null = null;
    #combinedIndexBuffer: IndexBuffer | null = null;
    #combinedWireframeIndexBuffer: IndexBuffer | null = null;
    #lodRanges: LandscapeLODGeometryRange[] = [];

    /**
     * [KO] LandscapeSharedGeometry 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeSharedGeometry.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param tileSizeX - [KO] 타일 가로 크기 [EN] Tile width along X-axis
     * @param tileSizeZ - [KO] 타일 세로 크기 [EN] Tile depth along Z-axis
     * @param componentSizeQuads - [KO] 기본 그리드 쿼드 수 (LOD 1 기준) [EN] Base grid quads count (for LOD 1)
     * @param maxLODLevel - [KO] 최대 LOD 레벨 수 [EN] Maximum LOD levels
     * @param lod0SizeQuads - [KO] LOD 0 전용 초고밀도 쿼드 수 (기본 512) [EN] Ultra high-density quads count for LOD 0 (default 512)
     */
    constructor(redGPUContext: RedGPUContext, tileSizeX: number, tileSizeZ: number, componentSizeQuads: number, maxLODLevel: number, lod0SizeQuads: number = 512) {
        validateLandscapeBaseGridSize(componentSizeQuads);
        this.#redGPUContext = redGPUContext;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#componentSizeQuads = componentSizeQuads;
        this.#lod0SizeQuads = Math.max(componentSizeQuads, lod0SizeQuads);
        this.#maxLODLevel = maxLODLevel;

        this.#buildCombinedGeometry();
    }

    /**
     * [KO] 결합된 정점 버퍼를 반환합니다.
     * [EN] Returns the combined vertex buffer.
     */
    get combinedVertexBuffer(): VertexBuffer | null {
        return this.#combinedVertexBuffer;
    }

    /**
     * [KO] 결합된 기본 인덱스 버퍼를 반환합니다.
     * [EN] Returns the combined index buffer.
     */
    get combinedIndexBuffer(): IndexBuffer | null {
        return this.#combinedIndexBuffer;
    }

    /**
     * [KO] 결합된 와이어프레임 인덱스 버퍼를 반환합니다.
     * [EN] Returns the combined wireframe index buffer.
     */
    get combinedWireframeIndexBuffer(): IndexBuffer | null {
        return this.#combinedWireframeIndexBuffer;
    }

    get maxLODLevel(): number {
        return this.#maxLODLevel;
    }

    /**
     * [KO] 컴포넌트 쿼드 그리드 크기를 반환합니다.
     * [EN] Returns the component quad grid size.
     */
    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    /**
     * [KO] LOD 0 전용 쿼드 그리드 크기를 반환합니다.
     * [EN] Returns the LOD 0 quad grid size.
     */
    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

    /**
     * [KO] 그리드 쿼드 해상도를 변경하고 결합 지오메트리를 재생성합니다.
     * [EN] Updates the grid quad resolutions and rebuilds the combined geometry.
     */
    updateGridSize(componentSizeQuads: number, lod0SizeQuads?: number): void {
        validateLandscapeBaseGridSize(componentSizeQuads);
        this.#componentSizeQuads = componentSizeQuads;
        if (lod0SizeQuads !== undefined) {
            this.#lod0SizeQuads = Math.max(componentSizeQuads, lod0SizeQuads);
        }
        this.#buildCombinedGeometry();
    }

    /**
     * [KO] 타일 크기를 변경하고 결합 지오메트리를 재생성합니다.
     * [EN] Updates the tile size and rebuilds the combined geometry.
     *
     * @param tileSizeX - [KO] 타일 X축 크기 [EN] Tile size along X-axis
     * @param tileSizeZ - [KO] 타일 Z축 크기 [EN] Tile size along Z-axis
     */
    updateTileSize(tileSizeX: number, tileSizeZ: number): void {
        if (this.#tileSizeX !== tileSizeX || this.#tileSizeZ !== tileSizeZ) {
            this.#tileSizeX = tileSizeX;
            this.#tileSizeZ = tileSizeZ;
            this.#buildCombinedGeometry();
        }
    }

    /**
     * [KO] 특정 LOD 레벨의 지오메트리 버퍼 범위를 반환합니다.
     * [EN] Returns the geometry buffer range for a specific LOD level.
     *
     * @param lodLevel - [KO] 조회할 LOD 레벨 [EN] LOD level to query
     * @returns [KO] LOD 범위 정보 [EN] LOD range info
     */
    getLODRange(lodLevel: number): LandscapeLODGeometryRange {
        const index = Math.min(Math.max(0, lodLevel), this.#lodRanges.length - 1);
        return this.#lodRanges[index];
    }

    #buildCombinedGeometry(): void {
        const maxLODLevel = this.#maxLODLevel;
        const lod0Quads = Math.max(this.#componentSizeQuads, this.#lod0SizeQuads);
        const baseComponentSizeQuads = this.#componentSizeQuads;
        const halfSizeX = this.#tileSizeX / 2;
        const halfSizeZ = this.#tileSizeZ / 2;
        const SKIRT_FLAG = -1.0;

        const allInterleavedData: number[] = [];
        const allIndices: number[] = [];
        const allWireframeIndices: number[] = [];
        this.#lodRanges.length = 0;

        let totalVertexOffset = 0;
        let totalIndexOffset = 0;
        let totalWireframeIndexOffset = 0;

        for (let lod = 0; lod < maxLODLevel; lod++) {
            let segmentsX: number;
            let segmentsZ: number;
            if (lod === 0) {
                segmentsX = lod0Quads;
                segmentsZ = lod0Quads;
            } else {
                const step = Math.pow(2, lod - 1);
                segmentsX = Math.max(1, Math.floor(baseComponentSizeQuads / step));
                segmentsZ = Math.max(1, Math.floor(baseComponentSizeQuads / step));
            }

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
                allInterleavedData.push(posX, posZ, SKIRT_FLAG);
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
                allInterleavedData.push(posX, posZ, SKIRT_FLAG);
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
                allInterleavedData.push(posX, posZ, SKIRT_FLAG);
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
                allInterleavedData.push(posX, posZ, SKIRT_FLAG);
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

    /**
     * [KO] 공유 지오메트리 GPU 버퍼 리소스를 해제합니다.
     * [EN] Destroys shared geometry GPU buffer resources.
     */
    destroy(): void {
        if (this.#combinedVertexBuffer) {
            this.#combinedVertexBuffer.destroy();
            this.#combinedVertexBuffer = null;
        }
        if (this.#combinedIndexBuffer) {
            this.#combinedIndexBuffer.destroy();
            this.#combinedIndexBuffer = null;
        }
        if (this.#combinedWireframeIndexBuffer) {
            this.#combinedWireframeIndexBuffer.destroy();
            this.#combinedWireframeIndexBuffer = null;
        }
        this.#lodRanges.length = 0;
    }
}

export default LandscapeSharedGeometry;

import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";

/**
 * [KO] 단일 LOD 레벨 지오메트리의 버텍스 및 인덱스 버퍼 오프셋 범위 정보입니다.
 * [EN] Range metadata defining vertex and index buffer offsets for a single LOD geometry level.
 */
export interface LandscapeLODGeometryRange {
    /**
     * [KO] LOD 레벨 (0이 최고 해상도)
     * [EN] LOD level (0 is highest resolution)
     */
    lodLevel: number;
    /**
     * [KO] 결합 인덱스 버퍼 내 해당 LOD의 첫 번째 인덱스 오프셋
     * [EN] Starting index offset for this LOD within the combined index buffer
     */
    firstIndex: number;
    /**
     * [KO] 해당 LOD가 사용하는 총 인덱스 개수
     * [EN] Total index count utilized by this LOD level
     */
    indexCount: number;
    /**
     * [KO] 와이어프레임 렌더링용 결합 인덱스 버퍼 내 첫 번째 인덱스 오프셋
     * [EN] Starting index offset for wireframe rendering within the combined wireframe index buffer
     */
    wireframeFirstIndex: number;
    /**
     * [KO] 와이어프레임 렌더링에 사용되는 총 인덱스 개수
     * [EN] Total index count utilized for wireframe rendering
     */
    wireframeIndexCount: number;
    /**
     * [KO] 결합 버텍스 버퍼 내 해당 LOD의 기본 버텍스 시작 오프셋
     * [EN] Base vertex starting offset for this LOD within the combined vertex buffer
     */
    baseVertex: number;
}

/**
 * [KO] 모든 LOD 레벨의 평면 그리드 및 T-Junction 크랙 방지용 스커트(Skirt) 지오메트리를 단일 버텍스/인덱스 버퍼로 통합 관리하는 공유 지오메트리 클래스입니다.
 * [EN] Shared geometry class managing single combined vertex and index buffers across all LOD levels with crack-preventing skirts.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeSharedGeometry extends RedGPUObject {
    #tileSizeX: number;
    #tileSizeZ: number;
    #componentSizeQuads: number;
    #lod0SizeQuads: number;
    #lodMaxLevel: number;

    #combinedVertexBuffer: VertexBuffer | null = null;
    #combinedIndexBuffer: IndexBuffer | null = null;
    #combinedWireframeIndexBuffer: IndexBuffer | null = null;
    #lodRanges: LandscapeLODGeometryRange[] = [];

    /**
     * [KO] LandscapeSharedGeometry 생성자입니다.
     * [EN] Constructor for LandscapeSharedGeometry.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 / [EN] RedGPU context
     * @param tileSizeX - [KO] 단일 타일의 월드 X축 크기 / [EN] World size of a single tile along X axis
     * @param tileSizeZ - [KO] 단일 타일의 월드 Z축 크기 / [EN] World size of a single tile along Z axis
     * @param componentSizeQuads - [KO] 타일 기본 쿼드 분할 해상도 / [EN] Base quad resolution per tile component
     * @param lodMaxLevel - [KO] 최대 LOD 단계 수 / [EN] Maximum LOD levels count
     * @param lod0SizeQuads - [KO] LOD 0 단계의 쿼드 해상도 (기본값: 256) / [EN] Quad resolution for LOD 0 (default: 256)
     */
    constructor(redGPUContext: RedGPUContext, tileSizeX: number, tileSizeZ: number, componentSizeQuads: number, lodMaxLevel: number, lod0SizeQuads: number = 256) {
        super(redGPUContext);
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#componentSizeQuads = componentSizeQuads;
        this.#lod0SizeQuads = Math.max(componentSizeQuads, lod0SizeQuads);
        this.#lodMaxLevel = lodMaxLevel;

        this.#buildCombinedGeometry();
    }

    /**
     * [KO] 모든 LOD 레벨이 패킹된 통합 버텍스 버퍼를 반환합니다.
     * [EN] Returns the combined vertex buffer containing packed data across all LOD levels.
     */
    get combinedVertexBuffer(): VertexBuffer | null {
        return this.#combinedVertexBuffer;
    }

    /**
     * [KO] 솔리드 트라이앵글 렌더링용 통합 인덱스 버퍼를 반환합니다.
     * [EN] Returns the combined index buffer for solid triangle rendering.
     */
    get combinedIndexBuffer(): IndexBuffer | null {
        return this.#combinedIndexBuffer;
    }

    /**
     * [KO] 와이어프레임 렌더링용 통합 라인 인덱스 버퍼를 반환합니다.
     * [EN] Returns the combined index buffer for wireframe line rendering.
     */
    get combinedWireframeIndexBuffer(): IndexBuffer | null {
        return this.#combinedWireframeIndexBuffer;
    }

    /**
     * [KO] 생성된 최대 LOD 단계 수를 반환합니다.
     * [EN] Returns the maximum number of LOD levels.
     */
    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

    /**
     * [KO] 컴포넌트의 기본 쿼드 세그먼트 크기를 반환합니다.
     * [EN] Returns the base quad segment count per component.
     */
    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    /**
     * [KO] LOD 0 단계의 쿼드 세그먼트 크기를 반환합니다.
     * [EN] Returns the quad segment count for LOD 0.
     */
    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

    /**
     * [KO] 타일 월드 크기를 갱신하고 결합 지오메트리를 재생성합니다.
     * [EN] Updates the tile world size and rebuilds the combined geometry buffers.
     *
     * @param tileSizeX - [KO] 새로운 타일 X축 크기 / [EN] New tile size along X axis
     * @param tileSizeZ - [KO] 새로운 타일 Z축 크기 / [EN] New tile size along Z axis
     */
    updateTileSize(tileSizeX: number, tileSizeZ: number): void {
        if (this.#tileSizeX !== tileSizeX || this.#tileSizeZ !== tileSizeZ) {
            this.#tileSizeX = tileSizeX;
            this.#tileSizeZ = tileSizeZ;
            this.#buildCombinedGeometry();
        }
    }

    /**
     * [KO] 특정 LOD 단계에 해당하는 지오메트리 오프셋 범위를 반환합니다.
     * [EN] Returns the geometry range metadata for the specified LOD level.
     *
     * @param lodLevel - [KO] 요청할 LOD 레벨 / [EN] Target LOD level
     */
    getLODRange(lodLevel: number): LandscapeLODGeometryRange {
        const index = Math.min(Math.max(0, lodLevel), this.#lodRanges.length - 1);
        return this.#lodRanges[index];
    }

    #buildCombinedGeometry(): void {
        const lodMaxLevel = this.#lodMaxLevel;
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

        for (let lod = 0; lod < lodMaxLevel; lod++) {
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
            this.redGPUContext,
            new Float32Array(allInterleavedData),
            vertexStruct
        );

        this.#combinedIndexBuffer = new IndexBuffer(
            this.redGPUContext,
            new Uint32Array(allIndices)
        );

        this.#combinedWireframeIndexBuffer = new IndexBuffer(
            this.redGPUContext,
            new Uint32Array(allWireframeIndices)
        );
    }

    /**
     * [KO] 내부 버텍스 및 인덱스 GPU 버퍼 리소스를 해제합니다.
     * [EN] Destroys internal vertex and index GPU buffer resources.
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

Object.freeze(LandscapeSharedGeometry);
export default LandscapeSharedGeometry;

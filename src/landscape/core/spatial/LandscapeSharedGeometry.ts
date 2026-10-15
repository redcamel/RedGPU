import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";

/**
 * [KO] 단일 LOD 레벨의 정점 및 인덱스 버퍼 오프셋 범위를 정의하는 인터페이스입니다.
 * [EN] Interface defining vertex and index buffer offset ranges for a single LOD level.
 *
 * @category Landscape
 */
export interface LandscapeLODGeometryRange {
    /**
     * [KO] 대상 LOD 레벨 인덱스
     * [EN] Target LOD level index
     */
    lodLevel: number;
    /**
     * [KO] 솔리드 렌더링용 시작 인덱스 오프셋
     * [EN] Starting index offset for solid rendering
     */
    firstIndex: number;
    /**
     * [KO] 솔리드 렌더링용 인덱스 개수
     * [EN] Index count for solid rendering
     */
    indexCount: number;
    /**
     * [KO] 와이어프레임 렌더링용 시작 인덱스 오프셋
     * [EN] Starting index offset for wireframe rendering
     */
    wireframeFirstIndex: number;
    /**
     * [KO] 와이어프레임 렌더링용 인덱스 개수
     * [EN] Index count for wireframe rendering
     */
    wireframeIndexCount: number;
    /**
     * [KO] 정점 버퍼 내 기준 정점(Base Vertex) 오프셋
     * [EN] Base vertex offset within the vertex buffer
     */
    baseVertex: number;
}

/**
 * [KO] 모든 지형(Landscape) 타일 컴포넌트가 공유하는 다단계 LOD 그리드 및 스커트(Skirt) 통합 지오메트리를 생성하고 관리하는 클래스입니다.
 * [EN] Class that generates and manages the combined multi-level LOD grid and skirt geometry shared by all Landscape tile components.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class LandscapeSharedGeometry extends RedGPUObject {
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
     * [KO] LandscapeSharedGeometry 인스턴스를 생성하고 전체 LOD 통합 버퍼를 빌드합니다.
     * [EN] Creates a LandscapeSharedGeometry instance and builds the combined buffer for all LODs.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPUContext instance
     * @param tileSizeX -
     * [KO] 단일 타일의 가로(X) 월드 크기
     * [EN] World width (X) of a single tile
     * @param tileSizeZ -
     * [KO] 단일 타일의 세로(Z) 월드 크기
     * [EN] World depth (Z) of a single tile
     * @param componentSizeQuads -
     * [KO] 기본 타일 컴포넌트의 축당 쿼드(Quad) 분할 수
     * [EN] Quad subdivision count per axis of a base tile component
     * @param lodMaxLevel -
     * [KO] 생성할 최대 LOD 단계 수
     * [EN] Maximum number of LOD levels to generate
     * @param lod0SizeQuads -
     * [KO] 최고 해상도인 LOD 0 단계의 축당 쿼드 분할 수
     * [EN] Quad subdivision count per axis at the highest resolution LOD 0
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
     * [KO] 전체 LOD 정점이 하나로 병합된 공유 정점 버퍼를 반환합니다.
     * [EN] Returns the shared vertex buffer containing merged vertices for all LODs.
     */
    get combinedVertexBuffer(): VertexBuffer | null {
        return this.#combinedVertexBuffer;
    }

    /**
     * [KO] 전체 LOD 삼각형 인덱스가 하나로 병합된 공유 인덱스 버퍼를 반환합니다.
     * [EN] Returns the shared index buffer containing merged triangle indices for all LODs.
     */
    get combinedIndexBuffer(): IndexBuffer | null {
        return this.#combinedIndexBuffer;
    }

    /**
     * [KO] 전체 LOD 와이어프레임 라인 인덱스가 병합된 공유 인덱스 버퍼를 반환합니다.
     * [EN] Returns the shared index buffer containing merged wireframe line indices for all LODs.
     */
    get combinedWireframeIndexBuffer(): IndexBuffer | null {
        return this.#combinedWireframeIndexBuffer;
    }

    /**
     * [KO] 최대 LOD 레벨 수를 반환합니다.
     * [EN] Returns the maximum number of LOD levels.
     */
    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

    /**
     * [KO] 기본 타일 컴포넌트의 축당 쿼드 분할 수를 반환합니다.
     * [EN] Returns the quad subdivision count per axis of the base tile component.
     */
    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    /**
     * [KO] LOD 0 단계의 축당 쿼드 분할 수를 반환합니다.
     * [EN] Returns the quad subdivision count per axis at LOD 0.
     */
    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

    /**
     * [KO] 타일의 가로/세로 월드 크기를 변경하고 공유 지오메트리 버퍼를 재빌드합니다.
     * [EN] Updates the tile world width/depth and rebuilds the shared geometry buffers.
     *
     * @param tileSizeX -
     * [KO] 변경할 타일 가로(X) 월드 크기
     * [EN] New tile world width (X)
     * @param tileSizeZ -
     * [KO] 변경할 타일 세로(Z) 월드 크기
     * [EN] New tile world depth (Z)
     */
    updateTileSize(tileSizeX: number, tileSizeZ: number): void {
        if (this.#tileSizeX !== tileSizeX || this.#tileSizeZ !== tileSizeZ) {
            this.#tileSizeX = tileSizeX;
            this.#tileSizeZ = tileSizeZ;
            this.#buildCombinedGeometry();
        }
    }

    /**
     * [KO] 지정한 LOD 레벨에 해당하는 정점 및 인덱스 오프셋 범위 정보를 반환합니다.
     * [EN] Returns the vertex and index offset range information for the specified LOD level.
     *
     * @param lodLevel -
     * [KO] 조회할 LOD 레벨 인덱스
     * [EN] LOD level index to query
     * @returns
     * [KO] 해당 LOD 레벨의 지오메트리 범위 객체
     * [EN] Geometry range object for the specified LOD level
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
     * [KO] 생성된 공유 정점 버퍼 및 인덱스 버퍼들을 모두 파괴하고 메모리를 해제합니다.
     * [EN] Destroys all generated shared vertex and index buffers and releases memory.
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

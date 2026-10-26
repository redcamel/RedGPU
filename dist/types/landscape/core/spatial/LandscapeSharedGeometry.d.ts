import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
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
declare class LandscapeSharedGeometry extends RedGPUObject {
    #private;
    /**
     * [KO] `LandscapeSharedGeometry` 인스턴스를 생성하고 전체 LOD 통합 버퍼를 빌드합니다.
     * [EN] Creates a `LandscapeSharedGeometry` instance and builds the combined buffer for all LODs.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
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
    constructor(redGPUContext: RedGPUContext, tileSizeX: number, tileSizeZ: number, componentSizeQuads: number, lodMaxLevel: number, lod0SizeQuads?: number);
    /**
     * [KO] 전체 LOD 정점이 하나로 병합된 공유 정점 버퍼를 반환합니다.
     * [EN] Returns the shared vertex buffer containing merged vertices for all LODs.
     *
     * @returns
     * [KO] 공유 정점 버퍼 (`VertexBuffer`) 또는 `null`
     * [EN] Shared vertex buffer (`VertexBuffer`) or `null`
     */
    get combinedVertexBuffer(): VertexBuffer | null;
    /**
     * [KO] 전체 LOD 삼각형 인덱스가 하나로 병합된 공유 인덱스 버퍼를 반환합니다.
     * [EN] Returns the shared index buffer containing merged triangle indices for all LODs.
     *
     * @returns
     * [KO] 공유 삼각형 인덱스 버퍼 (`IndexBuffer`) 또는 `null`
     * [EN] Shared triangle index buffer (`IndexBuffer`) or `null`
     */
    get combinedIndexBuffer(): IndexBuffer | null;
    /**
     * [KO] 전체 LOD 와이어프레임 라인 인덱스가 병합된 공유 인덱스 버퍼를 반환합니다.
     * [EN] Returns the shared index buffer containing merged wireframe line indices for all LODs.
     *
     * @returns
     * [KO] 공유 와이어프레임 인덱스 버퍼 (`IndexBuffer`) 또는 `null`
     * [EN] Shared wireframe index buffer (`IndexBuffer`) or `null`
     */
    get combinedWireframeIndexBuffer(): IndexBuffer | null;
    /**
     * [KO] 최대 LOD 레벨 수를 반환합니다.
     * [EN] Returns the maximum number of LOD levels.
     *
     * @returns
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     */
    get lodMaxLevel(): number;
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
    updateTileSize(tileSizeX: number, tileSizeZ: number): void;
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
    getLODRange(lodLevel: number): LandscapeLODGeometryRange;
    /**
     * [KO] 생성된 공유 정점 버퍼 및 인덱스 버퍼들을 모두 파괴하고 메모리를 해제합니다.
     * [EN] Destroys all generated shared vertex and index buffers and releases memory.
     */
    destroy(): void;
}
export default LandscapeSharedGeometry;

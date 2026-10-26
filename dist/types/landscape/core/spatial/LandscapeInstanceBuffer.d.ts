import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 지형(Landscape) 타일 인스턴스 버퍼, 가시 타일 스토리지 버퍼, 인다이렉트 드로우 버퍼 및 전역 지형 유니폼 버퍼를 관리하는 클래스입니다.
 * [EN] Class that manages Landscape tile instance buffers, visible tile storage buffers, indirect draw buffers, and global terrain uniform buffers.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeInstanceBuffer extends RedGPUObject {
    #private;
    /**
     * [KO] `LandscapeInstanceBuffer` 인스턴스를 생성하고 GPU 버퍼들을 할당합니다.
     * [EN] Creates a `LandscapeInstanceBuffer` instance and allocates GPU buffers.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param maxComponentCount -
     * [KO] 최대 타일 컴포넌트 개수
     * [EN] Maximum number of tile components
     * @param lodMaxLevel -
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     */
    constructor(redGPUContext: RedGPUContext, maxComponentCount: number, lodMaxLevel: number);
    /**
     * [KO] 모든 타일의 정적 월드 좌표 및 높이 경계가 저장된 GPU 버퍼를 반환합니다.
     * [EN] Returns the GPU buffer storing static world coordinates and height bounds for all tiles.
     *
     * @returns
     * [KO] 전체 타일 정적 정보 `GPUBuffer` 또는 `null`
     * [EN] Static tile information `GPUBuffer` or `null`
     */
    get allTilesBuffer(): GPUBuffer | null;
    /**
     * [KO] GPU 컬링 통과 후 가시 타일 데이터가 기록되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer where visible tile data is written after GPU culling.
     *
     * @returns
     * [KO] 가시 타일 스토리지 `GPUBuffer` 또는 `null`
     * [EN] Visible tile storage `GPUBuffer` or `null`
     */
    get visibleTilesBuffer(): GPUBuffer | null;
    /**
     * [KO] LOD별 `drawIndexedIndirect` 인자가 저장된 GPU 버퍼를 반환합니다.
     * [EN] Returns the GPU buffer storing `drawIndexedIndirect` arguments per LOD.
     *
     * @returns
     * [KO] 인다이렉트 드로우 `GPUBuffer` 또는 `null`
     * [EN] Indirect draw `GPUBuffer` or `null`
     */
    get indirectDrawBuffer(): GPUBuffer | null;
    /**
     * [KO] 지형 렌더링 시 그룹 1에 바인딩되는 인스턴스 스토리지 바인드 그룹을 반환합니다.
     * [EN] Returns the instance storage bind group bound to group 1 during terrain rendering.
     *
     * @returns
     * [KO] 인스턴스 스토리지 `GPUBindGroup` 또는 `null`
     * [EN] Instance storage `GPUBindGroup` or `null`
     */
    get instanceStorageBindGroup(): GPUBindGroup | null;
    /**
     * [KO] 인스턴스 스토리지 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the instance storage bind group layout.
     *
     * @returns
     * [KO] 인스턴스 스토리지 `GPUBindGroupLayout` 또는 `null`
     * [EN] Instance storage `GPUBindGroupLayout` or `null`
     */
    get instanceStorageBindGroupLayout(): GPUBindGroupLayout | null;
    /**
     * [KO] 버퍼가 수용 가능한 최대 타일 컴포넌트 개수를 반환합니다.
     * [EN] Returns the maximum number of tile components the buffer can accommodate.
     *
     * @returns
     * [KO] 최대 타일 컴포넌트 개수
     * [EN] Maximum number of tile components
     */
    get maxComponentCount(): number;
    /**
     * [KO] 설정된 최대 LOD 레벨 수를 반환합니다.
     * [EN] Returns the configured maximum number of LOD levels.
     *
     * @returns
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     */
    get lodMaxLevel(): number;
    /**
     * [KO] 특정 인덱스 타일의 정적 위치 및 정규화 높이 경계 데이터를 CPU 버퍼에 기록합니다.
     * [EN] Writes static position and normalized height bound data of a tile at a specific index to the CPU buffer.
     *
     * @param index -
     * [KO] 타일 인덱스
     * [EN] Tile index
     * @param centerWorldX -
     * [KO] 타일 중심 월드 X 좌표
     * [EN] Tile center world X coordinate
     * @param centerWorldZ -
     * [KO] 타일 중심 월드 Z 좌표
     * [EN] Tile center world Z coordinate
     * @param minHeightNorm -
     * [KO] 정규화된 최소 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized minimum height value (`0.0` to `1.0`)
     * @param maxHeightNorm -
     * [KO] 정규화된 최대 높이값 (`0.0` ~ `1.0`)
     * [EN] Normalized maximum height value (`0.0` to `1.0`)
     */
    setStaticTileData(index: number, centerWorldX: number, centerWorldZ: number, minHeightNorm?: number, maxHeightNorm?: number): void;
    /**
     * [KO] 특정 인덱스 타일의 정규화된 최소/최대 높이 경계값만 갱신합니다.
     * [EN] Updates only the normalized minimum/maximum height bounds of a tile at a specific index.
     *
     * @param index -
     * [KO] 타일 인덱스
     * [EN] Tile index
     * @param minHeightNorm -
     * [KO] 정규화된 최소 높이값
     * [EN] Normalized minimum height value
     * @param maxHeightNorm -
     * [KO] 정규화된 최대 높이값
     * [EN] Normalized maximum height value
     */
    updateTileHeightBounds(index: number, minHeightNorm: number, maxHeightNorm: number): void;
    /**
     * [KO] CPU에 구성된 전체 타일 정적 데이터를 GPU 버퍼(`allTilesBuffer`)로 업로드합니다.
     * [EN] Uploads all static tile data configured on the CPU to the GPU buffer (`allTilesBuffer`).
     */
    uploadStaticTilesToGPU(): void;
    /**
     * [KO] 지형 버텍스 및 프래그먼트 셰이더에서 사용하는 전역 유니폼 버퍼를 갱신합니다.
     * [EN] Updates the global uniform buffer used by terrain vertex and fragment shaders.
     *
     * @param heightScale -
     * [KO] 지형 높이 스케일
     * [EN] Terrain height scale
     * @param worldSizeX -
     * [KO] 전체 지형의 가로(X) 월드 크기
     * [EN] Total world width (X) of the terrain
     * @param worldSizeZ -
     * [KO] 전체 지형의 세로(Z) 월드 크기
     * [EN] Total world depth (Z) of the terrain
     * @param lodColoration -
     * [KO] LOD 레벨별 디버그 색상 표시 여부
     * [EN] Whether to display debug colors per LOD level
     * @param maxComponentCount -
     * [KO] 최대 타일 컴포넌트 개수
     * [EN] Maximum number of tile components
     * @param tileSizeX -
     * [KO] 단일 타일 가로(X) 월드 크기
     * [EN] Single tile world width (X)
     * @param tileSizeZ -
     * [KO] 단일 타일 세로(Z) 월드 크기
     * [EN] Single tile world depth (Z)
     * @param baseQuads -
     * [KO] 기본 타일 쿼드 분할 수
     * [EN] Base tile quad subdivision count
     * @param vhtTextureWidth -
     * [KO] VHT 아틀라스 텍스처 가로 해상도
     * [EN] VHT atlas texture width resolution
     * @param vhtTextureHeight -
     * [KO] VHT 아틀라스 텍스처 세로 해상도
     * [EN] VHT atlas texture height resolution
     * @param lodColorsRGBA -
     * [KO] LOD 레벨별 RGBA 디버그 색상 배열
     * [EN] Array of RGBA debug colors per LOD level
     * @param lodDistancesSq -
     * [KO] LOD 레벨별 전환 거리 제곱(`distance^2`) 배열 (`Array<number>`)
     * [EN] Array of squared transition distances (`distance^2`) per LOD level (`Array<number>`)
     * @param tanHalfFOV -
     * [KO] 카메라 수직 시야각 절반의 탄젠트 값
     * [EN] Tangent of half the camera vertical field of view
     * @param lodMetric -
     * [KO] LOD 화면 공간 오차 메트릭
     * [EN] LOD screen-space error metric
     * @param lod0Quads -
     * [KO] LOD 0 단계의 쿼드 분할 수
     * [EN] Quad subdivision count at LOD 0
     * @param receiveShadow -
     * [KO] 그림자 수신 여부
     * [EN] Whether to receive shadows
     * @param castHeightmapShadow -
     * [KO] 하이트맵 레이마칭 자체 그림자 활성화 여부
     * [EN] Whether heightmap raymarching self-shadow is enabled
     * @param heightmapShadowSteps -
     * [KO] 하이트맵 그림자 레이마칭 스텝 수
     * [EN] Number of raymarching steps for heightmap shadow
     * @param heightmapShadowDistance -
     * [KO] 하이트맵 그림자 최대 추적 거리
     * [EN] Maximum trace distance for heightmap shadow
     * @param heightmapShadowSoftness -
     * [KO] 하이트맵 그림자 소프트니스 계수
     * [EN] Softness factor for heightmap shadow
     * @param debugMode -
     * [KO] 지형 셰이더 디버그 모드 인덱스
     * [EN] Terrain shader debug mode index
     */
    updateUniforms(heightScale: number, worldSizeX: number, worldSizeZ: number, lodColoration: boolean, maxComponentCount: number, tileSizeX: number, tileSizeZ: number, baseQuads: number, vhtTextureWidth: number, vhtTextureHeight: number, lodColorsRGBA: [number, number, number, number][], lodDistancesSq: number[], tanHalfFOV?: number, lodMetric?: number, lod0Quads?: number, receiveShadow?: boolean, castHeightmapShadow?: boolean, heightmapShadowSteps?: number, heightmapShadowDistance?: number, heightmapShadowSoftness?: number, debugMode?: number): void;
    /**
     * [KO] 매 프레임 컬링 패스 실행 전, 각 LOD의 `instanceCount`를 0으로 초기화한 인다이렉트 드로우 인자를 GPU 버퍼에 기록합니다.
     * [EN] Writes indirect draw arguments with `instanceCount` reset to 0 for each LOD to the GPU buffer before executing the culling pass each frame.
     *
     * @param sharedGeometry -
     * [KO] LOD별 인덱스 오프셋 및 정점 범위를 제공하는 공유 지오메트리 객체
     * [EN] Shared geometry object providing index offsets and vertex ranges per LOD
     * @param lodMaxLevel -
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     * @param isWireframe -
     * [KO] 와이어프레임 인덱스 범위 사용 여부
     * [EN] Whether to use wireframe index ranges
     */
    resetIndirectDrawBuffer(sharedGeometry: {
        getLODRange(lod: number): any;
    }, lodMaxLevel: number, isWireframe: boolean): void;
    /**
     * [KO] VHT, VNT 및 VBT 아틀라스 텍스처 뷰를 바인딩하여 인스턴스 스토리지 바인드 그룹을 갱신합니다.
     * [EN] Updates the instance storage bind group by binding VHT, VNT, and VBT atlas texture views.
     *
     * @param vhtTextureView -
     * [KO] 가상 하이트맵 아틀라스(VHT) 텍스처 뷰
     * [EN] Virtual Heightmap Texture (VHT) atlas view
     * @param vntTextureView -
     * [KO] 가상 노멀맵 아틀라스(VNT) 텍스처 뷰 (선택)
     * [EN] Virtual Normalmap Texture (VNT) atlas view (optional)
     * @param vbtBaseColorView -
     * [KO] 가상 블렌드 BaseColor 아틀라스(VBT) 텍스처 뷰 (선택)
     * [EN] Virtual Blend Texture (VBT) BaseColor atlas view (optional)
     * @param vbtNormalView -
     * [KO] 가상 블렌드 Normal 아틀라스(VBT) 텍스처 뷰 (선택)
     * [EN] Virtual Blend Texture (VBT) Normal atlas view (optional)
     * @param vbtORMView -
     * [KO] 가상 블렌드 ORM 아틀라스(VBT) 텍스처 뷰 (선택)
     * [EN] Virtual Blend Texture (VBT) ORM atlas view (optional)
     */
    updateBindGroup(vhtTextureView: GPUTextureView, vntTextureView?: GPUTextureView, vbtBaseColorView?: GPUTextureView, vbtNormalView?: GPUTextureView, vbtORMView?: GPUTextureView): void;
    /**
     * [KO] 할당된 모든 GPU 버퍼(`allTilesBuffer`, `visibleTilesBuffer`, `indirectDrawBuffer`, `landscapeUniformBuffer`)를 파괴합니다.
     * [EN] Destroys all allocated GPU buffers (`allTilesBuffer`, `visibleTilesBuffer`, `indirectDrawBuffer`, `landscapeUniformBuffer`).
     */
    destroy(): void;
}
export default LandscapeInstanceBuffer;
